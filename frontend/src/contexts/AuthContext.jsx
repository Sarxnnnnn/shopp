// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email, password, rememberMe) => {
    // ตัวอย่าง mock login สำหรับผู้ใช้
    const mockUser = {
      name: 'John Doe',
      email,
      avatar: 'https://i.pravatar.cc/150?img=42',
      memberSince: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      address: 'ยังไม่มีข้อมูลที่อยู่',
      role: 'user',
    };
    setUser(mockUser);
    setIsLoggedIn(true);
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(mockUser));
    }
  };

  const register = (email, password, name) => {
    const newUser = {
      name,
      email,
      avatar: 'https://www.gravatar.com/avatar/?d=mp',
      memberSince: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      address: 'ยังไม่มีข้อมูลที่อยู่',
      role: 'user',
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserInfo = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, register, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
