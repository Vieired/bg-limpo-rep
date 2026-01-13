// .github/scripts/cleanup-check.cjs

console.log("🔍 Iniciando verificação de jogos (branch develop)...");

// Configurações
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");

// Monta o serviceAccount a partir das secrets
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

// const SERVER_KEY = process.env.FIREBASE_SERVER_KEY;
const COLLECTION_GAMES = "jogos";
const COLLECTION_TOKENS = "fcm_tokens";
const COLLECTION_CLEANING_FREQUENCY = "configuracoes";

const URL = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents`;

// -------------------- UTILS --------------------

function parseCleaningDate(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
}

function isExpired(cleanDate, frequencyMonths) {
  if (!cleanDate) return false;

  const limit = new Date(cleanDate);
  limit.setMonth(limit.getMonth() + frequencyMonths);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  limit.setHours(0, 0, 0, 0);

  return limit < today;
}

// -------------------- FIRESTORE --------------------

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/datastore"],
  });

  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

async function getAllGames() {
  const token = await getAccessToken();

  const res = await fetch(`${URL}/${COLLECTION_GAMES}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error("❌ Erro ao parsear resposta Firestore:", text);
    return [];
  }

  if (!json.documents) return [];
  return json.documents.filter(doc => doc.fields); // só documentos válidos
}

async function getCleaningFrequency() {
  const token = await getAccessToken();

  const res = await fetch(`${URL}/${COLLECTION_CLEANING_FREQUENCY}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error("❌ Erro ao parsear resposta Firestore:", text);
    return [];
  }

  if (!json.documents) return [];
  return json.documents.filter(doc => doc.fields); // só documentos válidos
}

async function getAllTokens() {
  const token = await getAccessToken();

  const res = await fetch(`${URL}/${COLLECTION_TOKENS}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error("❌ Erro ao parsear tokens Firestore:", text);
    return [];
  }

  if (!json.documents) return [];
  // Cada doc.id é o token
  return json.documents.map(doc => doc.name.split("/").pop());
}

// -------------------- PUSH --------------------
async function sendPush(userToken, title, body, photoUrl) {
  try {
    // 1) Gerar Access Token válido para o FCM
    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    const url = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

    // 2) Enviar push
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token: userToken,
          notification: {
            title,
            body,
            image: photoUrl, // 👈 IMAGEM GRANDE
          },
        },
      }),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log("📨 Push enviado:", data);
    } catch {
      console.warn("⚠ Resposta não JSON do FCM:", text);
    }
  } catch (err) {
    console.error("❌ Erro ao enviar push:", err);
  }
}

// -------------------- EXECUÇÃO --------------------

(async () => {
  const settings = await getCleaningFrequency();
  console.log("Configurações encontradas: ", settings);
  if (!settings) {
    throw new Error('Coleção "Configurações" inválida ou não configurada');
  }
  const cleaningFrequency = Number(settings[0]?.fields?.cleaning_frequency?.integerValue ?? 0);
  console.log("Frequência de limpeza (cleaningFrequency) encontrada: ", cleaningFrequency);

  const games = await getAllGames();
  console.log(`📦 Total de jogos válidos encontrados: ${games.length}`);

  const userTokens = await getAllTokens();
  console.log(`📨 Total de tokens encontrados: ${userTokens.length}`);
  if (userTokens.length === 0) {
    console.log("❌ Nenhum token FCM disponível. Abortando envio de push.");
    return;
  }

  for (const doc of games) {
    const fields = doc.fields;
    if (!fields.cleaning_date || !fields.name) continue;

    // garante que isActive exista e seja true
    const isActive = fields.isActive?.booleanValue === true;
    if (!isActive) continue;

    const cleanDate = parseCleaningDate(fields.cleaning_date.stringValue);
    if (!cleanDate) continue;

    if (isExpired(cleanDate, cleaningFrequency) && isActive === true) {
      console.log("⚠ Jogo vencido:", fields.name.stringValue);

      for (const token of userTokens) {
        await sendPush(
          token,
          "Limpeza Vencida",
          `O jogo ${fields.name.stringValue} precisa de manutenção de rotina.`,
          fields.photoUrl?.stringValue,
        );
      }
    }
  }

  console.log("✔ Verificação concluída.");
})();
