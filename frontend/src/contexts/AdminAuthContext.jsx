// AdminAuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Context สำหรับ Admin Authentication
const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  // รีเฟรชและดึงข้อมูล admin ด้วย token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.get('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setAdmin(res.data))
        .catch(() => setAdmin(null));
    }
  }, []);

  // ฟังก์ชัน Login (เชื่อม API)
  const login = async (email, password) => {
    const res = await axios.post('/api/admin/login', { email, password });
    localStorage.setItem('adminToken', res.data.token);
    setAdmin(res.data.admin);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
