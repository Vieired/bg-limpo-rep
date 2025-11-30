import { firebaseConfig } from "../firebase/config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const getStorageToken = () => {
  const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  return currentUser?.stsTokenManager?.accessToken as string;
}

export const checkIfAuthenticationIsRequired = () => { // TODO: remover se continuar sem uso
    const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

    if (currentUser?.stsTokenManager?.expirationTime < new Date().getTime()) { // compara timestamp
        localStorage.clear();
        document.location.reload();
    }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// export const getAccessToken = async () => {
//   const user = auth.currentUser;
//   // if (!user) throw new Error("Usuário não autenticado");
//   if (!user) return;
  
//   return await user.getIdToken(); // Firebase cuida da renovação
// }