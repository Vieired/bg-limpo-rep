import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Games from "@/pages/Games";
import Settings from "@/pages/Settings";
import { useAuth } from "@/contexts/authContext";
// import { requestNotificationPermission } from "@/firebase";
import { requestNotificationPermission } from "@/pushNotifications";
import { onMessage, type MessagePayload } from "firebase/messaging";
import { messaging } from "@/firebase";
import reactSvg from '@/assets/react.svg';

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

        onMessage(messaging, (payload: MessagePayload) => {
            // console.log("📩 Notificação recebida em foreground:", payload);

            const { title, body, image } = payload.data || {};
            const improvedTitle = title ? `${title} (foreground)` : "Notificação em Foreground";

            new Notification(improvedTitle, {
                body: body,
                icon: image || reactSvg,
            });
        });
    }, [loggedIn]);

    {/* Rota pública */}
    if (!loggedIn) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        )
    }

    {/* Rotas privadas */}
    return (
        <Routes>
            <Route index element={<Games/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path="*" element={<Navigate to="/" replace />}  />
        </Routes>
    )
};

export default RoutesHandler;