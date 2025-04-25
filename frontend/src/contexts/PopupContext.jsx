// src/contexts/PopupContext.jsx
import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({ visible: false, message: "", type: "success" });
  const timeoutRef = useRef(null);

  const showPopup = (message, type = "success") => {
    setPopup({ visible: true, message, type });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setPopup({ visible: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <PopupContext.Provider value={{ popup, showPopup }}>
      {children}

      {popup.visible && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2 rounded shadow-lg transition-all duration-300 ${
            popup.type === "error"
              ? "bg-red-600 text-white"
              : popup.type === "warning"
              ? "bg-yellow-500 text-black"
              : "bg-green-600 text-white"
          }`}
        >
          {popup.message}
        </div>
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
