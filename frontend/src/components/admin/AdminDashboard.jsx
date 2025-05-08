import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Error fetching dashboard data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {dashboardData ? (
        <div>
          {/* Render dashboard data here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminDashboard;