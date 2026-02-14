import axios from 'axios';

// Use environment variable or default to Render backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smartmeter-jdw0.onrender.com/api';

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
};

// Purchases API
export const purchasesAPI = {
  buyElectricity: (data) => api.post('/purchases/buy', data),
  getHistory: () => api.get('/purchases/history'),
  getProfile: () => api.get('/purchases/profile'),
  getMeters: () => api.get('/purchases/meters'),
};

// Energy data API (meter diagnostics - live PZEM values from device)
export const energyAPI = {
  getByMeter: (meterNumber: string) => api.get<{ success: boolean; data: EnergyData }>(`/energy-data/${meterNumber}`),
};

export interface EnergyData {
  meterNumber?: string;
  token?: string;
  remainingKwh?: number;
  consumedKwh?: number;
  voltage?: number;
  current?: number;
  power?: number;
  totalEnergy?: number;
  frequency?: number;
  powerFactor?: number;
  sessionDuration?: number;
  timestampFormatted?: string;
  serverTimestamp?: string;
  receivedAt?: number;
}

// Health check
export const healthCheck = () => api.get('/health');

export default api;
