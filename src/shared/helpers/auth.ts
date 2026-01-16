import { firebaseConfig } from "../firebase/config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { AuthTokens } from "../../contexts/authContext";

const TOKEN_KEY = "auth_tokens";

export function getAccessTokenFromStorage(): AuthTokens | null {
  const data = localStorage.getItem(TOKEN_KEY);
  return data ? JSON.parse(data) : null;
};

export const isAuthenticated = (): boolean => {
  const tokens = getAccessTokenFromStorage();
  return !!tokens && Date.now() < tokens.expiresAt;
};

export function setTokenToStorage(idToken: string, expiresInSeconds: number): void {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ idToken, expiresAt })
  );
};

export function clearTokenFromStorage(): void {
  localStorage.removeItem(TOKEN_KEY)
};

export const getStorageToken = () => {
  const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  return currentUser?.stsTokenManager?.accessToken as string;
}

export const checkIfAuthenticationIsRequired = () => { // TODO: remover se continuar sem uso
    const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

    if (currentUser?.stsTokenManager?.expirationTime < new Date().getTime()) { // compara timestamp
        localStorage.clear();
        document.location.reload();
    }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// export const getAccessToken = async () => {
//   const user = auth.currentUser;
//   // if (!user) throw new Error("Usuário não autenticado");
//   if (!user) return;
  
//   return await user.getIdToken(); // Firebase cuida da renovação
// }