"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionAuth } from "./useSessionAuth";

export function useManagerGuard() {
  const { isAuthenticated, user, isLoading } = useSessionAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login
        router.push("/login");
        return;
      }

      if (user?.role !== "manager") {
        // Logged in but not a manager, redirect based on role
        if (user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/login");
        }
        return;
      }

      if (user?.status !== "aktif") {
        // Manager but not active
        router.push("/login?error=inactive");
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  return {
    isAuthenticated,
    user,
    isLoading,
    isManager: user?.role === "manager" && user?.status === "aktif",
  };
}