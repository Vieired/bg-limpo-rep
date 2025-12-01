// notify-cleaning.js
import admin from "firebase-admin";
import fetch from "node-fetch";

// Service account vindo do GitHub Actions SECRET
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Corrige possíveis problemas de quebras de linha
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ---- FUNÇÃO PRINCIPAL ----

async function run() {
  console.log("🔎 Lendo jogos do Firestore...");

  const snapshot = await db.collection("jogos").get();

  const today = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD

  const expiredGames = [];

  snapshot.forEach((doc) => {
    const game = doc.data();
    const cleaningDate = (game.cleaning_date || "").split("T")[0];

    if (cleaningDate <= today) {
      expiredGames.push({ id: doc.id, ...game });
    }
  });

  if (expiredGames.length === 0) {
    console.log("✨ Nenhum jogo vencido hoje!");
    return;
  }

  console.log("⚠️ Jogos vencidos encontrados:", expiredGames.length);

  // -----------------------------------------------------------------------
  // Buscar tokens FCM
  // -----------------------------------------------------------------------
  console.log("🔎 Lendo tokens FCM...");

  const tokensSnap = await db.collection("fcm_tokens").get();

  const tokens = tokensSnap.docs.map((doc) => doc.id);

  if (tokens.length === 0) {
    console.log("❌ Nenhum token registrado no Firestore.");
    return;
  }

  console.log("📨 Total de tokens encontrados:", tokens.length);

  // -----------------------------------------------------------------------
  // Enviar notificação via Firebase FCM HTTP v1
  // -----------------------------------------------------------------------

  const serverKey = process.env.FIREBASE_SERVER_KEY;

  const body = {
    registration_ids: tokens,
    notification: {
      title: "Limpeza necessária",
      body: "Alguns jogos precisam de limpeza hoje!"
    }
  };

  console.log("📤 Enviando push...");

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Authorization": `key=${serverKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const result = await response.json();
  console.log("📥 Resposta do FCM:", JSON.stringify(result, null, 2));

  console.log("🏁 Finalizado");
}

run();
