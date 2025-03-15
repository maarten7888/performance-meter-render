import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
    id: number;
    email: string;
    name: string;
    role?: 'admin' | 'user';
}

interface AuthResponse {
    token: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get<{ user: User }>('/api/users/me');
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
            console.log('Login response:', response.data);
            const { token, user: userData } = response.data;
            console.log('User data from login:', userData);
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('Ongeldige inloggegevens');
                }
                throw new Error(error.response.data.message || 'Er is een fout opgetreden bij het inloggen');
            }
            throw new Error('Er is een fout opgetreden bij het inloggen');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await api.post<AuthResponse>('/api/auth/register', { email, password, name });
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 400) {
                    throw new Error(error.response.data.message || 'Email is al in gebruik');
                }
                throw new Error(error.response.data.message || 'Er is een fout opgetreden bij het registreren');
            }
            throw new Error('Er is een fout opgetreden bij het registreren');
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            isAuthenticated: !!user,
            login, 
            logout, 
            register 
        }}>
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