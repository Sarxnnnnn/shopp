import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from './contexts/NotificationContext';
import ToastNotification from "./components/ToastNotification";

const App = () => {
  return (
    <NotificationProvider>
      <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <AppRoutes />
              <ToastNotification />
            </CartProvider>
          </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
};

export default App;
