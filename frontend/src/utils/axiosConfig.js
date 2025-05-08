import axios from 'axios';

// ใช้ URL จาก env หรือ localhost ถ้าไม่มี
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
