import { api } from './api';
import { Role, Permission } from '../types/models';

interface CreateRoleData {
  name: string;
  description: string;
  permissions: number[];
}

interface UpdateRoleData extends CreateRoleData {
  id: number;
}

export const roleService = {
  // Alle rollen ophalen
  getAllRoles: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>('/roles');
    return response.data;
  },

  // Alle permissies ophalen
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await api.get<Permission[]>('/roles/permissions');
    return response.data;
  },

  // Nieuwe rol aanmaken
  createRole: async (data: CreateRoleData): Promise<Role> => {
    const response = await api.post<Role>('/roles', data);
    return response.data;
  },

  // Rol bijwerken
  updateRole: async (data: UpdateRoleData): Promise<Role> => {
    const response = await api.put<Role>(`/roles/${data.id}`, data);
    return response.data;
  },

  // Rol verwijderen
  deleteRole: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}`);
  }
}; 