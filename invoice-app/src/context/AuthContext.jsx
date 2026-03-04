import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in and session is valid
        const sessionData = localStorage.getItem('invoiceApp_auth');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();

                // Check if the 7-day expiration timestamp has passed
                if (session.expiresAt && now < session.expiresAt) {
                    setIsAuthenticated(true);
                } else {
                    // Session expired, clear it
                    localStorage.removeItem('invoiceApp_auth');
                }
            } catch (e) {
                // Invalid JSON, clear it
                localStorage.removeItem('invoiceApp_auth');
            }
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

            // Set session to expire in 7 days
            const MS_IN_DAY = 24 * 60 * 60 * 1000;
            const expiresAt = new Date().getTime() + (7 * MS_IN_DAY);

            localStorage.setItem('invoiceApp_auth', JSON.stringify({
                authenticated: true,
                expiresAt: expiresAt
            }));
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
