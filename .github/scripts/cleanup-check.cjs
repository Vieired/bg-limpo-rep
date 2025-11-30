// scripts/cleanup-check.cjs

console.log("PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("PRIVATE_KEY length:", process.env.FIREBASE_PRIVATE_KEY?.length);

const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");

// Monta o serviceAccount manualmente a partir das secrets
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const SERVER_KEY = process.env.FIREBASE_SERVER_KEY;
const COLLECTION = "jogos";

// Converte data YYYY-MM-DD ou YYYY-MM-DDTHH:mm
function parseCleaningDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr.length === 10) return new Date(dateStr + "T00:00:00");
  return new Date(dateStr);
}

function isExpired(cleanDate) {
  const now = new Date();
  return cleanDate <= now;
}

// Envia push
async function sendPush(token, title, body) {
  const res = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${SERVER_KEY}`,
    },
    body: JSON.stringify({
      to: token,
      notification: { title, body },
    }),
  });

  const data = await res.json();
  console.log("FCM Response:", data);
}

// 🔑 Novo método oficial para obter token OAuth2 válido
async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/datastore"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  return tokenResponse.token || tokenResponse;
}

// 🔍 Busca jogos no Firestore
async function getAllGames() {
  const token = await getAccessToken();
  console.log("🔑 Token gerado:", String(token).slice(0, 20) + "...");

  const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/${COLLECTION}`;
  console.log("URL usada:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  console.log("Resposta Firestore:", JSON.stringify(json, null, 2));

  if (!json.documents) return [];
  return json.documents;
}

// -----------------------------------------------------------------------------
// EXECUÇÃO PRINCIPAL
// -----------------------------------------------------------------------------
(async () => {
  console.log("🔍 Iniciando verificação de jogos...");

  const games = await getAllGames();
  console.log(`📦 Total de jogos encontrados: ${games.length}`);

  const userTokens = []; // TODO: puxar do Firestore

  for (const doc of games) {
    const fields = doc.fields;
    if (!fields.cleaning_date) continue;

    const cleanDate = parseCleaningDate(fields.cleaning_date.stringValue);
    if (!cleanDate) continue;

    if (isExpired(cleanDate)) {
      console.log("⚠ Jogo vencido:", fields.name?.stringValue);

      for (const token of userTokens) {
        await sendPush(
          token,
          "Limpeza Vencida",
          `O jogo ${fields.name.stringValue} precisa ser limpo.`
        );
      }
    }
  }

  console.log("✔ Verificação concluída.");
})();
