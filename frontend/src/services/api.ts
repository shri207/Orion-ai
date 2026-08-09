import axios from 'axios';
import { useInterviewStore } from '../store/useInterviewStore';

const API_KEY = import.meta.env.VITE_API_KEY || 'dev-key';
const API_BASE = import.meta.env.VITE_API_URL ?? '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  timeout: 60_000,
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = useInterviewStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401: only redirect to '/' on protected routes when a token already existed.
// Never redirect on /auth/* calls — those are used to GET a token in the first place.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url: string = err.config?.url ?? '';
    const isAuthRoute = url.includes('/auth/');
    const hasToken = !!useInterviewStore.getState().token;

    if (err.response?.status === 401 && !isAuthRoute && hasToken) {
      useInterviewStore.getState().clearToken();
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
