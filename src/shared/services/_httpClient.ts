import { toast } from "react-toastify";
import { clearTokenFromStorage, getAccessTokenFromStorage } from "../helpers/auth";
import { authService } from "./authService";
import type { FirebaseTokenValidationResult } from "../models/domain/Auth";

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

  if (token) {
    authService.validateFirebaseIdToken(token.idToken)
      .then((response: FirebaseTokenValidationResult) => {
        if (!response?.valid) {
          clearTokenFromStorage();
          window.location.reload();
        }
      })
  }

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token.idToken}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    clearTokenFromStorage();
    window.location.reload();
    // window.location.href = "/";
    throw new Error("Token inválido — redirecionando");
  }

  if (!response.ok) {
    const body = await response.text();
    toast.error(`[HTTP ${response.status}] ${JSON.parse(body).error.message}`);
    throw new Error(`[HTTP ${response.status}] ${body}`);
  }

  return response;
}
