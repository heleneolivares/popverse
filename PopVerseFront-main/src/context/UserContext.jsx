import React, { createContext, useState } from 'react';
import { api } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token: receivedToken } = response.data;
            setToken(receivedToken);
            setEmail(email);
            return true;
        } catch (error) {
            console.error("Error en login:", error);
            return false;
        }
    };

    const register = async (name, lastname, email, password, confirm) => {
        try {
            await api.post("/auth/register", { name, lastname, email, password, confirm });
            return true;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return false;
        }
    };

    const getProfile = async () => {
        if (token) {
            try {
                const response = await api.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error("Error al obtener perfil:", error);
            }
        }
        return null;
    };

    const logout = () => {
        setToken(null);
        setEmail(null);
    };

    return (
        <UserContext.Provider value={{ token, email, login, register, logout, getProfile }}>
            {children}
        </UserContext.Provider>
    );
};
