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
import { firebaseConfig } from "../firebase/config";
import { httpFetch } from "./_httpClient";

const ENDPOINT = "https://identitytoolkit.googleapis.com/v1/accounts";

export const authService = {
  // signIn: async (email: string, password: string): Promise<UserCredential> => {
  //   return signInWithEmailAndPassword(auth, email, password);
  // },
  // listenAuthState: (cb: (user: User | null) => void): Unsubscribe => {
  //   return onAuthStateChanged(auth, cb);
  // },
  signIn,
  signOut,
  validateFirebaseIdToken,
};

async function signIn(email: string, password: string): Promise<Response> {

  // login via Firebase REST
  const response = await httpFetch(
    `${ENDPOINT}:signInWithPassword?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  )

  return response;
}

function signOut(): Promise<void> {
  return signOutFirebase(auth);
}

async function validateFirebaseIdToken(
  idToken: string
): Promise<FirebaseTokenValidationResult> {
  try {
    const response = await fetch( // TODO: refatorar para usar o encapsulamento httpFetch()
      `${ENDPOINT}:lookup?key=${firebaseConfig.apiKey}`, // TODO: usar process.env.FIREBASE_API_KEY com a lib .env
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
