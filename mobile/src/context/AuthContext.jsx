import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    if (!data.error) {
      global.token = data.token;
      setUser(data.user);
    }
    return data;
  };

  const register = async (username, email, password) => {
    const data = await api.auth.register({ username, email, password });
    if (!data.error) {
      global.token = data.token;
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    global.token = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
