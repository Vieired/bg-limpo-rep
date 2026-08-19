import { toast } from "react-toastify";
import { getAccessTokenFromStorage, clearTokenAndRedirectToLogin } from "../helpers/auth";
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
          clearTokenAndRedirectToLogin();
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

  if (response.status === 401) { // o bug #1 acontece, pois o fetch retorna primeiro e falha, entrando aqui. E após limpar o token inválido, redireciona novamente pelo location.ref
    clearTokenAndRedirectToLogin();
    toast.error("Sessão expirada (401)");
    throw new Error("Sessão expirada");
  }

  if (response.status === 403) {
    clearTokenAndRedirectToLogin();
    const msgError = "Usuário sem permissão para este conteúdo (403)";
    toast.error(msgError);
    throw new Error(msgError);
  }

  if (!response.ok) {
    const body = await response.text();
    toast.error(`[HTTP ${response.status}] ${JSON.parse(body).error.message}`);
    throw new Error(`[HTTP ${response.status}] ${body}`);
  }

  return response;
}
