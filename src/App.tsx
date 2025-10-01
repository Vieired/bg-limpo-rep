import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth';
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
    if (!user) {
      localStorage.clear();
      setLogged(false);
      firebaseAuthService.signOut();
      // .then(() => {
      //   // Signs out if the user's token is expired.
      //   localStorage.clear();
      //   setLogged(false);
      // }).catch((error) => {
      //   console.log(error);
      // });
    } else
      setLogged(true);
  }, []);

  useEffect(() => {
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
