"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { authApi, handleApiError, LoginCredentials } from "@/lib/api";

function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await authApi.login(credentials);

      if (data.message === "Login berhasil") {
        const userRole = data.user.role.toLowerCase();
        switch (userRole) {
          case "admin":
            router.push("/admin");
            break;
          case "manager":
          case "polri":
            router.push("/dashboard");
            break;
          default:
            router.push(redirect);
        }
      }
    } catch (error: any) {
      if (
        error.message === "Akun tidak ditemukan" ||
        error.message === "Password salah"
      ) {
        setError("Email atau password salah");
      } else if (error.message === "Email dan password wajib diisi") {
        setError("Email dan password wajib diisi");
      } else {
        setError(handleApiError(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="relative mb-8">
          <Link href="/" className="absolute left-0 top-4">
            <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Masuk ke CrimeWatch
            </h1>
            <p className="text-gray-600 mt-2">Silakan masuk ke akun Anda</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              required
              placeholder="Masukkan email Anda"
              autoComplete="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Kata Sandi
            </label>
            <Input
              id="password"
              type="password"
              required
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? "Sedang Masuk..." : "Masuk"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <a
                href="mailto:admin@crimewatch.id?subject=Permintaan%20Akses%20Akun"
                className="text-black hover:text-gray-600 underline"
              >
                Ajukan akses di sini
              </a>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
