import { Button } from "@components/shadcn/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/shadcn/Form";
import { Input } from "@components/shadcn/Input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@components/shadcn/InputOtp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore } from "@hooks/useStore";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /^\+62\d{9,13}$/,
      "Nomor handphone harus diawali dengan +62 dan memiliki panjang 10 - 15 digit"
    ),
  pin: z.string().min(6, {
    message: "Kode OPT harus 6 digit.",
  }),
});

function PhoneVerification() {
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
    try {
      await form.trigger("phoneNumber");
      const resp = await createAxiosInstance().post(
        "/otp/generation",
        { phone_number: form.getValues("phoneNumber") },
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
          description:
            "Nomor WhatsApp berhasil diverifikasi. Kamu akan diarahkan ke halaman Dashboard dalam 3 detik",
          variant: "default",
        });

        setTimeout(() => {
          setUser((user) => ({ ...user!, phoneVerified: true }));
        }, 3000);
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
                  <Input type="tel" placeholder="+62" {...field} />
                </FormControl>

                <FormDescription>
                  Masukkan nomor WhatsApp kamu agar kami dapat mengirim
                  pengingat salat
                </FormDescription>
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

                <FormDescription>
                  Kamu hanya memiliki 3x kesempatan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-6">
            <Button
              onClick={handleCreateOTP}
              disabled={isLoading || otpDuration !== 0}
              type="button"
            >
              {isLoading ? "Loading..." : "Buat OTP"}
            </Button>

            <Button disabled={isLoading} type="submit">
              {isLoading ? "Loading..." : "Verifikasi OTP"}
            </Button>
          </div>
        </form>
      </Form>

      {otpDuration !== 0 && (
        <p>Tunggu {otpDuration} detik untuk mengirim kode OTP baru</p>
      )}
    </>
  );
}

export default PhoneVerification;
