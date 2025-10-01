import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../firebase/config";
import { fetchDocs } from "./firestoreService";
import type { ISettings } from "../models/Games";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const settingsService = {

  fetchSettings: async (): Promise<number> => {

    // checkIfAuthenticationIsRequired();

    const settingsRef = collection(db, "configuracoes");
    const q = query(settingsRef);

    const querySnapshot = await fetchDocs(q);
    const { cleaning_frequency } = querySnapshot.docs[0].data();

    return cleaning_frequency
  },

  updateSettings: async (payload: ISettings): Promise<void> => {

    // checkIfAuthenticationIsRequired();

    const settingsRef = doc(db, 'configuracoes', 'Ca2WfDMPMGv1b5Q8TU36');
    
    await updateDoc(settingsRef, {
      ...payload,
      cleaning_frequency: payload.cleaning_frequency
    })
  },
};