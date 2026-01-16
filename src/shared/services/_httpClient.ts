import { clearTokenFromStorage, getAccessTokenFromStorage } from "../helpers/auth";

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

  const token = auth ? getAccessTokenFromStorage() : null;

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token.idToken}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401) {
    clearTokenFromStorage();
    window.location.href = "/";
    // window.location.reload();
    throw new Error("Token inválido — redirecionando");
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[HTTP ${response.status}] ${body}`);
  }

  return response;
}
