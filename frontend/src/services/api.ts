import axios from 'axios';
import { ConsultantProfileDB } from '../types/consultantProfile';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://performance-meter-render-6i1b.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Consultant Profile API calls
export const getConsultantProfile = async (email: string): Promise<ConsultantProfileDB> => {
    try {
        const response = await api.get(`/api/consultant-profile/${email}`);
        return response.data as ConsultantProfileDB;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Profiel niet gevonden');
        }
        throw new Error(error.message || 'Er is een fout opgetreden bij het ophalen van het profiel');
    }
};

export const updateConsultantProfile = async (email: string, data: ConsultantProfileDB): Promise<ConsultantProfileDB> => {
    try {
        const response = await api.put(`/api/consultant-profile/${email}`, data);
        return response.data as ConsultantProfileDB;
    } catch (error: any) {
        throw new Error(error.message || 'Er is een fout opgetreden bij het bijwerken van het profiel');
    }
}; 