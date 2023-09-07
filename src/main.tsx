import App from "app/app";
import "./index.css";

import { createRoot } from "react-dom/client";
import { registerAllModules } from "handsontable/registry";
import { ContextMenu, registerPlugin } from "handsontable/plugins";

import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MoneyTracker from "app/money-tracker/money-tracker";
import ErrorPage from "components/router-handlers/error-page";

registerPlugin(ContextMenu);
registerAllModules();

const container = document.getElementById("root");
if (!container) throw new Error("No root element found");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <div>Welcome to the Spending Tracker!</div>,
      },
      {
        path: "/money-tracker/:year/:month",
        element: <MoneyTracker />,
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
  </Auth0Provider>,
);
