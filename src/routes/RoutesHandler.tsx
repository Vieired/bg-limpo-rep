import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Games from "../pages/Games";
import Settings from "../pages/Settings";
import { useAuth } from "../contexts/authContext";
// import { requestNotificationPermission } from "../firebase";
import { requestNotificationPermission } from "../pushNotifications";

const RoutesHandler: React.FC = () => {

    const { loggedIn } = useAuth();
    // const [ isLogged, setIsLogged] = useState(false);

    // useEffect(() => {
    //     setLoggedIn(isAuthenticated());
    // }, []);

    const initFCM = async () => {
        if ("serviceWorker" in navigator) {
            console.log("🛠 Registrando service worker...");

            const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
            );

            console.log("✅ Service Worker registrado:", registration);

            // Agora sim — só depois do SW — pedir permissão e gerar token
            await requestNotificationPermission();
        }
    };

    useEffect(() => {
        if (!loggedIn) return;
        initFCM();
    }, [loggedIn]);

    {/* Rota pública */}
    if (!loggedIn) {
        return <Login/>;
        // return <Route index element={<Login />} />
    }

    {/* Rotas privadas */}
    return (
        <Routes>
            <Route index element={<Games/>} />
            <Route path="/settings" element={<Settings/>} />
            {/* <Route path="*" element={<Games/>} /> */}
        </Routes>
    )
};

export default RoutesHandler;