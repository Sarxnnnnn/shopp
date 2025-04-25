// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // โหลดข้อมูลผู้ใช้จาก token ถ้ามี
  useEffect(() => {
    const token = localStorage.getItem('userToken');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios.get('http://localhost:5000/api/auth/me')
        .then((res) => {
          setUser(res.data.user || res.data); // แล้วแต่ API ว่า response ยังไง
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error('Token invalid or expired:', err);
          logout(); // clear ทุกอย่างถ้า token ไม่ valid
        });
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { user, token } = res.data;

    setUser(user);
    setIsLoggedIn(true);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    if (rememberMe) {
      localStorage.setItem('userToken', token);
    }
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
    const { user, token } = res.data;

    setUser(user);
    setIsLoggedIn(true);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('userToken', token);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserInfo = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        register,
        logout,
        updateUserInfo,
        setUser, // <-- สำคัญ! ให้ LoginPage ใช้ setUser หลังรับ response API
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
