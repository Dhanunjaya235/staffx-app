// auth/useMicrosoftAuth.ts
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { CLIENT_ID, SCOPES, TENANT_ID } from "../constants";



export const useMicrosoftAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("useMicrosoftAuth initialized");
  console.log("CLIENT_ID:", CLIENT_ID);
  // Use auto-discovery from Microsoft
const discovery = AuthSession.useAutoDiscovery(
  `https://login.microsoftonline.com/${TENANT_ID}/v2.0`
);

// Redirect URI for Expo
// During development use scheme-based redirect (works with Expo Go)
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "staffx",
  path:'auth',
  //@ts-ignore
  projectNameForProxy: "@my-expo-app/my-expo-app",
});

console.log("Redirect URI 9:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri,
      responseType: "code",
      usePKCE: true,
    },
    discovery
  );

  // Load stored tokens
  useEffect(() => {
    console.log("Loading stored tokens...");
    (async () => {
      const storedAccess = await SecureStore.getItemAsync("ms_access_token");
      const storedRefresh = await SecureStore.getItemAsync("ms_refresh_token");
      if (storedAccess) setAccessToken(storedAccess);
      if (storedRefresh) setRefreshToken(storedRefresh);
      setLoading(false);
    })();
  }, []);

  // Handle login response
  useEffect(() => {
    console.log("Auth Response:", response);
    if (response?.type === "success" && response.params.code) {
      exchangeCodeForToken(response.params.code);
    }
  }, [response]);

  // Exchange auth code for token using PKCE code_verifier
  const exchangeCodeForToken = async (code: string) => {
    console.log("Exchanging code for token:", code);
    try {
      const formData = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        scope: SCOPES.join(" "),
        code,
        redirect_uri: redirectUri,
        code_verifier: request?.codeVerifier ?? "",
      }).toString();

      const res = await fetch(discovery?.tokenEndpoint ?? "", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Token endpoint error", { status: res.status, data });
      }
      console.log("Token Response:", data);
      if (data.access_token) {
        await SecureStore.setItemAsync("ms_access_token", data.access_token);
        if (data.refresh_token) {
          await SecureStore.setItemAsync("ms_refresh_token", data.refresh_token);
        }
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
      } else {
        console.error("No access_token in token response", data);
      }
    } catch (err) {
      console.error("Token exchange failed:", err);
    }
  };

  // Refresh access token when expired
  const refreshAccessToken = async () => {
    if (!refreshToken || !discovery?.tokenEndpoint) return;

    try {
      const formData = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: SCOPES.join(" "),
      }).toString();

      const res = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Refresh token endpoint error", { status: res.status, data });
      }
      if (data.access_token) {
        await SecureStore.setItemAsync("ms_access_token", data.access_token);
        if (data.refresh_token)
          await SecureStore.setItemAsync("ms_refresh_token", data.refresh_token);

        setAccessToken(data.access_token);
      } else {
        console.error("No access_token in refresh response", data);
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("ms_access_token");
      await SecureStore.deleteItemAsync("ms_refresh_token");
      setAccessToken(null);
      setRefreshToken(null);
      setLoading(false);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return {
    accessToken,
    refreshAccessToken,
    loading,
    promptAsync,
    request,
    logout,

  };
};
