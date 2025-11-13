import {
  // onAuthStateChanged,
  // signInWithEmailAndPassword,
  signOut as logOut,
//   type Unsubscribe,
//   type User,
//   type UserCredential,
} from "firebase/auth";
import { auth } from "../helpers/auth";

// export const authService = {
//   signIn: async (email: string, password: string): Promise<UserCredential> => {
//     return signInWithEmailAndPassword(auth, email, password);
//   },
//   listenAuthState: (cb: (user: User | null) => void): Unsubscribe => {
//     return onAuthStateChanged(auth, cb);
//   },
//   signOut: (): Promise<void> => {
//     return signOut(auth);
//   }
// };

export interface AuthTokens {
  idToken: string;
  expiresAt: number; // timestamp em ms
}

const TOKEN_KEY = "auth_tokens";

export function getTokens(): AuthTokens | null {
  const data = localStorage.getItem(TOKEN_KEY);
  return data ? JSON.parse(data) : null;
}

export function setTokens(idToken: string, expiresInSeconds: number) {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ idToken, expiresAt })
  );
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const tokens = getTokens();
  return !!tokens && Date.now() < tokens.expiresAt;
}

// export const signIn = (email: string, password: string) => {
//   ...
// }

export const signOut = (): Promise<void> => {
  return logOut(auth);
}