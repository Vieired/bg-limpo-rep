import { type User } from "firebase/auth";
import {
    createContext,
    useContext,
    useState
} from "react";
import {
    clearTokens,
    getTokens,
    // isAuthenticated,
    setTokens,
    signOut
} from "../shared/services/authService";
import { firebaseConfig } from "../shared/firebase/config";
import { toast } from "react-toastify";

interface IAuthContext {
    user: User | null;
    loggedIn: boolean;
    loading: boolean;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, /*setUser*/] = useState<User | null>(null);
    const [loading, ] = useState(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(!!getTokens());

    // const userCbk = useCallback((user: User | null) => {
    //     setUser(user);
    // }, []);

    // useEffect(() => {
    //     const unsubscribe = authService.listenAuthState(userCbk);
    //     return unsubscribe;
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // useEffect(() => {
    // const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //     setUser(currentUser);
    //     setLoading(false);
    // });
    // return unsubscribe;
    // }, [auth]);

    // const login = async (email: string, password: string): Promise<void> => {

    //     authService.signIn(email, password)
    //         .then(userCredential => {
    //             // const user = userCredential.user;
    //             // localStorage.setItem("user", JSON.stringify(user));
    //             setUser(userCredential?.user);
                
    //             // pegar token JWT (ID token)
    //             // return user.getIdToken()
    //             // user.getIdToken().then(token =>
    //             //     localStorage.setItem("tk", JSON.stringify(token))
    //             // )
    //         })
    //         .catch((error: FirebaseError) => {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             toast.error(errorMessage, {
    //                 toastId: "notification-message",
    //             });
    //             console.log("Error: ", errorCode, errorMessage);
    //         });
    // };

    const login = async (email: string, password: string) => {

        // Exemplo de login via Firebase REST
        const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            }
        );

        const data = await res.json();
        if (!res.ok) {
            toast.error("Erro: " + data.error?.message);
            return;
        }

        // Salva token
        setTokens(data.idToken, Number(data.expiresIn));

        // Atualiza estado do app
        setLoggedIn(true);
        // onLoginSuccess();
        window.location.reload();
    }

    const logout = async (): Promise<void> => {
        signOut();
        clearTokens();
        window.location.reload();
    };

    // useEffect(() => {
    //     isAuthenticated();
    // }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loggedIn,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);