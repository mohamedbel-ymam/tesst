// src/api/axios.js
import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Instance pour tout le backend (sans /api)
export const axiosBase = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// Instance pour l'API (préfixe /api)
export const axiosClient = axios.create({
  baseURL: `${BASE}/api`,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// Ajoute le header XSRF-TOKEN sur les deux instances
const setXsrfHeader = (instance) => {
  instance.interceptors.request.use((config) => {
    const matches = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    if (matches) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(matches[2]);
    }
    return config;
  });
};
let csrfFetched = false;
export async function ensureCsrf() {
  if (!csrfFetched) {
    await axiosBase.get("/sanctum/csrf-cookie");
    csrfFetched = true;
  }
}

setXsrfHeader(axiosBase);
setXsrfHeader(axiosClient);
