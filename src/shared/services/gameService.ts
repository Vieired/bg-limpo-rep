import { firebaseConfig } from "../firebase/config";
// import { getAccessToken } from "../helpers/auth";
import { toFirestoreValue } from "../helpers/firestoreToJS";
import type { FirestoreDocument, FirestoreListResponse } from "../models/domain/Firestore";
import type { Game } from "../models/Games";
import { clearTokens, getTokens } from "./authService";
// import { checkIfAuthenticationIsRequired } from "../utils/auth";

const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/jogos`;

export const gameService = {

  fetchGames: async (showOnlyActiveGamesFilter?: boolean): Promise<FirestoreDocument[]> => {

    // checkIfAuthenticationIsRequired();

    // const token = getAccessToken();
    const token = getTokens()?.idToken;

    // TODO: fazer funcionar a ordenação dos jogos pelo cleaning_date e name, e o filtro pelo isActive conforme o valor do parâmetro showOnlyActiveGamesFilter
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` },
      params: {
        showOnlyActiveGamesFilter: showOnlyActiveGamesFilter
      }
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

    const data: FirestoreListResponse = await res.json();
    return data?.documents || [];
  },

  // fetchGames: async (showOnlyActiveGamesFilter?: boolean): Promise<FirestoreDocument[]> => {

  //   const gamesRef = collection(db, "jogos");
  //           const q = showOnlyActiveGamesFilter
  //               ? query(
  //                   gamesRef,
  //                   where("isActive", "==", true),
  //                   // where("isActive", "==", gamesSlice.getInitialState().isActiveFilter),
  //                   // orderBy("name", "asc"),
  //                   orderBy("cleaning_date"),
  //                   orderBy("__name__"),
  //                   // where("id", "==", auth.currentUser.uid)
  //               )
  //               : query(
  //                   gamesRef,
  //                   orderBy("cleaning_date"),
  //                   orderBy("__name__"),
  //               );
  //   const querySnapshot = await getDocs(q);
  //   const gameList: Game[] = [];
  //   querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       // console.log(doc.id, " => ", doc.data());
  //       gameList.push({
  //           // id: doc.id,
  //           ...doc.data() as Game
  //       });
  //   });
    
  //   return gameList
  // },

  updateGame: async (data: Game) => {

    // checkIfAuthenticationIsRequired();
    const token = getTokens()?.idToken;

    const docId = data.id.split("projects/bg-limpo/databases/(default)/documents/jogos/")[1];

    const fields = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])
    );

    const body = {
      fields,
      // updateMask: { fieldPaths: Object.keys(data) },
    };

    const response = await fetch(`${url}/${docId}`, {
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

    const response = await fetch(`${url}`, {
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