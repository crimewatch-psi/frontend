import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

// Define user roles
export enum UserRole {
  PEMERINTAH = "pemerintah",
  POLRI = "polri",
  MANAJER_WISATA = "manajer_wisata",
  REGULAR_USER = "regular_user",
}

// Define route permissions for each role
const rolePermissions = {
  [UserRole.PEMERINTAH]: [
    "/",
    "/dashboard",
    "/input-data",
    "/crime-data",
    "/profile",
  ],
  [UserRole.POLRI]: [
    "/",
    "/dashboard",
    "/input-data",
    "/crime-data",
    "/profile",
  ],
  [UserRole.MANAJER_WISATA]: [
    "/",
    "/dashboard",
    "/predictions",
    "/recommendations",
    "/analytics",
    "/reports",
    "/profile",
  ],
  [UserRole.REGULAR_USER]: ["/"],
};

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
];

// Extract user info from JWT token
function getUserFromToken(
  token: string
): { role: UserRole; userId: string } | null {
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = verify(token, secret) as any;
    return {
      role: decoded.role,
      userId: decoded.userId,
    };
  } catch (error) {
    return null;
  }
}

// Check if user has permission to access route
function hasPermission(userRole: UserRole, pathname: string): boolean {
  const allowedRoutes = rolePermissions[userRole];

  // Check exact match first
  if (allowedRoutes.includes(pathname)) {
    return true;
  }

  // Check if it's a dynamic route or subdirectory
  return allowedRoutes.some((route) => {
    if (route.endsWith("/*")) {
      return pathname.startsWith(route.slice(0, -2));
    }
    return pathname.startsWith(route + "/");
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Get token from cookies or Authorization header
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  // Redirect to login if no token
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token and get user info
  const user = getUserFromToken(token);
  if (!user) {
    // Invalid token, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("auth-token");
    return response;
  }

  // Check permissions
  if (!hasPermission(user.role, pathname)) {
    // Unauthorized access
    if (user.role === UserRole.REGULAR_USER) {
      // Regular users can only access landing page
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      // Other roles get redirected to their dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Add user info to request headers for use in pages
  const response = NextResponse.next();
  response.headers.set("x-user-role", user.role);
  response.headers.set("x-user-id", user.userId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
