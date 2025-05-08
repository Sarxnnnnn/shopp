import React, { useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { BalanceProvider } from "./contexts/BalanceContext";
import ToastNotification from "./components/ToastNotification";
import ErrorBoundary from "./components/ErrorBoundary";
import LineButton from './components/LineButton';
import { useSiteSettings } from "./contexts/SiteSettingsContext";

const App = () => {
  const { settings, updateSettings } = useSiteSettings();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/site-settings`);
        if (response.data.success && response.data.data) {
          updateSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []); // Remove updateSettings from dependency array

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <BalanceProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
              <Navbar />
              <AppRoutes />
              <ToastNotification />
              <LineButton />
            </div>
          </BalanceProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;