import api from './api';
import mockUsers from '../mocks/users.json';

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

// Gebruik lokaal JSON bestand in plaats van API calls
const USE_LOCAL_MOCK = true;

export const userManagementService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      // Gebruik lokaal JSON bestand
      if (USE_LOCAL_MOCK) {
        console.log('Debug: [LOCAL MOCK] Using local mock data');
        return Promise.resolve(mockUsers.users);
      }
      
      // Gebruik API
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
      // Gebruik lokaal mock
      if (USE_LOCAL_MOCK) {
        console.log('Debug: [LOCAL MOCK] Updating yearly target:', { userId, yearlyTarget });
        // Zoek de gebruiker in het lokale JSON bestand en update de waarde (bij echte implementatie)
        return Promise.resolve();
      }
      
      // Gebruik API
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
      // Gebruik lokaal mock
      if (USE_LOCAL_MOCK) {
        console.log('Debug: [LOCAL MOCK] Getting yearly target for user:', userId);
        const user = mockUsers.users.find(u => u.id === userId);
        return Promise.resolve(user?.yearlyTarget || null);
      }
      
      // Gebruik API
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