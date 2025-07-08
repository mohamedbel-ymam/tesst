import React, { createContext, useContext, useState } from "react";
import UserApi from "../services/Api/UserApi";

const Ctx = createContext({});

export function StudentProvider({ children }) {
  const [user, setUser]             = useState(JSON.parse(localStorage.getItem("user")));
  const [authenticated, setAuth]    = useState(!!localStorage.getItem("token"));

  const login = async (email, pwd) => {
    const res = await UserApi.login(email, pwd);
    if (res.status === 200) {
      const { user: u, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      setAuth(true);
    }
    return res;
  };

  const logout = async () => {
    await UserApi.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuth(false);
  };

  const me = async () => {
    const res = await UserApi.me();
    if (res.status === 200) {
      setUser(res.data);
      setAuth(true);
    }
    return res;
  };

  return (
    <Ctx.Provider value={{ user, authenticated, login, logout, me }}>
      {children}
    </Ctx.Provider>
  );
}

export const useUserContext = () => useContext(Ctx);
