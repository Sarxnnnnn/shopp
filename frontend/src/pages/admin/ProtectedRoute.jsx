// src/pages/admin/ProtectedAdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import axios from 'axios';

const ProtectedAdminRoute = ({ children }) => {
  const { admin, setAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (admin && admin.token) {
        try {
          const response = await axios.get('/api/check-admin', {
            headers: { Authorization: `Bearer ${admin.token}` }
          });

          if (response.data.isAdmin) {
            setAdmin({ ...admin, role: 'admin' });
          } else {
            setAdmin(null);  // ถ้าผู้ใช้ไม่ใช่ admin ให้ลบข้อมูล admin
          }
        } catch (error) {
          console.error("Error checking admin status", error);
          setAdmin(null); // หากเกิดข้อผิดพลาดจะต้องรีเซ็ต admin
        }
      } else {
        setAdmin(null);  // ถ้าไม่มี admin หรือ token
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [admin, setAdmin]);

  if (loading) {
    return <div>Loading...</div>;  // ระหว่างที่กำลังโหลดข้อมูลจาก API
  }

  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
