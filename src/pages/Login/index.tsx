// import { useCallback } from "react";
// import { toast } from "react-toastify";
import { useFormik } from "formik";
import type { Auth } from "../../shared/models/domain/Auth";
// import { authService } from "../../shared/services/authService";
// import type { FirebaseError } from "firebase/app";
import Input from "../../components/Inputs/Input";
import Button from "../../components/Inputs/Button";
import { Container } from "./styles";
import { useAuth } from "../../contexts/authContext";


const Login: React.FC = () => {

    const { login } = useAuth();

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

    return (
        <Container>
            <div>
                <h1>
                    BG Limpo 2.0
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