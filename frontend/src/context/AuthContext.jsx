import React, {createContext,useContext,useState} from 'react';
import { axiosClient } from '../api/axios';

const AuthCtx = createContext();
export function AuthProvider({children}){
  const [user,setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const login = async (email,password) => {
    const res = await axiosClient.post('/login',{email,password});
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await axiosClient.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{user,login,logout}}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
