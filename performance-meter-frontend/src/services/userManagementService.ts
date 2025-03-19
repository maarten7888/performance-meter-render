import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface User {
  id: number;
  email: string;
  yearlyTarget: number | null;
}

interface ApiResponse {
  users: User[];
}

interface YearlyTargetResponse {
  yearlyTarget: number | null;
}

// Maak een axios instance met de juiste configuratie
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Voeg een request interceptor toe voor de token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userManagementService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const url = `/api/user-management/users`;
      console.log('Debug: API_BASE_URL:', API_BASE_URL);
      console.log('Debug: Full URL:', url);
      console.log('Debug: Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      
      const response = await api.get<ApiResponse>(url);
      console.log('Debug: Response status:', response.status);
      console.log('Debug: Response headers:', response.headers);
      console.log('Debug: Response data:', response.data);
      return response.data.users;
    } catch (error: any) {
      console.error('Debug: Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      throw error;
    }
  },

  updateYearlyTarget: async (userId: number, yearlyTarget: number): Promise<void> => {
    try {
      const url = `/api/user-management/users/${userId}/yearly-target`;
      console.log('Debug: Full URL:', url);
      console.log('Debug: Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      
      await api.put(url, { yearlyTarget });
      console.log('Debug: Yearly target updated successfully');
    } catch (error: any) {
      console.error('Debug: Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      throw error;
    }
  },

  getUserYearlyTarget: async (userId: number): Promise<number | null> => {
    try {
      const url = `/api/user-management/users/${userId}/yearly-target`;
      console.log('Debug: Full URL:', url);
      console.log('Debug: Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      
      const response = await api.get<YearlyTargetResponse>(url);
      console.log('Debug: Response status:', response.status);
      console.log('Debug: Response headers:', response.headers);
      console.log('Debug: Response data:', response.data);
      return response.data.yearlyTarget;
    } catch (error: any) {
      console.error('Debug: Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      throw error;
    }
  }
}; 