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

// Gebruik mock endpoint voor debugging
const USE_MOCK_ENDPOINT = true;
const USE_DIRECT_ENDPOINTS = false;

// Pad kiezer
let BASE_PATH = '/api/user-management';
if (USE_MOCK_ENDPOINT) {
  BASE_PATH = '/api/mock';
} else if (USE_DIRECT_ENDPOINTS) {
  BASE_PATH = '/api/user-management-direct';
}

export const userManagementService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const endpoint = `${BASE_PATH}/users`;
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
      // Als we mock data gebruiken, simuleren we een succesvolle update
      if (USE_MOCK_ENDPOINT) {
        console.log('Debug: [MOCK] Updating yearly target:', { userId, yearlyTarget });
        return Promise.resolve();
      }
      
      const endpoint = `${BASE_PATH}/users/${userId}/yearly-target`;
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
      // Als we mock data gebruiken, retourneren we een vaste waarde
      if (USE_MOCK_ENDPOINT) {
        console.log('Debug: [MOCK] Getting yearly target for user:', userId);
        return Promise.resolve(1000 * userId);
      }
      
      const endpoint = `${BASE_PATH}/users/${userId}/yearly-target`;
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