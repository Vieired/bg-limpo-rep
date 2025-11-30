// scripts/cleanup-check.js

console.log("PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("PRIVATE_KEY length:", process.env.FIREBASE_PRIVATE_KEY?.length);

const fetch = require("node-fetch");

// Monta o serviceAccount manualmente a partir das 5 secrets
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const SERVER_KEY = process.env.FIREBASE_SERVER_KEY;

const PROJECT_ID = serviceAccount.project_id;
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

// Gera access token OAuth2
async function getAccessToken() {
  const jwt = require("jsonwebtoken");

  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    scope: "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform",
    // scope: "https://www.googleapis.com/auth/datastore",
  };

  const token = jwt.sign(payload, serviceAccount.private_key, {
    algorithm: "RS256",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" +
      token,
  });

  const json = await res.json();
  return json.access_token;
}

// Firestore GET
async function getAllGames(bearerToken) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

  console.log("URL usada:", url); // debug

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  const data = await res.json();

  console.log("Resposta Firestore:", JSON.stringify(data, null, 2)); // debug

  return data.documents || [];
}

// EXECUÇÃO
(async () => {
  console.log("🔍 Iniciando verificação de jogos...");

  const accessToken = await getAccessToken();
  const games = await getAllGames(accessToken);

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
