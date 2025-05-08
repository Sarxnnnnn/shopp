import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

// สร้าง instance ของ axios พร้อมการตั้งค่าเริ่มต้น
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  }
});

// เพิ่ม interceptor สำหรับแนบ token ในทุกคำขอ
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Context Provider สำหรับการจัดการ Authentication
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({ ...userData, token });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        logout();
      }
    }
  }, []);

  // ตรวจสอบ token และดึงข้อมูลผู้ใช้เมื่อ component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser({ ...response.data, token });
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('userToken', token);
      localStorage.setItem('token', token);
      setUser({ ...user, token });
      setIsLoggedIn(true);

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
      throw new Error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (name, email, password) => {
    try {
      const res = await axiosInstance.post('/api/auth/register', {
        name,
        email,
        password,
      });

      if (res.data.success) {
        const { user, token } = res.data;
        setUser(user);
        setIsLoggedIn(true);
        localStorage.setItem('userToken', token);
        localStorage.setItem('token', token);
        return res.data;
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
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
        loading,
        login,
        register,
        logout,
        updateUserInfo,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;