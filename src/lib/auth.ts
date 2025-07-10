import { headers } from "next/headers";

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager", // Updated to match database
  POLRI = "polri",
  REGULAR_USER = "regular_user",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
}

/**
 * Get current user from request headers (set by middleware)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const headersList = await headers();
    const userRole = headersList.get("x-user-role") as UserRole;
    const userId = headersList.get("x-user-id");

    if (!userRole || !userId) {
      return null;
    }

    return {
      id: userId,
      role: userRole,
      email: "",
      name: "",
      organization: "",
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if user has specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false;
}

/**
 * Check if user can input crime data (Polri)
 */
export function canInputCrimeData(user: User | null): boolean {
  return hasRole(user, UserRole.POLRI);
}

/**
 * Check if user can access predictions/analytics (Manager)
 */
export function canAccessPredictions(user: User | null): boolean {
  return hasRole(user, UserRole.MANAGER);
}

/**
 * Check if user is regular user (only landing page access)
 */
export function isRegularUser(user: User | null): boolean {
  return hasRole(user, UserRole.REGULAR_USER);
}

/**
 * Check if user is admin (full system access)
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, UserRole.ADMIN);
}

/**
 * Get user's dashboard URL based on role
 */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin";
    case UserRole.REGULAR_USER:
      return "/";
    case UserRole.POLRI:
      return "/dashboard";
    case UserRole.MANAGER:
      return "/manajer-wisata/analytics";
    default:
      return "/";
  }
}

/**
 * Get allowed routes for user role
 */
export function getAllowedRoutes(role: UserRole): string[] {
  switch (role) {
    case UserRole.ADMIN:
      return [
        "/",
        "/admin",
        "/admin/users",
        "/admin/dashboard",
        "/dashboard",
        "/profile",
      ];
    case UserRole.POLRI:
      return ["/", "/dashboard", "/input-data", "/crime-data", "/profile"];
    case UserRole.MANAGER:
      return [
        "/",
        "/manajer-wisata/analytics",
        "/dashboard",
        "/predictions",
        "/recommendations",
        "/analytics",
        "/reports",
        "/profile",
      ];
    case UserRole.REGULAR_USER:
      return ["/"];
    default:
      return ["/"];
  }
}
