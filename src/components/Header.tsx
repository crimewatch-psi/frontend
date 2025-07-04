"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Menu, X, User, LogOut, MapPin } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization?: string;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    if (token) {
      try {
        const mockUser = {
          id: "1",
          email: "user@example.com",
          name: "John Doe",
          role: "regular_user",
          organization: "Test Org",
        };
        setUser(mockUser);
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    }
  };

  const handleLogout = () => {
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    router.push("/");
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "pemerintah":
        return { label: "Pemerintah", variant: "default" as const };
      case "polri":
        return { label: "Polri", variant: "destructive" as const };
      case "manajer_wisata":
        return { label: "Manajer Wisata", variant: "secondary" as const };
      default:
        return { label: "User", variant: "outline" as const };
    }
  };

  const navLinks = [
    { href: "/about", label: "Tentang" },
    { href: "/contact", label: "Kontak" },
  ];

  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left - Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    pathname === link.href
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity absolute left-1/2 transform -translate-x-1/2"
          >
            <Image
              src="/logo.svg"
              alt="CrimeWatch"
              width={48}
              height={48}
              className="w-18 h-18"
            />
          </Link>

          {/* Right - Auth Buttons */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-black">{user.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={getRoleDisplay(user.role).variant}
                      className="text-xs"
                    >
                      {getRoleDisplay(user.role).label}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <Link href="/login">
                    <User className="w-4 h-4 mr-2" />
                    Masuk
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Link href="mailto:admin@crimewatch.id?subject=Request%20Account%20Access">
                    Ajukan Akun
                  </Link>
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="md:hidden border-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 mt-4 items-center">
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                      pathname === link.href
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4">
                    <p className="text-sm font-medium text-black">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <Badge
                      variant={getRoleDisplay(user.role).variant}
                      className="text-xs mt-1"
                    >
                      {getRoleDisplay(user.role).label}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full mx-4 border-gray-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full border-gray-300"
                  >
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-4 h-4 mr-2" />
                      Masuk
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    <Link
                      href="mailto:admin@crimewatch.id?subject=Request%20Account%20Access"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Ajukan Akun
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
