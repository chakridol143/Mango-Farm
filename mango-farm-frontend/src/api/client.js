import axios from 'axios';

// Base URL for the backend API. Configured via Vite env (VITE_API_URL).
// Falls back to local dev backend. Note: backend mounts everything under /api.
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const TOKEN_KEY = 'mf_token';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the stored JWT to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handling: clear the stale session so the UI can prompt re-login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('mf_user');
      // Let route guards react to the cleared session on next render.
      window.dispatchEvent(new Event('mf:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
