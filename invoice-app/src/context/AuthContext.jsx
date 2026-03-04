import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in on mount
        const authStatus = localStorage.getItem('invoiceApp_auth');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (username, password) => {
        // Hardcoded credentials for demonstration
        // You can change these to whatever you prefer, or load from .env
        const validUsername = import.meta.env.VITE_ADMIN_USER || 'admin';
        const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password123';

        if (username === validUsername && password === validPassword) {
            setIsAuthenticated(true);
            localStorage.setItem('invoiceApp_auth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('invoiceApp_auth');
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
