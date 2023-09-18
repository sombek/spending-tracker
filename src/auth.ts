import { createAuth0Client } from "@auth0/auth0-spa-js";

interface AuthProvider {
  isAuthenticated(): Promise<boolean>;

  accessToken(): Promise<null | string>;

  signIn(type: "redirect" | "popup", redirectTo: string): Promise<void>;

  handleSignInRedirect(): Promise<void>;

  signOut(): Promise<void>;
}

// You probably want these coming from sort of endpoint you can query,
// instead of hardcoded in your application bundle
const AUTH0_DOMAIN = "dev-bmbazij1sjiidmnc.us.auth0.com";
const AUTH0_CLIENT_ID = "KlmFtMTS4iF7yX9ovkuyzGULvMak8SGC";

let auth0ClientPromise: ReturnType<typeof createAuth0Client>;

function getClient() {
  if (!auth0ClientPromise) {
    auth0ClientPromise = createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      cacheLocation: "localstorage",
      authorizationParams: {
        audience: "https://hello-world.example.com",
        redirect_uri: window.location.origin,
      },
    });
  }
  return auth0ClientPromise;
}

export const auth0AuthProvider: AuthProvider = {
  async isAuthenticated() {
    const client = await getClient();
    return client.isAuthenticated();
  },
  async accessToken() {
    const client = await getClient();
    return (await client.getTokenSilently()) || null;
  },
  async signIn(type: string, redirectTo: string) {
    const client = await getClient();
    if (type === "redirect") {
      await client.loginWithRedirect({
        authorizationParams: {
          redirect_uri:
            window.location.origin +
            "/login-result?" +
            new URLSearchParams([["redirectTo", redirectTo]]).toString(),
        },
      });
    } else {
      await client.loginWithPopup();
    }
  },
  async handleSignInRedirect() {
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      const client = await getClient();
      await client.handleRedirectCallback();
    }
  },
  async signOut() {
    const client = await getClient();
    await client.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  },
};
