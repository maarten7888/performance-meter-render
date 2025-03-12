import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { User } from '../interfaces/User';

interface UserResponse {
    user: User;
}

interface AuthResponse {
    token: string;
    user: User;
}

const API_URL = 'https://performance-meter-backend.onrender.com';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for JWT token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Add type-safe methods
export const authApi = {
    getCurrentUser: (): Promise<AxiosResponse<UserResponse>> => api.get<UserResponse>('/api/users/me'),
    login: (email: string, password: string): Promise<AxiosResponse<AuthResponse>> => 
        api.post<AuthResponse>('/api/auth/login', { email, password }),
    register: (email: string, password: string, name: string): Promise<AxiosResponse<AuthResponse>> => 
        api.post<AuthResponse>('/api/auth/register', { email, password, name })
};

export default api; 