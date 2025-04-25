import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/admin/me')
        .then(res => setAdmin(res.data))
        .catch(() => {
          localStorage.removeItem('adminToken');
          delete axios.defaults.headers.common['Authorization'];
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      const res = await axios.post('/api/admin/login', { email, password });
      const { token, admin } = res.data;

      localStorage.setItem('adminToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (remember) {
        localStorage.setItem('adminLogin', JSON.stringify({ email, password, remember: true }));
      } else {
        localStorage.removeItem('adminLogin');
      }

      setAdmin(admin);
      return true;
    } catch (error) {
      throw new Error('Login failed, please check credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
