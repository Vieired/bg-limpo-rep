import { useCallback } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import type { Auth } from "../../shared/models/domain/Auth";
import { authService } from "../../shared/services/authService";
import type { FirebaseError } from "firebase/app";
import Input from "../../components/Inputs/Input";
import Button from "../../components/Inputs/Button";
import { Container } from "./styles";


const Login: React.FC = () => {
    
    const login = useCallback(async (email: string, senha: string): Promise<void> => {

        authService.signIn(email, senha)
            .then(userCredential => {
                const user = userCredential.user;
                localStorage.setItem("user", JSON.stringify(user));
                
                // pegar token JWT (ID token)
                // return user.getIdToken()
                // user.getIdToken().then(token =>
                //     localStorage.setItem("tk", JSON.stringify(token))
                // )
            })
            .catch((error: FirebaseError) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage, {
                    toastId: "notification-message",
                });
                console.log("Error: ", errorCode, errorMessage);
            });
    }, []);

    const handleSubmit = (data: Auth) => {
        
        login(data.email, data.password);
    }

    const formik = useFormik({
        onSubmit: handleSubmit,
        // validationSchema: schema,
        // enableReinitialize: true,
        initialValues: {
            email: "",
            password: "",
        } as Auth,
    });

    // useEffect(() => {
    //     localStorage.getItem("user");
    // }, []);

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

    return (
        <Container>
            <div>
                <h1>
                    BG Limpo
                </h1>
            </div>
            <div>
                <h2>Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        placeholder="E-mail"
                    />
                    <Input
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        placeholder="Password"
                    />
                    <Button
                        type="submit"
                        btntheme="primary"
                        // disabled={checkDisabledSubmit()}
                    >
                        Entrar
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default Login;