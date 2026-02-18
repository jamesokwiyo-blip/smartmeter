import axios from 'axios';

// All requests use the same base URL (local or remote depending on .env)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smartmeter-jdw0.onrender.com/api';

// Energy data uses its own URL so it can be overridden independently
// Default: same as API_BASE_URL (full local environment)
const ENERGY_API_URL = import.meta.env.VITE_ENERGY_API_URL || API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Energy data client — points to local server when VITE_ENERGY_API_URL is set locally
const remoteApi = axios.create({
  baseURL: ENERGY_API_URL,
  headers: { 'Content-Type': 'application/json' },
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

// Energy data API — always fetches from remote server where the device sends its readings
export const energyAPI = {
  getByMeter: (meterNumber: string) => remoteApi.get<{ success: boolean; data: EnergyData }>(`/energy-data/${meterNumber}`),
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
