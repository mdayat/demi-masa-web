import { Outlet } from "react-router-dom";
import { Toaster } from "@components/shadcn/Toaster";
import { useStore } from "@hooks/useStore";
import { Button } from "./shadcn/Button";

function RootLayout(): JSX.Element {
  const user = useStore((state) => state.user);

  return (
    <>
      <Toaster />

      {user !== undefined && (
        <Button
          variant="destructive"
          onClick={async () => {
            const { auth } = await import("@libs/firebase");
            auth.signOut();
          }}
        >
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
