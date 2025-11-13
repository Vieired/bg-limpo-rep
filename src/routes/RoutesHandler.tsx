import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Games from "../pages/Games";
import Settings from "../pages/Settings";
import { isAuthenticated } from "../shared/services/authService";
import { useEffect, useState } from "react";

const RoutesHandler: React.FC = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(isAuthenticated());
    }, []);

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