import {
  // onAuthStateChanged,
  // signInWithEmailAndPassword,
  signOut as signOutFirebase,
  // type Unsubscribe,
  // type User,
//   type UserCredential,
} from "firebase/auth";
import { auth } from "../helpers/auth";
import type { FirebaseTokenValidationResult } from "../models/domain/Auth";

export const authService = {
  // signIn: async (email: string, password: string): Promise<UserCredential> => {
  //   return signInWithEmailAndPassword(auth, email, password);
  // },
  // listenAuthState: (cb: (user: User | null) => void): Unsubscribe => {
  //   return onAuthStateChanged(auth, cb);
  // },
  signOut,
  validateFirebaseIdToken,
};

function signOut(): Promise<void> {
  return signOutFirebase(auth);
}

async function validateFirebaseIdToken(
  idToken: string
): Promise<FirebaseTokenValidationResult> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        valid: false,
        error: data?.error?.message || "INVALID_TOKEN",
      };
    }

    const user = data.users?.[0];

    if (!user) {
      return {
        valid: false,
        error: "USER_NOT_FOUND",
      };
    }

    return {
      valid: true,
      user: {
        uid: user.localId,
        email: user.email,
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return {
      valid: false,
      error: "NETWORK_ERROR",
    };
  }
}
