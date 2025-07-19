"use client";

import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";

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
        url: window.location.href,
      });

      // Check Supabase session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log("🔍 NO SUPABASE SESSION:", { sessionError });
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      const response = await authApi.checkSession();

      console.log("🔍 FRONTEND SESSION RESPONSE:", {
        timestamp: new Date().toISOString(),
        response: response,
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
        timestamp: new Date().toISOString(),
      });

      // If session check fails, sign out from Supabase
      await supabase.auth.signOut();
      
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
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔍 AUTH STATE CHANGE:', { event, session: !!session });
        
        if (event === 'SIGNED_OUT' || !session) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          checkSession();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...authState,
    logout,
    refreshSession,
  };
}
