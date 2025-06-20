"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "regular_user",
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Set auth cookie
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;

        // Redirect based on role
        if (credentials.role === "regular_user") {
          router.push("/");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">CrimeWatch Login</h1>
          <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={credentials.role}
              onChange={(e) =>
                setCredentials({ ...credentials, role: e.target.value })
              }
            >
              <option value="regular_user">Regular User</option>
              <option value="pemerintah">Pemerintah</option>
              <option value="polri">Polri</option>
              <option value="manajer_wisata">Manajer Wisata</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? "Masuk..." : "Masuk"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-500">
                Daftar di sini
              </a>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-2">
            <p>
              <strong>Demo Accounts:</strong>
            </p>
            <p>• Pemerintah: gov@example.com / password123</p>
            <p>• Polri: police@example.com / password123</p>
            <p>• Manajer Wisata: tourism@example.com / password123</p>
            <p>• Regular User: user@example.com / password123</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
