import { useCallback, useLayoutEffect, useState } from 'react';
// import { initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth';
// import type { FirestoreDocument, FirestoreListResponse } from './shared/models/domain/Firestore';
// import { getValue } from './shared/helpers/firestoreToJS';
// import { firebaseConfig } from './shared/firebase/config';
// import { BrowserRouter, Route, Routes } from 'react-router';
// import { firebaseAuth } from './shared/services/authService';
import { firebaseAuthService } from './shared/services/firebaseAuthService';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Games from './pages/Games';
import Settings from './pages/Settings';
import './App.css'
import GlobalStyle from "./styles/global";
import type { User } from 'firebase/auth';

function App() {

  // useEffect(() => {

  //   const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
  //     ? JSON.parse(localStorage.getItem("user") as string)
  //     : null;

  //   if (new Date(currentUser?.stsTokenManager?.expirationTime) < new Date()) {
  //     firebaseAuth.signOut().then(() => {
  //         // Signs out if the user's token is expired.
  //         localStorage.clear();
  //       }).catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, []);

  // const [token, setToken] = useState<string|null>(null);
  // // const [ games, setGames ] = useState<FirestoreDocument[]|null>(null);
  const [logged, setLogged] = useState<boolean>(
    localStorage.getItem("user") != null && localStorage.getItem("user") !== ""
  );

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // /*export*/ const auth = getAuth(app);

  // const PROJECT_ID = firebaseConfig.projectId;
  // const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/jogos`;  

  // const listarJogos = useCallback(async (): Promise<FirestoreDocument[]> => {

  //   const res = await fetch(url, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`
  //       // "Content-Type": "application/json"
  //     },
  //   });
    
  //   if (!res?.ok) {
  //     throw new Error(`Erro ao buscar jogos: ${res.statusText}`);
  //   }

  //   const data: FirestoreListResponse = await res.json();
  //   return data?.documents || [];
  // }, [token, url]);

  // const login = useCallback(async (email: string, senha: string): Promise<string> => {
  //     try {
  //     // const userCredential = await signInWithEmailAndPassword(auth, email, senha);
  //     // const user = userCredential.user;
  //     firebaseAuth.signIn(email, senha)
  //         .then(userCredential => {
  //             const user = userCredential.user;
  //             // pegar token JWT (ID token)
  //             const token = user.getIdToken();
  //             return token;
  //         });
  //     } catch (error) {
  //         console.error("Erro no login:", error);
  //         throw error;
  //     }
  // }, []);

  const authStateCbk = useCallback((user: User | null): void => {
    if (!user)
      setLogged(false);
    else
      setLogged(true);
  }, []);

  useLayoutEffect(() => {
    firebaseAuthService.listenAuthState(authStateCbk);
  }, [authStateCbk]);

  return (
    <>
      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <GlobalStyle />
      {logged ? (
        <BrowserRouter>
          <Routes>
              <Route index element={<Games/>} />
              <Route path="/settings" element={<Settings/>} />
          </Routes>
        </BrowserRouter>
      ) : (
        <Login/>
      )}
    </>
  )
}

export default App
