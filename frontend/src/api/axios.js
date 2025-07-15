import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

axios.defaults.baseURL = BASE;
axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = 'application/json';

export const axiosClient = axios.create({
  baseURL: `${BASE}/api`,
    withCredentials: true,            // ensure cookies are sent on API calls
  headers: {
    Accept: 'application/json',     // tell Laravel to return JSON 401s
  },

  
});

axiosClient.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
