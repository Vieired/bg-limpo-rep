import { firebaseConfig } from "../firebase/config";
import { getAccessToken } from "../helpers/auth";
import type { FirestoreDocument, FirestoreListResponse } from "../models/domain/Firestore";

const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/jogos`;

export const gameService = {

  fetchGames: async (showOnlyActiveGamesFilter?: boolean): Promise<FirestoreDocument[]> => {

    const token = getAccessToken();

    // TODO: fazer funcionar a ordenação dos jogos pelo cleaning_date e name, e o filtro pelo isActive conforme o valor do parâmetro showOnlyActiveGamesFilter

    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` },
      params: {
        showOnlyActiveGamesFilter: showOnlyActiveGamesFilter
      }
    } as RequestInit);
    
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
};