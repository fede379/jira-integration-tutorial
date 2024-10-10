import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IssuesPage from "./routes/issues";
import WorkspacesPage from "./routes/workspaces";
import LoginPage from "./routes/login";
import ErrorPage from "./routes/error";
import RootPage from "./routes/root";
import JiraOauthPage from "./routes/oauth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "issues",
        element: <IssuesPage />,
      },
      {
        path: "workspaces",
        element: <WorkspacesPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/oauth/jira",
    element: <JiraOauthPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
