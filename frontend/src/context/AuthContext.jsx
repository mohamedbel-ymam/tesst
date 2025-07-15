import React, { createContext, useContext, useState, useEffect } from 'react';
import axios         from 'axios';
import { axiosClient } from '../api/axios.js';

const AuthContext = createContext({ user:null, login:async()=>{}, logout:async()=>{} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [init, setInit] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');  // sets CSRF + session cookies
        const res = await axiosClient.get('me');  // GET /api/me
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setInit(false);
      }
    })();
  }, []);

  const login = async ({ email, password }) => {
    await axios.get('/sanctum/csrf-cookie');
    await axios.post('/login', { email, password });
    const me = await axiosClient.get('me');
    setUser(me.data);
    return me.data;
  };

  const logout = async () => {
    await axiosClient.post('logout');
    setUser(null);
  };

  if (init) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
