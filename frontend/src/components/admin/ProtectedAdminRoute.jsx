import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import axios from 'axios';

const ProtectedAdminRoute = ({ children }) => {
  const { admin, setAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!admin?.token) {
        localStorage.removeItem('adminToken'); 
        setLoading(false);
        navigate('/admin/login');
        return;
      }

      try {
        const response = await axios.get('/api/admin/check-admin', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });

        if (response.data.success) {
          setAdmin({ ...admin, role: 'admin' });
        } else {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admin status:', error.response?.data || error.message);
        localStorage.removeItem('adminToken'); 
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [admin, setAdmin, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;