"use client";

import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";

export interface SessionUser {
  id: number;
  nama: string;
  email: string;
  role: "admin" | "manager";
  status: string;
}

export interface SessionAuthState {
  isAuthenticated: boolean;
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
}

export function useSessionAuth() {
  const [authState, setAuthState] = useState<SessionAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  const checkSession = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      console.log("🔍 FRONTEND SESSION CHECK:", {
        timestamp: new Date().toISOString(),
        documentCookie: document.cookie,
        userAgent: navigator.userAgent,
        url: window.location.href,
      });

      const response = await authApi.checkSession();

      console.log("🔍 FRONTEND SESSION RESPONSE:", {
        timestamp: new Date().toISOString(),
        response: response,
        documentCookie: document.cookie,
        authenticated: response.isAuthenticated,
      });

      setAuthState({
        isAuthenticated: response.isAuthenticated,
        user: response.user
          ? ({
              ...response.user,
              role: response.user.role as "admin" | "manager",
            } as SessionUser)
          : null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("🚨 FRONTEND SESSION CHECK FAILED:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        documentCookie: document.cookie,
        timestamp: new Date().toISOString(),
      });

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || "Session check failed",
      });
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Logout failed:", error);

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  };

  const refreshSession = () => {
    checkSession();
  };

  useEffect(() => {
    checkSession();
  }, []);

  return {
    ...authState,
    logout,
    refreshSession,
  };
}
