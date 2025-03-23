import axios from 'axios';
import { ConsultantProfile, ConsultantProfileDB } from '../types/consultantProfile';

const API_BASE_URL = 'https://performance-meter-render-6i1b.onrender.com/api';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://performance-meter-render-6i1b.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        if (!config.headers) {
            config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is ongeldig of verlopen
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// Consultant Profile API calls
export const getConsultantProfile = async (email: string): Promise<ConsultantProfileDB> => {
    try {
        const response = await api.get(`/api/consultant-profiles/${email}`);
        return response.data as ConsultantProfileDB;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Profiel niet gevonden');
        }
        throw new Error(error.message || 'Er is een fout opgetreden bij het ophalen van het profiel');
    }
};

export const createConsultantProfile = async (profile: ConsultantProfileDB): Promise<ConsultantProfileDB> => {
    try {
        const response = await api.post('/api/consultant-profiles', profile);
        return response.data as ConsultantProfileDB;
    } catch (error: any) {
        throw new Error(error.message || 'Er is een fout opgetreden bij het aanmaken van het profiel');
    }
};

export const updateConsultantProfile = async (email: string, profile: ConsultantProfileDB): Promise<ConsultantProfileDB> => {
    try {
        console.log('Updating profile for email:', email);
        console.log('Profile data:', profile);
        const response = await api.put(`/api/consultant-profiles/${email}`, profile);
        console.log('Response from server:', response.data);
        return response.data as ConsultantProfileDB;
    } catch (error: any) {
        console.error('Error in updateConsultantProfile:', error);
        throw new Error(error.response?.data?.message || error.message || 'Er is een fout opgetreden bij het bijwerken van het profiel');
    }
};

export default api; 