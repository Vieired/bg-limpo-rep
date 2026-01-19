import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { firebaseConfig } from "./shared/firebase/config";

// Inicializa app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Messaging
export const messaging = getMessaging(app);