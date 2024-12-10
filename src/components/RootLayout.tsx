import { Outlet, useLocation, useNavigate } from "react-router";
import { Toaster } from "@components/shadcn/Toaster";
import {
  useStore,
  type AccountType,
  type IndonesiaTimeZone,
  type User,
} from "@hooks/useStore";
import { useAxios } from "@hooks/useAxios";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@libs/firebase";
import { useToast } from "@hooks/shadcn/useToast";
import { NavigationBar } from "./NavigationBar";

function RootLayout(): JSX.Element {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const createAxiosInstance = useAxios();
  const { toast } = useToast();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user !== null) {
        try {
          const idToken = await user.getIdToken();
          const resp = await createAxiosInstance().post<{
            phone_number: string;
            phone_verified: boolean;
            account_type: AccountType;
            upgraded_at: string;
            expired_at: string;
            time_zone: IndonesiaTimeZone;
          }>(
            "/login",
            { id_token: idToken },
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const loggedUser: User = {
            id: user.uid ?? "",
            name: user.displayName ?? "",
            email: user.email ?? "",
            phoneNumber: "",
            phoneVerified: false,
            accountType: "FREE",
            timeZone: undefined,
            idToken,
          };

          if (resp.status === 201) {
            setUser(loggedUser);
          } else if (resp.status === 200) {
            setUser({
              ...loggedUser,
              phoneNumber: resp.data.phone_number ?? "",
              phoneVerified: resp.data.phone_verified,
              accountType: resp.data.account_type,
              timeZone: resp.data.time_zone,
            });
          } else if (resp.status === 400) {
            throw new Error("invalid json body");
          } else if (resp.status === 404) {
            throw new Error("invalid id token");
          } else {
            throw new Error(`unknown response status code ${resp.status}`);
          }
        } catch (error) {
          console.error(
            new Error("failed to login with Google", { cause: error })
          );

          toast({
            description: "Gagal login menggunakan akun Google",
            variant: "destructive",
          });
          auth.signOut();
        }
      } else {
        setUser(undefined);
      }
      setIsLoading(false);
    });
  }, [setUser, createAxiosInstance, toast]);

  useEffect(() => {
    if (isLoading) return;

    if (user === undefined && location.pathname !== "/") {
      navigate("/");
      return;
    }

    if (user !== undefined) {
      if (
        (user.phoneVerified === false || user.timeZone === undefined) &&
        location.pathname !== "/profile-completion"
      ) {
        navigate("/profile-completion");
        return;
      }

      if (
        user.phoneVerified &&
        user.timeZone !== undefined &&
        (location.pathname === "/profile-completion" ||
          location.pathname === "/")
      ) {
        navigate("/dashboard");
      }
    }
  }, [isLoading, user, location, navigate]);

  if (isLoading) {
    return <></>;
  }

  if (user === undefined && location.pathname !== "/") {
    return <></>;
  }

  if (user !== undefined && location.pathname === "/") {
    return <></>;
  }

  return (
    <>
      <Toaster />

      <main className="h-screen overflow-scroll">
        <div className="border border-[#E1E1E1] rounded-b-[40px] py-2.5">
          <div className="flex justify-center items-center gap-2">
            <img
              src="demi-masa-logo.png"
              alt="Logo Aplikasi Demi Masa"
              className="w-9"
            />

            <h2 className="text-black font-bold text-xl">Demi Masa</h2>
          </div>
        </div>

        <Outlet />
        {user !== undefined ? <NavigationBar /> : <></>}
      </main>
    </>
  );
}

export { RootLayout };
