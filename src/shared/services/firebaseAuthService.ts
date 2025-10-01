import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
  type UserCredential,
} from "firebase/auth";
import { firebaseConfig } from "../firebase/config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const firebaseAuthService = {
  signIn: async (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  },
  listenAuthState: (cb: (user: User | null) => void): Unsubscribe => {
    return onAuthStateChanged(auth, cb);
  },
  signOut: (): Promise<void> => {
    return signOut(auth);
  }
};