import { firebaseConfig } from "../firebase/config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const getStorageToken = () => {
  const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  return currentUser?.stsTokenManager?.accessToken as string;
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// export const getAccessToken = async () => {
//   const user = auth.currentUser;
//   // if (!user) throw new Error("Usuário não autenticado");
//   if (!user) return;
  
//   return await user.getIdToken(); // Firebase cuida da renovação
// }