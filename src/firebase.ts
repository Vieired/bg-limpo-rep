// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";
// import { getFirestore } from "firebase/firestore";
// import { firebaseConfig } from "./shared/firebase/config";


// // Inicializar app Firebase
// const app = initializeApp(firebaseConfig);

// // Exportar Firestore (caso você use)
// export const db = getFirestore(app);

// // Exportar Messaging (obrigatório para Push)
// export const messaging = getMessaging(app);



import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from "./shared/firebase/config";

// Inicializa app Firebase
const app = initializeApp(firebaseConfig);
const VAPID_PUBLIC_KEY = "BPKrMEgi8Q4pYUaiXoDPK3pktNFCgdwgVyv-Z5Jlpo4oADyxVPpsb7QJ9Im7GTSaC_QWb3nSELcMtwP1u6NSrrU";

// Inicializa Messaging
export const messaging = getMessaging(app);

// Solicita permissão para notificações e retorna o token FCM
export async function requestNotificationPermission(): Promise<string> {
  console.log("Solicitando permissão para notificações...");

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Permissão negada para notificações");
  }

  console.log("Permissão concedida!");

  const registration = await navigator.serviceWorker.getRegistration();

  if (!registration) throw new Error("Service Worker não encontrado!");

  // Retorna token do usuário
  const token = await getToken(messaging, {
    vapidKey: VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: registration,
  });

  console.log("Token FCM:", token);

  return token;
}

// Recebe mensagens quando o app estiver aberto (foreground)
export function onForegroundMessage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (payload: any) => void
) {
  onMessage(messaging, (payload) => {
    console.log("Mensagem no foreground:", payload);
    callback(payload);
  });
}