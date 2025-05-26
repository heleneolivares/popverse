import React, { useContext, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { api } from "../services/api";

export const AdminRoute = () => {
    const { token } = useContext(UserContext);
    const [user, setUser] = useState({});

    useEffect(() => {
        const userData = async () => {
            try {
                const response = await api.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error al cargar los datos del perfil:", error);
            }
        };

        userData();
    }, [token]);

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />; // Redirige a la página principal si no es admin
    }

    return <Outlet />; // Renderiza las rutas hijas si el usuario es admin
};