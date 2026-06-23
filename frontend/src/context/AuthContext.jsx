import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/user/profile');
          setUser(res.data.user);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ id: "mock_id", email }); // Fallback before profile fetch
    
    // Fetch profile right after login
    const profileRes = await api.get('/user/profile');
    setUser(profileRes.data.user);
    return res.data;
  };

  const register = async (fullName, email, password) => {
    const res = await api.post('/auth/register', { fullName, email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ id: "mock_id", email });
    
    const profileRes = await api.get('/user/profile');
    setUser(profileRes.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
