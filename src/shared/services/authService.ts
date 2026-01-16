import {
  // onAuthStateChanged,
  // signInWithEmailAndPassword,
  signOut as logout,
  // type Unsubscribe,
  // type User,
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

// export function listenAuthState(cb: (user: User | null) => void): Unsubscribe {
//   return onAuthStateChanged(auth, cb);
// }

// export const signIn = (email: string, password: string) => {
//   ...
// }

export const signOut = (): Promise<void> => {
  return logout(auth);
}