import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PopupProvider } from './contexts/PopupContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';
import { NotificationProvider } from './contexts/NotificationContext';

// Set default base URL for axios
axios.defaults.baseURL = 'http://localhost:3000';

axios.interceptors.request.use(
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AdminAuthProvider>
            <SiteSettingsProvider>
              <NotificationProvider>
                <PopupProvider>
                  <App />
                </PopupProvider>
              </NotificationProvider>
            </SiteSettingsProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);