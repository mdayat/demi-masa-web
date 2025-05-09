import { useState } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useToast } from "@hooks/shadcn/useToast";
import type { AuthModel } from "../../models/AuthModel";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenStorage } from "@utils/token";

const formSchema = z.object({
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(8, { message: "Harus memiliki minimal 8 karakter" }),
});

function useLoginViewModel(authModel: AuthModel) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const login = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await authModel.login({
        email: values.email,
        password: values.password,
      });

      if (res.status === 200) {
        toast({ description: "Login berhasil.", variant: "default" });
        tokenStorage.setAccessToken(res.data.access_token);
        tokenStorage.setRefreshToken(res.data.refresh_token);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (res.status === 400) {
        throw new Error("invalid request body");
      } else if (res.status === 404) {
        toast({
          description:
            "Akun tidak ditemukan. Silakan melakukan registrasi terlebih dahulu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      handleAxiosError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isPasswordVisible,
    form,
    login,
    setIsPasswordVisible,
    togglePasswordVisibility,
  };
}

export { useLoginViewModel };
