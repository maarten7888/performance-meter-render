import { api } from './api';
import { YearlyTarget, CreateYearlyTargetData, UpdateYearlyTargetData } from '../types/models';

export const yearlyTargetService = {
  // Alle jaarlijkse doelen ophalen
  getAllYearlyTargets: async (): Promise<YearlyTarget[]> => {
    const response = await api.get<YearlyTarget[]>('/yearly-targets');
    return response.data;
  },

  // Jaarlijks doel ophalen
  getYearlyTarget: async (year: number): Promise<YearlyTarget> => {
    const response = await api.get<YearlyTarget>(`/yearly-targets/${year}`);
    return response.data;
  },

  // Nieuw jaarlijks doel aanmaken
  createYearlyTarget: async (data: CreateYearlyTargetData): Promise<YearlyTarget> => {
    const response = await api.post<YearlyTarget>('/yearly-targets', data);
    return response.data;
  },

  // Jaarlijks doel bijwerken
  updateYearlyTarget: async (data: UpdateYearlyTargetData): Promise<YearlyTarget> => {
    const response = await api.put<YearlyTarget>(`/yearly-targets/${data.year}`, data);
    return response.data;
  },

  // Jaarlijks doel verwijderen
  deleteYearlyTarget: async (year: number): Promise<void> => {
    await api.delete(`/yearly-targets/${year}`);
  }
}; 