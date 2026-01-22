import {
    createContext,
    useCallback,
    useContext,
    useState
} from "react";
import { toast } from "react-toastify";
import { type User } from "firebase/auth";
import { authService } from "../shared/services/authService";
import type { FirebaseTokenValidationResult } from "../shared/models/domain/Auth";
import {
    clearTokenFromStorage,
    getAccessTokenFromStorage,
    isAuthenticated,
    setTokenToStorage
} from "../shared/helpers/auth";

interface IAuthContext {
    user: User | null;
    loggedIn: boolean;
    // isLoading: boolean;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => Promise<void>;
    logoutIfExpiredToken: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export interface AuthTokens {
  idToken: string;
  expiresAt: number; // timestamp em ms
}

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, /*setUser*/] = useState<User | null>(null);
    // const [isLoading, setIsLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(isAuthenticated());

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

        authService.signIn(email, password)
            .then(async (response) => {
                if (response?.status === 200) {
                    const data = await response.json();
                    if (!response.ok) {
                        toast.error("Erro: " + data.error?.message);
                        return;
                    }

                    // Salva token
                    setTokenToStorage(data.idToken, Number(data.expiresIn));

                    // Atualiza estado do app
                    setLoggedIn(true);
                }
            });

        // const data = await res.json();
        // if (!res.ok) {
        //     toast.error("Erro: " + data.error?.message);
        //     return;
        // }

        // // Salva token
        // setTokenToStorage(data.idToken, Number(data.expiresIn));

        // // Atualiza estado do app
        // setLoggedIn(true);
        // // onLoginSuccess();
        // window.location.reload();
    }

    const logout = async (): Promise<void> => {
        authService.signOut().then(() => {
            clearTokenFromStorage();
            window.location.reload();
        });
    };

    const logoutIfExpiredToken = useCallback((): void => { // TODO: método para usar caso o app ainda não esteja redirecionando quando o token expirar

        const accessToken = getAccessTokenFromStorage();

        if (!accessToken || !accessToken?.idToken) {
            clearTokenFromStorage();
            setLoggedIn(false);
            // window.location.reload();
            // logout();
            return;
        }

        authService.validateFirebaseIdToken(accessToken.idToken)
            .then((response: FirebaseTokenValidationResult) => {
                if (!response?.valid) {
                    clearTokenFromStorage();
                    setLoggedIn(false);
                }
            })
    }, []);

    // useEffect(() => {
    //     // setLoggedIn(isAuthenticated());
    //     console.log("Checando validade do token...");
    //     logoutIfExpiredToken();
    // }, [logoutIfExpiredToken]);

    return (
        <AuthContext.Provider value={{
            user,
            loggedIn,
            // isLoading,
            login,
            logout,
            logoutIfExpiredToken,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
