import { useStore } from "@hooks/useStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./shadcn/Form";
import { Input } from "./shadcn/Input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./shadcn/InputOtp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "./shadcn/Button";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /^\+62\d{9,13}$/,
      "Nomor handphone harus diawali dengan +62 dan memiliki panjang 10 - 15 digit."
    ),
  pin: z.string().min(6, {
    message: "Kode OTP harus berupa angka dan memiliki panjang 6 digit.",
  }),
});

interface WhatsAppVerificationProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

function WhatsAppVerification({ setOpen }: WhatsAppVerificationProps) {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [otpDuration, setOtpDuration] = useState(0);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "+62",
      pin: "",
    },
  });

  const handleCreateOTP = async () => {
    setIsLoading(true);
    const isPhoneNumberValid = await form.trigger("phoneNumber");
    if (isPhoneNumberValid === false) {
      setIsLoading(false);
      return;
    }

    const phoneNumber = form.getValues("phoneNumber");
    try {
      const resp = await createAxiosInstance().post(
        "/otp/generation",
        { phone_number: phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${user!.idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 201) {
        const twoMinute = 60 * 2;
        setOtpDuration(twoMinute);

        toast({
          description: `Kode OTP telah dikirim ke nomor WhatsApp: ${phoneNumber}`,
          variant: "default",
        });
      } else if (resp.status === 400) {
        throw new Error("invalid json body");
      } else if (resp.status === 409) {
        const retryAfter: string | undefined = resp.headers["retry-after"];
        if (retryAfter !== undefined) {
          setOtpDuration(parseInt(retryAfter));
        }

        toast({
          description: (resp.data as { message: string }).message,
          variant: "destructive",
        });
      } else if (resp.status === 429) {
        toast({
          description: (resp.data as { message: string }).message,
          variant: "destructive",
        });
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to create OTP", { cause: error }));
      toast({
        description: "Gagal membuat kode OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const resp = await createAxiosInstance().post(
        "/otp/verification",
        { phone_number: values.phoneNumber, user_otp: values.pin },
        {
          headers: {
            Authorization: `Bearer ${user!.idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        toast({
          description: "Nomor WhatsApp berhasil diverifikasi",
          variant: "default",
        });

        setUser((user) => ({
          ...user!,
          phoneNumber: values.phoneNumber,
          phoneVerified: true,
        }));

        if (setOpen !== undefined) {
          setOpen(false);
        }
      } else if (resp.status === 400) {
        throw new Error("invalid json body");
      } else if (resp.status === 401 || resp.status === 404) {
        toast({
          description: (resp.data as { message: string }).message,
          variant: "destructive",
        });
      } else if (resp.status === 429) {
        const retryAfter = resp.headers["retry-after"] as string;
        setOtpDuration(parseInt(retryAfter));

        toast({
          description: (resp.data as { message: string }).message,
          variant: "destructive",
        });
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to verify OTP", { cause: error }));
      toast({
        description: "Gagal memverifikasi kode OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOtpDuration((value) => {
        if (value > 1) {
          return value - 1;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [otpDuration]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="tel"
                    placeholder="+62"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode OTP</FormLabel>
                <FormControl>
                  <InputOTP
                    disabled={isLoading}
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {otpDuration !== 0 && (
            <p className="text-[#757575] text-center text-sm w-3/4 mx-auto">
              Tunggu <strong className="text-black">{otpDuration}</strong>
              &nbsp; detik untuk mengirim ulang kode OTP.
            </p>
          )}

          <div className="flex items-center gap-6">
            <Button
              onClick={handleCreateOTP}
              disabled={isLoading || otpDuration !== 0}
              type="button"
              className="w-full"
            >
              {isLoading ? "Loading..." : "Buat OTP"}
            </Button>

            <Button
              disabled={isLoading}
              type="submit"
              className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 w-full"
            >
              {isLoading ? "Loading..." : "Verifikasi OTP"}
            </Button>
          </div>
        </form>
      </Form>

      <div>
        <p className="font-bold mb-2 mt-6">Catatan:</p>
        <ul className="list-disc text-sm flex flex-col gap-2 ml-6">
          <li>Kamu hanya dapat membuat kode OTP sebanyak 3x per hari.</li>
          <li>Masa berlaku kode OTP hanya 2 menit.</li>
          <li>Kamu memiliki kesempatan 3x untuk verifikasi kode OTP.</li>
        </ul>
      </div>
    </>
  );
}

export { WhatsAppVerification };
