import { api } from './api';
import { HourRegistration, CreateHourRegistrationData, UpdateHourRegistrationData } from '../types/models';

export const hourService = {
  // Alle urenregistraties ophalen voor een project
  getProjectHours: async (projectId: number): Promise<HourRegistration[]> => {
    const response = await api.get<HourRegistration[]>(`/hours/project/${projectId}`);
    return response.data;
  },

  // Nieuwe urenregistratie aanmaken
  createHourRegistration: async (data: CreateHourRegistrationData): Promise<HourRegistration> => {
    const response = await api.post<HourRegistration>('/hours', data);
    return response.data;
  },

  // Urenregistratie bijwerken
  updateHourRegistration: async (data: UpdateHourRegistrationData): Promise<HourRegistration> => {
    const response = await api.put<HourRegistration>(`/hours/${data.id}`, data);
    return response.data;
  },

  // Urenregistratie verwijderen
  deleteHourRegistration: async (id: number): Promise<void> => {
    await api.delete(`/hours/${id}`);
  }
}; 