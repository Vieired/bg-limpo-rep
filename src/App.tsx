import { useCallback, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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

// Representa um campo genérico do Firestore
type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { booleanValue: boolean }
  | { arrayValue: { values: FirestoreValue[] } };

// Documento retornado pela API
interface FirestoreDocument {
  name: string;
  fields: Record<string, FirestoreValue>;
  createTime: string;
  updateTime: string;
}

// Resposta quando lista documentos
interface FirestoreListResponse {
  documents: FirestoreDocument[];
}

function App() {
  const [count, setCount] = useState(0);
  const [token, setToken] = useState<string|null>(null);

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
    return data.documents || [];
  }, [token, url]);

  useEffect(() => {
    login("logominus@gmail.com", "logominus@gmail.com")
      .then(resp => setToken(resp));
  }, [login]);

  useEffect(() => {

    if (!token) return;

    listarJogos().then(jogos => {
      // console.log("jogos: ", jogos);
      jogos.forEach(doc => {
        console.log("doc: ", doc);
        // console.log(doc.fields.nome?.stringValue, doc.fields.ano?.integerValue);
      });
    });
  }, [listarJogos, token]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
