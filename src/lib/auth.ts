import { headers } from "next/headers";
import { UserRole } from "../../middleware";

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
 * Check if user can input crime data (Pemerintah or Polri)
 */
export function canInputCrimeData(user: User | null): boolean {
  return hasAnyRole(user, [UserRole.PEMERINTAH, UserRole.POLRI]);
}

/**
 * Check if user can access predictions/analytics (Manajer Wisata)
 */
export function canAccessPredictions(user: User | null): boolean {
  return hasRole(user, UserRole.MANAJER_WISATA);
}

/**
 * Check if user is regular user (only landing page access)
 */
export function isRegularUser(user: User | null): boolean {
  return hasRole(user, UserRole.REGULAR_USER);
}

/**
 * Get user's dashboard URL based on role
 */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case UserRole.REGULAR_USER:
      return "/";
    case UserRole.PEMERINTAH:
    case UserRole.POLRI:
      return "/dashboard";
    case UserRole.MANAJER_WISATA:
      return "/dashboard";
    default:
      return "/";
  }
}

/**
 * Get allowed routes for user role
 */
export function getAllowedRoutes(role: UserRole): string[] {
  switch (role) {
    case UserRole.PEMERINTAH:
    case UserRole.POLRI:
      return ["/", "/dashboard", "/input-data", "/crime-data", "/profile"];
    case UserRole.MANAJER_WISATA:
      return [
        "/",
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
