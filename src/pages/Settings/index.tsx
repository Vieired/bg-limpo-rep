import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft as LeftIcon, FaCheck } from 'react-icons/fa';
import { useFormik } from "formik";
import Skeleton from "react-loading-skeleton";
import { settingsService } from "../../shared/services/settingsService";
import Button from "../../components/Inputs/Button";
import InputNumber from "../../components/Inputs/InputNumber";
import { FirebaseError } from "firebase/app";
import { Container, Content, Buttons } from "./styles";



const Settings: React.FC = () => {

    const navigate = useNavigate();

    const [ cleaningFrequency, setCleaningFrequency ] = useState<number>(0);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const handleSubmit = (data: { limitInDays: number }) => {

        settingsService.updateSettings({cleaning_frequency: data.limitInDays})
            .then(() => {
                toast.success("Frequência de limpezas alterada com sucesso.", {
                    toastId: "notification-message",
                });
        
                navigate('/');
            })
            .catch((error: FirebaseError) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(`Erro ao tentar alterar Frequência de limpezas (${errorMessage}).`, {
                    toastId: "notification-message",
                });
                console.log("Error: ", errorCode, errorMessage);
                // throw new Error(error.response?.data?.Message || 'Error');
            });
        
    }

    const formik = useFormik({
        onSubmit: handleSubmit,
        enableReinitialize: true,
        initialValues: {
            limitInDays: cleaningFrequency
        },
    });

    useEffect(() => {
        settingsService.fetchSettings()
            .then((cleaningFrequency: number) => {
                setCleaningFrequency(cleaningFrequency);
                setIsLoading(false);
            })
    }, []);

    return (
        <Container>
            <Content>
                <nav>
                    <Button
                        btntheme="secondary"
                        onClick={() => navigate('/')}
                        title="Configurações"
                    >
                        <LeftIcon /> Voltar
                    </Button>
                </nav>
                <h2>Configurações</h2>
                <small>v.2.0</small>
                <form onSubmit={formik.handleSubmit}>
                    {isLoading ? (
                        <Skeleton
                            height={20+46+15}
                            baseColor="#00000017"
                            highlightColor="#00000047"
                        />
                    ) : (
                        <InputNumber
                            name="limitInDays"
                            label="Frequência de Limpeza (dias)"
                            placeholder="Exemplo: 150"
                            value={formik.values.limitInDays}
                            onChange={formik.handleChange}
                            disabled={isLoading}
                        />
                    )}
                    <Buttons>
                        <Button
                            btntheme="primary"
                            type="submit"
                            disabled={!formik.dirty}
                        >
                            <FaCheck /> Salvar
                        </Button>
                    </Buttons>
                </form>
            </Content>
        </Container>
    );
};

export default Settings;