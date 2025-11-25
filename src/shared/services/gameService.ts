import { firebaseConfig } from "../firebase/config";
// import { getAccessToken } from "../helpers/auth";
import { toFirestoreValue } from "../helpers/firestoreToJS";
import type { FirestoreDocument, FirestoreListResponseV2 } from "../models/domain/Firestore";
import type { Game } from "../models/Games";
import { clearTokens, getTokens } from "./authService";
// import { checkIfAuthenticationIsRequired } from "../utils/auth";

const COLLECTION_ID = "jogos";
const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

export const gameService = {

  // fetchGames: async (showOnlyActiveGamesFilter?: boolean): Promise<FirestoreDocument[]> => {

  //   // checkIfAuthenticationIsRequired();

  //   // const token = getAccessToken();
  //   const token = getTokens()?.idToken;

  //   // TODO: fazer funcionar a ordenação dos jogos pelo cleaning_date e name, e o filtro pelo isActive conforme o valor do parâmetro showOnlyActiveGamesFilter
  //   const res = await fetch(`${url}/${COLLECTION_ID}`, {
  //     headers: { "Authorization": `Bearer ${token}` },
  //     params: {
  //       showOnlyActiveGamesFilter: showOnlyActiveGamesFilter
  //     }
  //   } as RequestInit);

  //   if (res.status === 401) {
  //     // token inválido no backend
  //     clearTokens();
  //     window.location.href = "/";
  //     throw new Error("Token inválido — redirecionando");
  //   }

  //   if (!res?.ok) {
  //     throw new Error(`Erro ao buscar jogos: ${res.statusText}`);
  //   }

  //   const data: FirestoreListResponse = await res.json();
  //   return data?.documents || [];
  // },

  fetchGames: async (showOnlyActiveGamesFilter?: boolean): Promise<FirestoreDocument[]> => {

    // checkIfAuthenticationIsRequired();

    // const token = getAccessToken();
    const token = getTokens()?.idToken;

    const queryBody = showOnlyActiveGamesFilter
      ?
      {
        structuredQuery: {
          from: [
            {
              collectionId: COLLECTION_ID
            }
          ],
          where: {
            fieldFilter: {
              field: {
                fieldPath: 'isActive'
              },
              op: 'EQUAL',
              value: {
                booleanValue: true
              }
            }
          },
          orderBy: [
            {
              field: {
                fieldPath: "cleaning_date"
              },
              direction: "ASCENDING" // Ou "DESCENDING"
            },
            {
              field: {
                fieldPath: "__name__"
              },
              direction: "ASCENDING"
            },
          ],
        }
      }
      :
      {
        structuredQuery: {
          from: [
            {
              collectionId: COLLECTION_ID
            }
          ],
          orderBy: [
            {
              field: {
                fieldPath: "cleaning_date"
              },
              direction: "ASCENDING" // Ou "DESCENDING"
            },
            {
              field: {
                fieldPath: "__name__"
              },
              direction: "ASCENDING"
            },
          ],
        }
      };

    // TODO: fazer funcionar a ordenação dos jogos pelo cleaning_date e name
    const res = await fetch(`${url}:runQuery`, {
      method: 'POST',
      headers: { "Authorization": `Bearer ${token}` },
      body: JSON.stringify(queryBody),
    } as RequestInit);

    if (res.status === 401) {
      // token inválido no backend
      clearTokens();
      window.location.href = "/";
      throw new Error("Token inválido — redirecionando");
    }

    if (!res?.ok) {
      throw new Error(`Erro ao buscar jogos: ${res.statusText}`);
    }

    const data = await res.json();
    // O Firestore retorna um array de objetos, onde cada documento está aninhado
    const activeGames: FirestoreDocument[] = data
      .filter((item:FirestoreListResponseV2) => item.document) // Filtra apenas os objetos que contêm um documento
      .map((item:FirestoreListResponseV2) => item.document);
    
    return activeGames;
  },

  updateGame: async (data: Game) => {

    // checkIfAuthenticationIsRequired();
    const token = getTokens()?.idToken;

    // const docId = data?.id?.split(`projects/${firebaseConfig.projectId}/databases/(default)/documents/${COLLECTION_ID}/`)[1];

    const fields = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])
    );

    const body = {
      fields,
      // updateMask: { fieldPaths: Object.keys(data) },
    };

    const response = await fetch(`${url}/${COLLECTION_ID}/${data?.id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    } as RequestInit);

    if (response.status === 401) {
      clearTokens();
      window.location.href = "/";
      throw new Error("Token inválido — redirecionando");
    }

    if (!response.ok) {
      throw new Error(`Erro ao atualizar doc: ${response.statusText}`);
    }

    return await response.json();
  },

  createGame: async (payload: Game) => {

    // checkIfAuthenticationIsRequired();
    const token = getTokens()?.idToken;

    const fields = Object.fromEntries(
      Object.entries(payload).map(([k, v]) => [k, toFirestoreValue(v)])
    );

    const body = {
      fields,
    };

    const response = await fetch(`${url}/${COLLECTION_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    } as RequestInit);

    if (response.status === 401) {
      clearTokens();
      window.location.href = "/";
      throw new Error("Token inválido — redirecionando");
    }

    if (!response.ok) {
      throw new Error(`Erro ao tentar criar doc: ${response.statusText}`);
    }

    return await response.json();
  }

};