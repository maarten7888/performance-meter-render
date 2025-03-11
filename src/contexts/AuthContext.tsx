import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../interfaces/User';
import api from '../services/api';
import { AxiosResponse } from 'axios';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, yearTarget: number) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface UserResponse {
    user: User;
}

interface AuthResponse extends UserResponse {
    token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get<UserResponse>('/api/users/me')
                .then((response: AxiosResponse<UserResponse>) => {
                    setUser(response.data.user);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                });
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const register = async (email: string, password: string, yearTarget: number) => {
        const response = await api.post<AuthResponse>('/api/auth/register', {
            email,
            password,
            yearTarget
        });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
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