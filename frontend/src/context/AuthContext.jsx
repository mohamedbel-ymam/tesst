// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios        from 'axios';
import { axiosClient } from '../api/axios.js';

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// ─────────────────────────────────────────────────────────────────────────────
// Set up Axios defaults so every request:
//  • Hits the correct base URL
//  • Sends & receives cookies
//  • Declares JSON responses via Accept header
// ─────────────────────────────────────────────────────────────────────────────
axios.defaults.baseURL = BASE;
axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = 'application/json';

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // 1) Fetch the CSRF cookie
    axios
      .get('/sanctum/csrf-cookie')
      // 2) Then try to read /api/me (errors <500 won’t throw)
      .then(() =>
        axiosClient.get('/me', {
          validateStatus: status => status < 500,
        })
      )
      .then(res => {
        if (res.status === 200) {
          setUser(res.data);
        }
      })
      .catch(err => {
        // Only log real network or server (5xx) errors
        if (!err.response || err.response.status >= 500) {
          console.error(err);
        }
        setUser(null);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  const login = async ({ email, password }) => {
    // CSRF cookie is fetched via axios.defaults
    await axios.get('/sanctum/csrf-cookie');
    const res = await axiosClient.post('/login', { email, password });
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await axiosClient.post('/logout');
    } catch {}
    setUser(null);
  };

  // Don’t render children until initial auth check is done
  if (initializing) {
    return null; // or <Spinner/>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
