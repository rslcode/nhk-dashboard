import axios from 'axios';

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('custom-auth-token'); // Assuming token is stored here
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});