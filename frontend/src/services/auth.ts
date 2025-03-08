import { api } from './api';
import { User } from '../types/models';

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  // Registreren
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<LoginResponse>('/auth/register', data);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },

  // Inloggen
  login: async (data: LoginData): Promise<User> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },

  // Uitloggen
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Profiel ophalen
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  }
}; 