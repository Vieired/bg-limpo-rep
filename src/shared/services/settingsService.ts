
import { firebaseConfig } from "../firebase/config";
import { firestoreDocToJson, toFirestoreValue } from "../helpers/firestoreToJS";
import type { ISettings } from "../models/Games";
import type { FirestoreDocument } from "../models/domain/Firestore";
import { httpFetch } from "./_httpClient";

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
const firebaseCollection = "configuracoes";
const docId = "Ca2WfDMPMGv1b5Q8TU36";

const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${firebaseCollection}`;

export const settingsService = {

  fetchSettings: async (): Promise<number> => {

    const res = await httpFetch(`${url}/${docId}`);
    
    if (!res?.ok) {
      throw new Error(`Erro ao buscar configurações: ${res.statusText}`);
    }

    const data: FirestoreDocument = await res.json();

    const resp = firestoreDocToJson(data).cleaning_frequency as number;

    return resp;
  },

  updateSettings: async (data: ISettings): Promise<void> => {

    const fields = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])
    );

    const body = {
      fields,
      // updateMask: { fieldPaths: Object.keys(data) },
    };

    const response = await httpFetch(`${url}/${docId}`, {
      method: "PATCH",
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