// src/pages/admin/ProtectedAdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import axios from 'axios';

// คอมโพเนนต์ป้องกันการเข้าถึงหน้าแอดมิน
const ProtectedAdminRoute = ({ children }) => {
  const { admin, loading: authLoading } = useAdminAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ตรวจสอบสถานะแอดมินเมื่อเข้าหน้า
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!admin?.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/admin/check-admin', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });

        setIsAuthenticated(response.data.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [admin?.token, authLoading]);

  // แสดงผลตามสถานะการยืนยันตัวตน
  if (!admin?.token || (!isAuthenticated && !loading)) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || admin?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
