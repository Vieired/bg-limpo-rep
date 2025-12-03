// .github/scripts/cleanup-check.cjs

console.log("🔍 Iniciando verificação de jogos (branch develop)...");

// Configurações
const fetch = require("node-fetch");
const { GoogleAuth } = require("google-auth-library");

const SERVER_KEY = process.env.FIREBASE_SERVER_KEY;
const COLLECTION_GAMES = "jogos";
const COLLECTION_TOKENS = "fcm_tokens";

// Monta o serviceAccount a partir das secrets
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

// -------------------- UTILS --------------------

function parseCleaningDate(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
}

function isExpired(cleanDate) {
  if (!cleanDate) return false;
  const limit = new Date(cleanDate);
  limit.setMonth(limit.getMonth() + 5);

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
  const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/${COLLECTION_GAMES}`;

  const res = await fetch(url, {
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
  const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.project_id}/databases/(default)/documents/${COLLECTION_TOKENS}`;

  const res = await fetch(url, {
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
async function sendPush(userToken, title, body) {
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
        Authorization: `Bearer ${accessToken}`, // CORRETO
      },
      body: JSON.stringify({
        message: {
          token: userToken, // CORRETO
          notification: {
            title,
            body,
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

/*async function sendPush(token, title, body) {
  const url = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

  const accessToken = await getAccessToken();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      message: {
        token,
        data: {
          title,
          body
        }
      }
    }),
  });

  const text = await res.text();
  try {
    console.log("📨 Push enviado:", JSON.parse(text));
  } catch {
    console.warn("⚠ Resposta não JSON:", text);
  }
}*/

// async function sendPush(token, title, body) {

//   const url = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

//   try {
//     const res = await fetch(url,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // NÃO usar serverKey aqui
//         },
//         body: JSON.stringify({
//           message: {
//             token: token, // token do Firestore
//             notification: {
//               title: "Jogo vencido!",
//               body: `O jogo ${game.name} venceu a data de limpeza.`,
//             },
//           },
//         }),
//       }
//     );
//     // const res = await fetch("https://fcm.googleapis.com/fcm/send", {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     Authorization: `key=${SERVER_KEY}`,
//     //   },
//     //   body: JSON.stringify({
//     //     to: token,
//     //     notification: { title, body },
//     //   }),
//     // });

//     const text = await res.text();
//     try {
//       const data = JSON.parse(text);
//       console.log("📨 Push enviado:", data);
//     } catch (err) {
//       console.warn("⚠ Resposta não JSON do FCM:", text);
//     }
//   } catch (err) {
//     console.error("❌ Erro ao enviar push:", err);
//   }
// }

// -------------------- EXECUÇÃO --------------------

(async () => {
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

    const cleanDate = parseCleaningDate(fields.cleaning_date.stringValue);
    if (!cleanDate) continue;

    if (isExpired(cleanDate)) {
      console.log("⚠ Jogo vencido:", fields.name.stringValue);

      for (const token of userTokens) {
        await sendPush(
          token,
          "Limpeza Vencida",
          `O jogo ${fields.name.stringValue} precisa de manutenção de rotina.`
        );
      }
    }
  }

  console.log("✔ Verificação concluída.");
})();
