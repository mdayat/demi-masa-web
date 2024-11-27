import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@components/shadcn/Toaster";
import { useStore, type AccountType, type User } from "@hooks/useStore";
import { useAxios } from "@hooks/useAxios";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@libs/firebase";
import { useToast } from "@hooks/shadcn/useToast";

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
            accountType: "free",
            upgradedAt: "",
            expiredAt: "",
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
              upgradedAt: resp.data.upgraded_at ?? "",
              expiredAt: resp.data.expired_at ?? "",
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
    } else if (
      user !== undefined &&
      user.phoneVerified &&
      (location.pathname === "/phone-verification" || location.pathname === "/")
    ) {
      navigate("/dashboard");
    } else if (
      user !== undefined &&
      user.phoneVerified === false &&
      location.pathname !== "/phone-verification"
    ) {
      navigate("/phone-verification");
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

      <main>
        <Outlet />
      </main>
    </>
  );
}

export { RootLayout };
