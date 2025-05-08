const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  admin: {
    dashboard: `${API_BASE_URL}/api/admin/dashboard`,
    products: `${API_BASE_URL}/api/admin/products`,
    overview: `${API_BASE_URL}/api/admin/overview`,
    checkAdmin: `${API_BASE_URL}/api/admin/check-admin`
  }
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
