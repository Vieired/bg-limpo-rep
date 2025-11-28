// scripts/cleanup-check.js

const fetch = require("node-fetch");

// Carrega secrets do GitHub Actions
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const SERVER_KEY = process.env.FIREBASE_SERVER_KEY;

const PROJECT_ID = serviceAccount.project_id;
const COLLECTION = "games"; // altere se sua coleção tiver outro nome

// Converte data YYYY-MM-DD ou YYYY-MM-DDTHH:mm para objeto Date
function parseCleaningDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr.length === 10) {
    return new Date(dateStr + "T00:00:00");
  }
  return new Date(dateStr);
}

// Checa se está vencido (cleaning_date <= hoje)
function isExpired(cleanDate) {
  const now = new Date();
  return cleanDate <= now;
}

// Envia push para um token
async function sendPush(token, title, body) {
  const res = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${SERVER_KEY}`,
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title,
        body,
      },
    }),
  });

  const data = await res.json();
  console.log("FCM Response:", data);
}

// Gera token OAuth2 usando serviceAccount
async function getAccessToken() {
  const jwt = require("jsonwebtoken");

  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    scope: "https://www.googleapis.com/auth/datastore",
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

// Busca todos os jogos do Firestore
async function getAllGames(bearerToken) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  const data = await res.json();
  return data.documents || [];
}

// ------------------------------------
//        EXECUÇÃO PRINCIPAL
// ------------------------------------

(async () => {
  console.log("🔍 Iniciando verificação de jogos...");

  const accessToken = await getAccessToken();
  const games = await getAllGames(accessToken);

  console.log(`📦 Total de jogos encontrados: ${games.length}`);

  // TODO: tokens devem vir do seu banco
  // por enquanto testar com token manual
  const userTokens = [
    // coloque aqui tokens de teste
  ];

  for (const doc of games) {
    const fields = doc.fields;

    if (!fields.cleaning_date) continue;

    const cleanDate = parseCleaningDate(fields.cleaning_date.stringValue);

    if (!cleanDate) continue;

    if (isExpired(cleanDate)) {
      console.log("⚠ Jogo vencido:", fields.name?.stringValue);

      // Enviar push para cada token
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
