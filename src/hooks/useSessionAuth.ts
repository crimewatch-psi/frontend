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
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.checkSession();
      
      setAuthState({
        isAuthenticated: response.isAuthenticated,
        user: response.user || null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Session check failed:", error);
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
      // Even if logout fails, clear local state
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