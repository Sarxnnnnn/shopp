import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({ visible: false, message: "", type: "success" });

  const showPopup = (message, type = "success") => {
    setPopup({ visible: true, message, type });
    setTimeout(() => {
      setPopup({ visible: false, message: "", type: "success" });
    }, 3000);
  };

  return (
    <PopupContext.Provider value={{ popup, showPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
