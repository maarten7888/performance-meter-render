import api from './api';

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

export const userManagementService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const endpoint = '/api/user-management/users';
      console.log('Debug: Fetching users from:', endpoint);
      
      const response = await api.get<ApiResponse>(endpoint);
      console.log('Debug: Response status:', response.status);
      console.log('Debug: Response data:', response.data);
      return response.data.users;
    } catch (error: any) {
      console.error('Debug: Error fetching users:', error);
      throw error;
    }
  },

  updateYearlyTarget: async (userId: number, yearlyTarget: number): Promise<void> => {
    try {
      const endpoint = `/api/user-management/users/${userId}/yearly-target`;
      console.log('Debug: Updating yearly target:', { userId, yearlyTarget, endpoint });
      
      await api.put(endpoint, {
        yearlyTarget
      });
      console.log('Debug: Yearly target updated successfully');
    } catch (error: any) {
      console.error('Debug: Error updating yearly target:', error);
      throw error;
    }
  },

  getUserYearlyTarget: async (userId: number): Promise<number | null> => {
    try {
      const endpoint = `/api/user-management/users/${userId}/yearly-target`;
      console.log('Debug: Fetching yearly target for user:', userId, 'from endpoint:', endpoint);
      
      const response = await api.get<YearlyTargetResponse>(endpoint);
      console.log('Debug: Response status:', response.status);
      console.log('Debug: Response data:', response.data);
      return response.data.yearlyTarget;
    } catch (error: any) {
      console.error('Debug: Error fetching yearly target:', error);
      throw error;
    }
  }
}; 