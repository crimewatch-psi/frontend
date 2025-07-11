import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionAuth } from "./useSessionAuth";
import { toast } from "sonner";

export function useAdminGuard() {
  const { isAuthenticated, user, isLoading } = useSessionAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Login dengan akun admin terlebih dahulu", {
          description: "Anda akan diarahkan ke halaman login",
          duration: 4000,
        });
        router.replace("/login");
        return;
      }

      if (user?.role !== "admin") {
        toast.error("Akses ditolak", {
          description: "Hanya admin yang dapat mengakses halaman ini",
          duration: 4000,
        });
        
        // Redirect based on user role
        if (user?.role === "manager") {
          router.replace("/manajer-wisata/analytics");
        } else {
          router.replace("/");
        }
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  return {
    isAuthenticated,
    user,
    isLoading,
    isAdmin: user?.role === "admin",
  };
}
