import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export function useAdminGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { isAuthenticated, user } = await authApi.checkSession();

        if (!isAuthenticated) {
          toast.error("Login dengan akun admin terlebih dahulu", {
            description: "Anda akan diarahkan ke halaman utama",
            duration: 4000,
          });
          router.replace("/");
        } else if (user?.role !== "admin") {
          toast.error("Akses ditolak", {
            description: "Hanya admin yang dapat mengakses halaman ini",
            duration: 4000,
          });
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        toast.error("Error autentikasi", {
          description: "Silakan coba login kembali",
          duration: 4000,
        });
        router.replace("/");
      }
    };

    checkAdminAccess();
  }, [router]);
}
