import { useFormik } from "formik";
import type { Auth } from "../../shared/models/domain/Auth";
import { useAuth } from "../../contexts/authContext";
import { BigSpinner } from "../../components/BigSpinner";
import Input from "../../components/Inputs/Input";
import Button from "../../components/Inputs/Button";
import { Container } from "./styles";


const Login: React.FC = () => {

    const { login } = useAuth();

    const handleSubmit = (data: Auth): void => {
        
        login(data.email, data.password)
            .finally(() => {
                setTimeout(() => formik.setSubmitting(false), 4000)
            })
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
                        placeholder="E-mail"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        // disabled={formik.isSubmitting}
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        // disabled={formik.isSubmitting}
                    />
                    <Button
                        type="submit"
                        btntheme="primary"
                        // disabled={formik.isSubmitting}
                    >
                        Entrar
                    </Button>
                </form>
            </div>
            { formik.isSubmitting && <BigSpinner/> }
        </Container>
    );
};

export default Login;