// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   query,
//   // doc,
//   // updateDoc,
// } from "firebase/firestore";
import { firebaseConfig } from "../firebase/config";
// import { fetchDocs } from "./firestoreService";
import type { ISettings } from "../models/Games";
// import { getAccessToken } from "../helpers/auth";
import { firestoreDocToJson, toFirestoreValue } from "../helpers/firestoreToJS";
import type { FirestoreDocument } from "../models/domain/Firestore";
import { getTokens } from "./authService";

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
const firebaseCollection = "configuracoes";
const docId = "Ca2WfDMPMGv1b5Q8TU36";

const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${firebaseCollection}/${docId}`;

export const settingsService = {

  fetchSettings: async (): Promise<number> => {

    const token = getTokens()?.idToken;
    // const token = getAccessToken();

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    } as RequestInit);
    
    if (!res?.ok) {
      throw new Error(`Erro ao buscar configurações: ${res.statusText}`);
    }

    const data: FirestoreDocument = await res.json();

    const resp = firestoreDocToJson(data).cleaning_frequency as number;

    return resp;
  },

  // fetchSettings: async (): Promise<number> => {

  //   const token = getAccessToken();

  //   const res = await fetch(url, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`
  //     }
  //   } as RequestInit);
    
  //   if (!res?.ok) {
  //     throw new Error(`Erro ao buscar configurações: ${res.statusText}`);
  //   }

  //   const data: FirestoreListResponse = await res.json();

  //   const mappingArrayFirestoreDocumentToArrayGame = (games: FirestoreDocument[]): { cleaning_frequency: number } => {
  //       const ret: { cleaning_frequency: number }[] = games.map((game) => firestoreDocToJson(game) as { cleaning_frequency: number }); // casting do tipo Record<string, any> para Game
  //       return ret[0];
  //   }

  //   const resp = mappingArrayFirestoreDocumentToArrayGame(data.documents).cleaning_frequency;

  //   return resp;
  // },

  // fetchSettings: async (): Promise<number> => {

  //   // checkIfAuthenticationIsRequired();

  //   const settingsRef = collection(db, "configuracoes");
  //   const q = query(settingsRef);

  //   const querySnapshot = await fetchDocs(q);
  //   const { cleaning_frequency } = querySnapshot.docs[0].data();

  //   return cleaning_frequency
  // },

  updateSettings: async (data: ISettings): Promise<void> => {

    const token = getTokens()?.idToken;

    const fields = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])
    );

    const body = {
      fields,
      // updateMask: { fieldPaths: Object.keys(data) },
    };

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`Erro ao atualizar doc: ${response.statusText}`);
    }

    return await response.json();
  },

  // updateSettings: async (payload: ISettings): Promise<void> => {

  //   // checkIfAuthenticationIsRequired();

  //   const settingsRef = doc(db, 'configuracoes', 'Ca2WfDMPMGv1b5Q8TU36');
    
  //   await updateDoc(settingsRef, {
  //     ...payload,
  //     cleaning_frequency: payload.cleaning_frequency
  //   })
  // },
};