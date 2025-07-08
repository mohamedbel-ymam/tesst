import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const axiosClient = axios.create({
  baseURL: `${BASE}/api`,
  withCredentials: false,  // no cookies
});

axiosClient.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
