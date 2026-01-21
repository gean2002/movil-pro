import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as shopifyLoginUser, registerUser as shopifyRegisterUser } from '../lib/shopify';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('shopifyCustomerAccessToken'));
    const isAuthenticated = !!token;

    const login = async (email: string, password: string) => {
        try {
            const accessToken = await shopifyLoginUser(email, password);
            if (accessToken) {
                setToken(accessToken.accessToken);
                localStorage.setItem('shopifyCustomerAccessToken', accessToken.accessToken);
                localStorage.setItem('shopifyCustomerExpiresAt', accessToken.expiresAt);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        try {
            const newUser = await shopifyRegisterUser(email, password, firstName, lastName);
            if (newUser) {
                // Auto login after successful registration
                return await login(email, password);
            }
            return false;
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('shopifyCustomerAccessToken');
        localStorage.removeItem('shopifyCustomerExpiresAt');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
