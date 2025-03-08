import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://performance-meter-render.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Voeg een request interceptor toe om de token toe te voegen
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 