"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ChartBar,
  Filter,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSessionAuth } from "@/hooks/useSessionAuth";

interface HeaderProps {
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  showSidebarToggle?: boolean;
}

export function Header({
  sidebarOpen,
  onSidebarToggle,
  showSidebarToggle = false,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, isLoading, logout } = useSessionAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/");
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "pemerintah":
        return { label: "Pemerintah", variant: "default" as const };
      case "polri":
        return { label: "Polri", variant: "destructive" as const };
      case "manajer_wisata":
        return { label: "Manajer Wisata", variant: "secondary" as const };
      case "manager":
        return { label: "Manager", variant: "secondary" as const };
      case "admin":
        return { label: "Admin", variant: "default" as const };
      default:
        return { label: "User", variant: "outline" as const };
    }
  };

  const navLinks = [
    { href: "#problem-statement", label: "Tentang" },
    { href: "#footer", label: "Kontak" },
  ];

  if (isLoading) {
    return (
      <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center h-16">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.svg"
                alt="CrimeWatch"
                width={48}
                height={48}
                className="w-18 h-18"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b shadow-sm border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {isAuthenticated && user ? (
            // Logged in state: Logo, optional sidebar toggle, and user dropdown
            <>
              {/* Logo - left side */}
              <Link
                href="/"
                className="flex items-start space-x-3 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/logo.svg"
                  alt="CrimeWatch"
                  width={48}
                  height={48}
                  className="w-18 h-18"
                />
              </Link>

              <div className="flex items-center ml-auto space-x-3">
                {/* Sidebar toggle button - only shown when enabled */}
                {showSidebarToggle && onSidebarToggle && (
                  <Button
                    onClick={onSidebarToggle}
                    variant={sidebarOpen ? "secondary" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {sidebarOpen ? (
                      <>
                        <X className="w-4 h-4" />
                        Hide Filters
                      </>
                    ) : (
                      <>
                        <Filter className="w-4 h-4" />
                        Show Filters
                      </>
                    )}
                  </Button>
                )}

                {/* User dropdown - right side for desktop */}
                <div className="hidden md:flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 h-auto p-2"
                      >
                        <div className="text-right flex flex-col items-end space-y-1">
                          <p className="text-sm font-medium text-black">
                            {user.nama}
                          </p>
                          <Badge
                            // variant={getRoleDisplay(user.role).variant}
                            className="text-xs"
                            variant="outline"
                          >
                            {getRoleDisplay(user.role).label}
                          </Badge>
                        </div>
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>

                      <div className="px-2 py-1.5 text-sm text-gray-600">
                        {user.email}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={
                            user.role === "admin"
                              ? "/admin"
                              : "/manajer-wisata/analytics"
                          }
                        >
                          <ChartBar className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Keluar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile menu button */}
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
            </>
          ) : (
            // Not logged in state: Original layout
            <>
              {/* Left - Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1 flex-1">
                {navLinks.map((link) => {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-black`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.querySelector(link.href);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <span>{link.label}</span>
                    </a>
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

              <div className="flex items-center space-x-3 flex-1 justify-end">
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    <Link href="/login">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Masuk
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Link href="mailto:crimewatch0100@gmail.com?subject=Permintaan%20Akun%20CrimeWatch&body=Halo%2C%20admin%20Crimewatch.%20Saya%20ingin%20membuat%20akun%20Crimewatch%20dengan%20format%3A%0A%0ANama%20pemilik%3A%20%0ANama%20organisasi%2Fbisnis%3A%20%0ALink%20Gmaps%3A%20%0A%0ATerima%20kasih">
                      Ajukan Akun
                    </Link>
                  </Button>
                </div>

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
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            {isAuthenticated && user ? (
              // Logged in mobile menu: Just user info and logout
              <div className="space-y-3 mt-4">
                <div className="px-4">
                  <p className="text-sm font-medium text-black">{user.nama}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                  <Badge
                    variant={getRoleDisplay(user.role).variant}
                    className="text-xs mt-1"
                  >
                    {getRoleDisplay(user.role).label}
                  </Badge>
                </div>
                {/* Mobile menu dashboard link */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full mx-4 border-gray-300"
                >
                  <Link
                    href={
                      user.role === "admin"
                        ? "/admin"
                        : "/manajer-wisata/analytics"
                    }
                  >
                    <ChartBar className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
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
              // Not logged in mobile menu: Original content
              <>
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
                  <div className="space-y-2 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full border-gray-300"
                    >
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <UserIcon className="w-4 h-4 mr-2" />
                        Masuk
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="w-full bg-black hover:bg-gray-800 text-white"
                    >
                      <Link
                        href="mailto:crimewatch0100@gmail.com?subject=Permintaan%20Akun%20CrimeWatch&body=Halo%2C%20admin%20Crimewatch.%20Saya%20ingin%20membuat%20akun%20Crimewatch%20dengan%20format%3A%0A%0ANama%20pemilik%3A%20%0ANama%20organisasi%2Fbisnis%3A%20%0ALink%20Gmaps%3A%20%0A%0ATerima%20kasih"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Ajukan Akun
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
