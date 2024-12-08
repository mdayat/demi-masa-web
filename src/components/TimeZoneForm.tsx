import {
  useStore,
  WIBTimeZone,
  WITATimeZone,
  WITTimeZone,
} from "@hooks/useStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./shadcn/Form";
import { Button } from "./shadcn/Button";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shadcn/Select";

const errMsg =
  "Zona waktu tidak boleh kosong dan hanya dapat memilih salah satu diantara: WIB, WITA, dan WIT.";

const formSchema = z.object({
  timeZone: z.union(
    [
      z.literal(WIBTimeZone, { message: errMsg }),
      z.literal(WITATimeZone, { message: errMsg }),
      z.literal(WITTimeZone, { message: errMsg }),
    ],
    { message: errMsg }
  ),
});

interface TimeZoneFormProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

function TimeZoneForm({ setOpen }: TimeZoneFormProps) {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const resp = await createAxiosInstance().put(
        `/users/${user?.id}/time-zone`,
        { time_zone: values.timeZone },
        {
          headers: {
            Authorization: `Bearer ${user!.idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        toast({
          description: "Berhasil menetapkan zona waktu.",
          variant: "default",
        });

        setUser((user) => ({
          ...user!,
          timeZone: values.timeZone,
        }));

        if (setOpen !== undefined) {
          setOpen(false);
        }
      } else if (resp.status === 400) {
        throw new Error("invalid json body");
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to select time zone", { cause: error }));
      toast({
        description: "Gagal menetapkan zona waktu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zona Waktu</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={WIBTimeZone}>WIB</SelectItem>
                  <SelectItem value={WITATimeZone}>WITA</SelectItem>
                  <SelectItem value={WITTimeZone}>WIT</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

export { TimeZoneForm };
