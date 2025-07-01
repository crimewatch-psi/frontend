"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { authApi, handleApiError, LoginCredentials } from "@/lib/api";

function LoginForm() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "Government",
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
      const loginData: LoginCredentials = {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
      };

      const data = await authApi.login(loginData);

      if (data.success) {
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;

        switch (credentials.role) {
          case "admin":
            router.push("/admin");
            break;
          case "pemerintah":
          case "polri":
            router.push("/dashboard");
            break;
          case "manajer_wisata":
            router.push("/dashboard");
            break;
          default:
            router.push("/");
        }
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">CrimeWatch Login</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
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
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
            <Select
              value={credentials.role}
              onValueChange={(value) =>
                setCredentials({ ...credentials, role: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="pemerintah">Government</SelectItem>
                <SelectItem value="polri">Police</SelectItem>
                <SelectItem value="manajer_wisata">Tourism Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need an account?{" "}
              <a
                href="mailto:admin@crimewatch.id?subject=Request%20Account%20Access"
                className="text-black hover:text-gray-600 underline"
              >
                Request access here
              </a>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-2">
            <p>
              <strong>Demo Accounts:</strong>
            </p>
            <p>• Admin: admin@crimewatch.id / admin123</p>
            <p>• Pemerintah: gov@example.com / password123</p>
            <p>• Polri: police@example.com / password123</p>
            <p>• Manajer Wisata: tourism@example.com / password123</p>
          </div>
        </div>
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
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
