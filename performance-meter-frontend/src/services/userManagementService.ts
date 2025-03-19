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

export const userManagementService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      console.log('Debug: Fetching users from:', `${API_BASE_URL}/user-management/users`);
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/user-management/users`);
      console.log('Debug: Response:', response.data);
      return response.data.users;
    } catch (error) {
      console.error('Debug: Error fetching users:', error);
      throw error;
    }
  },

  updateYearlyTarget: async (userId: number, yearlyTarget: number): Promise<void> => {
    try {
      console.log('Debug: Updating yearly target:', { userId, yearlyTarget });
      await axios.put(`${API_BASE_URL}/user-management/users/${userId}/yearly-target`, {
        yearlyTarget
      });
      console.log('Debug: Yearly target updated successfully');
    } catch (error) {
      console.error('Debug: Error updating yearly target:', error);
      throw error;
    }
  },

  getUserYearlyTarget: async (userId: number): Promise<number | null> => {
    try {
      console.log('Debug: Fetching yearly target for user:', userId);
      const response = await axios.get<YearlyTargetResponse>(`${API_BASE_URL}/user-management/users/${userId}/yearly-target`);
      console.log('Debug: Response:', response.data);
      return response.data.yearlyTarget;
    } catch (error) {
      console.error('Debug: Error fetching yearly target:', error);
      throw error;
    }
  }
}; 