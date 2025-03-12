import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../interfaces/User';
import api from '../services/api';

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
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/api/users/me')
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { token, user: userData } = response.data;
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
            const response = await api.post('/api/auth/register', { email, password, name });
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 409) {
                    throw new Error('Dit e-mailadres is al in gebruik');
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