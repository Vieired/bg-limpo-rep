import type { AuthTokens } from "../../contexts/authContext";

type FetchOptions = RequestInit & {
  auth?: boolean;
};

export async function httpFetch(
  url: string,
  options: FetchOptions = {}
) {

  const {
    auth = true,
    headers,
    ...rest
  } = options;

  const token = auth ? await getAccessToken() : null;

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token.idToken}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[HTTP ${response.status}] ${body}`);
  }

  return response;
}

const TOKEN_KEY = "auth_tokens";

export function getAccessToken(): AuthTokens | null {
  const data = localStorage.getItem(TOKEN_KEY);
  return data ? JSON.parse(data) : null;
};

export function setTokens(idToken: string, expiresInSeconds: number): void {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ idToken, expiresAt })
  );
};

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
};

export const isAuthenticated = (): boolean => {
  const tokens = getAccessToken();
  return !!tokens && Date.now() < tokens.expiresAt;
};