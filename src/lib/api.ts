import axios from 'axios';

// Use environment variable or default to local server in development, Render in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5000/api'  // Local development
    : 'https://smartmeter-jdw0.onrender.com/api');  // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Purchases API
export const purchasesAPI = {
  buyElectricity: (data) => api.post('/purchases/buy', data),
  getHistory: () => api.get('/purchases/history'),
  getProfile: () => api.get('/purchases/profile'),
  getMeters: () => api.get('/purchases/meters'),
};

// Energy data API (from ESP32 meter - same contract as api-server)
export const energyDataAPI = {
  getLatestByMeter: (meterNumber: string) =>
    api.get(`/energy-data/${encodeURIComponent(meterNumber)}`),
  getList: (params?: { meterNumber?: string; limit?: number; offset?: number }) =>
    api.get('/energy-data', { params }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
