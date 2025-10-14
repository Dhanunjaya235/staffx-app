import { CLIENT_ID, TENANT_ID, SCOPES } from "../../constants";
import * as SecureStore from "expo-secure-store";

export const getMicrosoftToken = async () => {
  let token = await SecureStore.getItemAsync("ms_access_token");
  const refreshToken = await SecureStore.getItemAsync("ms_refresh_token");

  const isExpired = checkIfTokenExpired(token);
  if (isExpired && refreshToken) {
    token = await refreshAccessToken(refreshToken);
  }

  return token;
};

const checkIfTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp * 1000;
  return Date.now() > exp;
};

const refreshAccessToken = async (refreshToken: string) => {
  const tenantId = TENANT_ID;
  const clientId = CLIENT_ID;

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const formData = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    scope: SCOPES.join(" "),
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const json = await res.json();
  if (json.access_token) {
    await SecureStore.setItemAsync("ms_access_token", json.access_token);
    if (json.refresh_token) {
      await SecureStore.setItemAsync("ms_refresh_token", json.refresh_token);
    }
    return json.access_token;
  } else {
    throw new Error("Failed to refresh token");
  }
};
