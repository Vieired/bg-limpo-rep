import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// import type { FirestoreDocument, FirestoreListResponse } from './shared/models/domain/Firestore';
// import { getValue } from './shared/helpers/firestoreToJS';
// import { firebaseConfig } from './shared/firebase/config';
// import { BrowserRouter, Route, Routes } from 'react-router';
// import { firebaseAuth } from './shared/services/authService';
import { firebaseAuthService } from './shared/services/firebaseAuthService';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Games from './pages/Games';
import Settings from './pages/Settings';
import './App.css'
import GlobalStyle from "./styles/global";
import type { User } from 'firebase/auth';

function App() {

  // const navigate = useNavigate();

  // const [token, setToken] = useState<string|null>(null);
  const [logged, setLogged] = useState<boolean>(
    localStorage.getItem("user") != null && localStorage.getItem("user") !== ""
  );

  // const currentUser = localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string"
  //   ? JSON.parse(localStorage.getItem("user") as string)
  //   : null;

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // /*export*/ const auth = getAuth(app);

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

    const auth = getAuth();
    if (!auth?.currentUser) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { stsTokenManager: { expirationTime } } = auth.currentUser as any;
    // if (expirationTime > new Date('2025-11-10T22:41:12.797Z').getTime()) { // timestamp
    if (!user || expirationTime < new Date().getTime()) {
      firebaseAuthService.signOut()
        .then(() => {
          // Signs out if the user's token is expired.
          localStorage.clear();
          setLogged(false);
          document.location.reload();
        }).catch((error) => {
          console.log(error);
        });
      return;
    }

    setLogged(true);
  }, []);

  // TODO: fazer esta checagem em todas requisições da aplicação (alternativamente usar um Interceptor)
  useEffect(() => {
    firebaseAuthService.listenAuthState(authStateCbk);
  }, [authStateCbk]);

  // useEffect(() => {
  //   if (!currentUser) return;

  //   const { stsTokenManager: { expirationTime } } = currentUser;
  //   if (new Date(expirationTime) < new Date()) {
  //     firebaseAuthService.signOut()
  //   }
  // }, [currentUser]);

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
      <BrowserRouter>
        {logged ? (
          <Routes>
            <Route index element={<Games/>} />
            <Route path="/settings" element={<Settings/>} />
          </Routes>
        ) : (
          <Login/>
        )}
      </BrowserRouter>
    </>
  )
}

export default App
