import { Outlet } from "react-router-dom";
import { Toaster } from "@components/shadcn/Toaster";

function RootLayout(): JSX.Element {
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
