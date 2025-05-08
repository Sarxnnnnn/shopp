import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Create admin axios instance
const adminApi = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const location = useLocation();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const response = await adminApi.get('/api/admin/me');
      if (response.data.success) {
        setAdmin({ ...response.data.user, token });
      } else {
        localStorage.removeItem('adminToken');
        setAdmin(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
      }

      const response = await axios.post('/api/admin/auth/login', {
        email,
        password
      });

      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        setAdmin({ ...response.data.user, token: response.data.token });
        navigate('/admin/dashboard');
        return true;
      }
      
      throw new Error(response.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } catch (error) {
      console.error('Admin login failed:', error);
      throw new Error(error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    navigate('/admin/login'); 
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      setAdmin,
      login,
      logout,
      loading,
      isAuthenticated: !!admin
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};