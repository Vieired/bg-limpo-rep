import { useCallback, useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import type { FirestoreDocument, FirestoreListResponse } from './shared/models/domain/Firestore';
import { getValue } from './shared/helpers/firestoreToJS';
import './App.css'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRsQbOu4JUqBODv2MRG0PXz0DTKDRZcXg",
  authDomain: "bg-limpo.firebaseapp.com",
  projectId: "bg-limpo",
  storageBucket: "bg-limpo.firebasestorage.app",
  messagingSenderId: "245775062234",
  appId: "1:245775062234:web:5ad4705676304ef9e301e3"
};

function App() {
  const [token, setToken] = useState<string|null>(null);
  const [ games, setGames ] = useState<FirestoreDocument[]|null>(null);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  /*export*/ const auth = getAuth(app);

  const PROJECT_ID = firebaseConfig.projectId;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/jogos`;  

  const login = useCallback(async (email: string, senha: string): Promise<string> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // pegar token JWT (ID token)
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }, [auth]);

  const listarJogos = useCallback(async (): Promise<FirestoreDocument[]> => {

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
        // "Content-Type": "application/json"
      },
    });
    
    if (!res?.ok) {
      throw new Error(`Erro ao buscar jogos: ${res.statusText}`);
    }

    const data: FirestoreListResponse = await res.json();
    return data?.documents || [];
  }, [token, url]);

  useEffect(() => {
    login("logominus@gmail.com", "logominus@gmail.com")
      .then(resp => setToken(resp));
  }, [login]);

  useEffect(() => {

    if (!token) return;

    listarJogos()
      .then((games: FirestoreDocument[]) => {
        setGames(games)
      })
  }, [listarJogos, token]);

  return (
    <>
      <h1>BG Limpo</h1>
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
      )}
    </>
  )
}

export default App
