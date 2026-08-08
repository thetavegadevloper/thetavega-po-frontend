import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem("po_access_token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("po_user")) || null;
    } catch {
      return null;
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem("po_access_token");
    localStorage.removeItem("po_user");
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const login = useCallback(async (credentials) => {
    const result = await authApi.login(credentials);
    localStorage.setItem("po_access_token", result.token);
    localStorage.setItem("po_user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const refreshMe = useCallback(async () => {
    if (!localStorage.getItem("po_access_token")) return null;
    const result = await authApi.me();
    const current = result.user;
    localStorage.setItem("po_user", JSON.stringify(current));
    setUser(current);
    return current;
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("po-auth-expired", handler);
    return () => window.removeEventListener("po-auth-expired", handler);
  }, [logout]);

  const permissions = useMemo(
    () => user?.role?.permissions || user?.permissions || [],
    [user]
  );

  const can = useCallback(
    (...required) =>
      permissions.includes("*") || required.some((p) => permissions.includes(p)),
    [permissions]
  );

  const value = useMemo(
    () => ({ token, user, permissions, isAuthenticated: Boolean(token), login, logout, can, refreshMe }),
    [token, user, permissions, login, logout, can, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
