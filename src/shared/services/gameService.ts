import { firebaseConfig } from "../firebase/config";
import type { FirestoreListResponse } from "../models/domain/Firestore";

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/jogos`;
// const token = localStorage?.getItem("tk") && typeof(localStorage.getItem("tk")) === "string";

export const gameService = {

  fetchGames: async (/*showOnlyActiveGamesFilter?: boolean*/) => {

    const storageToken = localStorage?.getItem("tk");
    const token = storageToken ? JSON.parse(storageToken) : null;

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
        // "Content-Type": "application/json"
      },
    });
    
    if (!res?.ok) {
      throw new Error(`Erro ao buscar jogos: ${res.statusText}`);
    }

    const data: FirestoreListResponse = await res.json();
    return data?.documents || [];

    // const gamesRef = collection(db, "jogos");
    //         const q = showOnlyActiveGamesFilter
    //             ? query(
    //                 gamesRef,
    //                 where("isActive", "==", true),
    //                 // where("isActive", "==", gamesSlice.getInitialState().isActiveFilter),
    //                 // orderBy("name", "asc"),
    //                 orderBy("cleaning_date"),
    //                 orderBy("__name__"),
    //                 // where("id", "==", auth.currentUser.uid)
    //             )
    //             : query(
    //                 gamesRef,
    //                 orderBy("cleaning_date"),
    //                 orderBy("__name__"),
    //             );
    // const querySnapshot = await getDocs(q);
    // const gameList: Game[] = [];
    // querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     // console.log(doc.id, " => ", doc.data());
    //     gameList.push({
    //         // id: doc.id,
    //         ...doc.data() as Game
    //     });
    // });
    
    // return gameList
  },
};