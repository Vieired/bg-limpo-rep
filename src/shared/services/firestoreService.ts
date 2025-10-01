// import { initializeApp } from "firebase/app";
import {
  // doc,
  getDocs,
  // getFirestore,
  Query,
  QuerySnapshot,
  type DocumentData
} from "firebase/firestore";
// import { firebaseConfig } from "../firebase/config";

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const settingsRef = doc(db, 'configuracoes', 'Ca2WfDMPMGv1b5Q8TU36');

export const fetchDocs = async (q: Query): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  return getDocs(q);
};

// export const updateDoc = async (settingsRef, {
//   ...payload,
//   cleaning_frequency: payload.cleaning_frequency
// }) => {
//   return
// };