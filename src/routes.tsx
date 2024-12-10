import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "@components/RootLayout";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProfileCompletion = lazy(() => import("./pages/ProfileCompletion"));
const Profile = lazy(() => import("./pages/Profile"));
const ToDoList = lazy(() => import("./pages/ToDoList"));

const ErrorBoundary = lazy(() =>
  import("@components/ErrorBoundary").then(({ ErrorBoundary }) => ({
    default: ErrorBoundary,
  }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
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
        path: "profile-completion",
        element: (
          <Suspense fallback={<></>}>
            <ProfileCompletion />
          </Suspense>
        ),
      },

      {
        path: "profile",
        element: (
          <Suspense fallback={<></>}>
            <Profile />
          </Suspense>
        ),
      },

      {
        path: "to-do-list",
        element: (
          <Suspense fallback={<></>}>
            <ToDoList />
          </Suspense>
        ),
      },
    ],
  },
]);
