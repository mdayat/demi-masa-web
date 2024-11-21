import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@components/shadcn/Toaster";
import { useStore, type User } from "@hooks/useStore";
import { Button } from "./shadcn/Button";
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
            phone_verified: boolean;
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
            avatarURL: user.photoURL ?? "",
            phoneVerified: false,
            idToken,
          };

          if (resp.status === 201) {
            setUser(loggedUser);
          } else if (resp.status === 200) {
            setUser({ ...loggedUser, phoneVerified: resp.data.phone_verified });
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

      {user !== undefined && (
        <Button variant="destructive" onClick={() => auth.signOut()}>
          Logout
        </Button>
      )}

      <main>
        <Outlet />
      </main>
    </>
  );
}

export { RootLayout };
