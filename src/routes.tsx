import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));

const ErrorBoundary = lazy(() =>
  import("./components/ErrorBoundary").then(({ ErrorBoundary }) => ({
    default: ErrorBoundary,
  }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: (
      <Suspense fallback={<></>}>
        <ErrorBoundary />
      </Suspense>
    ),
    element: (
      <Suspense fallback={<></>}>
        <Home />
      </Suspense>
    ),
  },
]);
