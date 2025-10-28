import React, { createContext, useContext, useState, useEffect } from "react";
import { useLogin, useVerifyToken } from "../hooks/AuthHooks";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loginMutate = useLogin();
  const token = localStorage.getItem("adminToken") || "";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { isLoading, isSuccess: isVerified } = useVerifyToken();
  console.log("Token verification status:", { isLoading, isVerified, token });
  useEffect(() => {
    setIsAuthenticated(isVerified);
  }, [isVerified]);

  const login = async (password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      loginMutate.mutate(password, {
        onSuccess: (data) => {
          localStorage.setItem("adminToken", data.token);
          setIsAuthenticated(true);
          resolve(true);
        },
        onError: () => {
          setIsAuthenticated(false);
          resolve(false);
        },
      });
    });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
