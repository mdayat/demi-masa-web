import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@components/RootLayout";
import { UserProvider } from "@contexts/User";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PhoneNumber = lazy(() => import("./pages/PhoneNumber"));

const ErrorBoundary = lazy(() =>
  import("@components/ErrorBoundary").then(({ ErrorBoundary }) => ({
    default: ErrorBoundary,
  }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <RootLayout />
      </UserProvider>
    ),
    errorElement: (
      <Suspense fallback={<></>}>
        <ErrorBoundary />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<></>}>
            <Home />
          </Suspense>
        ),
      },

      {
        path: "dashboard",
        element: (
          <Suspense fallback={<></>}>
            <Dashboard />
          </Suspense>
        ),
      },

      {
        path: "phone-number",
        element: (
          <Suspense fallback={<></>}>
            <PhoneNumber />
          </Suspense>
        ),
      },
    ],
  },
]);
