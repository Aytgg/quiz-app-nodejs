import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState({
    token: null as string | null,
    username: null as string | null,
    userId: null as number | null,
    isLoggedIn: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      setAuth({
        token,
        username,
        userId: decoded.sub,
        isLoggedIn: true,
      });
    } catch {
      setAuth({ token: null, username: null, userId: null, isLoggedIn: false });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuth({ token: null, username: null, userId: null, isLoggedIn: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}