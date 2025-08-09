import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosBase, axiosClient } from '../api/axios';

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await axiosBase.get('/sanctum/csrf-cookie');
        const res = await axiosClient.get('/me');
        if (isMounted) setUser(res.data);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, []);

  const login = async ({ email, password }) => {
    await axiosBase.get('/sanctum/csrf-cookie');
    await axiosBase.post('/login', { email, password });
    const me = await axiosClient.get('/me');
    setUser(me.data);
    return me.data;
  };

  const logout = async () => {
    try {
        await axiosClient.post('/logout');
        setUser(null);
    } catch (err) {
        console.error('Logout failed:', err);
        // Optionnel : notif, redirect, etc.
    }
  };

  if (loading) return <div>Chargement…</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
