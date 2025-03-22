import axios from 'axios';

export const fetchProjects = async () => {
  try {
    const response = await axios.get('/api/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: any; status: number; headers: any } };
      console.error('Error response:', axiosError.response.data);
      console.error('Error status:', axiosError.response.status);
      console.error('Error headers:', axiosError.response.headers);
    }
    throw error;
  }
}; 