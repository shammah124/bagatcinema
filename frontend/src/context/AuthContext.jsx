// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("bagatcinemaUser");
    setIsLoggedIn(!!user);
  }, []);

  const login = (email) => {
    localStorage.setItem("bagatcinemaUser", email);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(null);
    localStorage.removeItem("bagatcinemaUserInfo");
    localStorage.removeItem("bagatcinema_token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
