import axios from 'axios';

// Resolve API base safely: prefer Vite env, then fallback to process.env if available, finally a hardcoded default.
let API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  || (typeof process !== 'undefined' && process.env && process.env.API_URL)
  || 'https://normativas-backend.onrender.com/api';

// Ensure it ends with /api (Render builds often provide just the host URL)
if (!API_BASE.endsWith('/api')) {
  API_BASE += '/api';
}

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

// For web: attach token from localStorage if present
instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handler: if unauthorized, clear session and reload so user can login again
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    // Don't auto-logout on login failures
    if (err && err.response && err.response.status === 401) {
      if (err.config && err.config.url && err.config.url.includes('/auth/token/')) {
        return Promise.reject(err);
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        // reload to force login
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

export { API_BASE };
export default instance;
