import App from "app/app";
import "./index.css";

import { createRoot } from "react-dom/client";
import { registerAllModules } from "handsontable/registry";
// import { ContextMenu, registerPlugin } from "handsontable/plugins";
import { Analytics } from "@vercel/analytics/react";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MoneyTracker from "app/money-tracker/money-tracker";
import ErrorPage from "components/router-handlers/error-page";
import { getYearMonthData } from "infrastructure/backend-service";
import { auth0AuthProvider } from "./auth";
import Homepage from "app/homepage";
import { ReactNode } from "react";

// registerPlugin(ContextMenu);
registerAllModules();

const container = document.getElementById("root");
if (!container) throw new Error("No root element found");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
function Protected({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default Protected;
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/money-tracker/:year/:month/:storageType",
        element: <MoneyTracker />,

        loader: async ({ params }) => {
          console.log("params", params);
          const isAuthenticated = await auth0AuthProvider.isAuthenticated();
          if (!isAuthenticated) return console.log("User is not authenticated");

          const access_token = await auth0AuthProvider.accessToken();
          if (!access_token) throw new Error("No access token");
          if (!params.year || !params.month)
            throw new Error("Year or month not provided");

          return await getYearMonthData(
            +params.year,
            +params.month,
            access_token,
          );
        },
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/callback",
    element: <div>Callback</div>,
  },
]);

root.render(
  <Auth0Provider
    domain="dev-bmbazij1sjiidmnc.us.auth0.com"
    clientId="KlmFtMTS4iF7yX9ovkuyzGULvMak8SGC"
    cacheLocation="localstorage"
    authorizationParams={{
      audience: "https://hello-world.example.com",
      redirect_uri: window.location.origin,
    }}
  >
    <RouterProvider router={router} />
    <Analytics />
  </Auth0Provider>,
);
