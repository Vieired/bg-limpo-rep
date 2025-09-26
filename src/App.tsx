// import { useEffect } from 'react';
// import { initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth';
// import type { FirestoreDocument, FirestoreListResponse } from './shared/models/domain/Firestore';
// import { getValue } from './shared/helpers/firestoreToJS';
// import { firebaseConfig } from './shared/firebase/config';
import { ToastContainer } from 'react-toastify';
import GlobalStyle from "./styles/global";
// import { BrowserRouter, Route, Routes } from 'react-router';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
// import { firebaseAuth } from './shared/services/authService';
import './App.css'
import Games from './pages/Games';

function App() {
  // const user = localStorage?.getItem("user");

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

  // useEffect(() => {

  //   if (!token) return;

  //   listarJogos()
  //     .then((games: FirestoreDocument[]) => {
  //       setGames(games)
  //     })
  // }, [listarJogos, token]);

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

  // useEffect(() => {
  //   login("logominus@gmail.com", "logominus@gmail.com")
  //     .then(resp => setToken(resp));
  // }, [login]);

  // useEffect(() => {
  //   if (localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string") {
  //     const user = localStorage?.getItem("user");
  //     user.getIdToken()
  //   }
  // }, []);

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

      
      {localStorage?.getItem("user") && typeof(localStorage.getItem("user")) === "string" ? (
        <BrowserRouter>
          <Routes>
              <Route index element={<Games/>} />
              {/* <Route path="/settings" element={<Settings/>} /> */}
          </Routes>
        </BrowserRouter>
      ) : (
        <Login/>
      )}

      {/* <h1>BG Limpo</h1>
      {games != null ? (
        <ul>
          {(games as FirestoreDocument[])?.map((game: FirestoreDocument) => (
            <li key={game.name}>
              {getValue(game.fields.name)}
            </li>
          ))}
        </ul>
      ) : (
        <p>Carregando...</p>
      )} */}
    </>
  )
}

export default App
