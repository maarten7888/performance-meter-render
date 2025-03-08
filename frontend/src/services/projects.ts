import { api } from './api';
import { Project, CreateProjectData, UpdateProjectData, MonthlyStats, YearlyTargetStats } from '../types/models';

export const projectService = {
  // Alle projecten ophalen
  getAllProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  // Project ophalen
  getProject: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // Nieuwe project aanmaken
  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  // Project bijwerken
  updateProject: async (data: UpdateProjectData): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${data.id}`, data);
    return response.data;
  },

  // Project verwijderen
  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  // Maandelijkse statistieken ophalen
  getMonthlyStats: async (): Promise<MonthlyStats[]> => {
    const response = await api.get<MonthlyStats[]>('/projects/stats/monthly');
    return response.data;
  },

  // Jaarlijkse target statistieken ophalen
  getYearlyTargetStats: async (): Promise<YearlyTargetStats[]> => {
    const response = await api.get<YearlyTargetStats[]>('/projects/stats/yearly-target');
    return response.data;
  }
}; 