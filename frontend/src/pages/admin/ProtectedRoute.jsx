// ProtectedAdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// Route ป้องกันสำหรับแอดมิน
const ProtectedAdminRoute = ({ children }) => {
  const { admin } = useAdminAuth();
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

export default ProtectedAdminRoute;
