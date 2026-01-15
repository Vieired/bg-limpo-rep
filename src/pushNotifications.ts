// src/pushNotifications.ts
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getApps } from "firebase/app";

console.log("Firebase apps carregados:", getApps());

const db = getFirestore();
const VAPID_PUBLIC_KEY = "BPKrMEgi8Q4pYUaiXoDPK3pktNFCgdwgVyv-Z5Jlpo4oADyxVPpsb7QJ9Im7GTSaC_QWb3nSELcMtwP1u6NSrrU";

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("🔕 Permissão negada");
    return null;
  }

  console.log("🔔 Permissão concedida! Gerando token FCM...");

  const token = await getToken(messaging, {
    vapidKey: VAPID_PUBLIC_KEY,
  });

  if (!token) {
    console.warn("⚠️ Não foi possível gerar o token FCM.");
    return null;
  }

  console.log("📨 Token FCM:", token);

  // Salvar no Firestore
  await saveTokenToFirestore(token);

  return token;
}

async function saveTokenToFirestore(token: string) {
  try {
    const tokensRef = collection(db, "fcm_tokens");
    const docRef = doc(tokensRef, token);

    await setDoc(docRef, {
      token,
      createdAt: serverTimestamp(),
      userAgent: navigator.userAgent,
    });

    console.log("💾 Token salvo no Firestore");
  } catch (err) {
    console.error("❌ Erro ao salvar token:", err);
  }
}