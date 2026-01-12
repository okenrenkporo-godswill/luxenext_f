import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];
const LOGIN_PATH = "/login";

// Dashboard mapping
const DASHBOARD_ROUTES: Record<string, string> = {
  superadmin: "/admin/dashboard",
  admin: "/admin/dashboard",
  user: "/user/dashboard",
};

// Routes that require verified accounts
const VERIFIED_ONLY = ["/user/checkout", "/user/settings"];

// Decode JWT without verifying
function decodeJwt(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    // Use atob for Edge Runtime compatibility
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("Token")?.value;
  const pathname = req.nextUrl.pathname.toLowerCase();
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isProtected = pathname.startsWith("/user") || pathname.startsWith("/admin");

  const decoded = token ? decodeJwt(token) : null;

  // 1️⃣ No token on protected route → redirect to login
  if (isProtected && !decoded) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2️⃣ Redirect logged-in users away from public pages or root
  if (decoded && (isPublic || pathname === "/")) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = DASHBOARD_ROUTES[decoded.role] || "/user/dashboard";
    // Avoid infinite loop if dashboard is accidentally marked as public (shouldn't happen here)
    if (pathname !== dashboardUrl.pathname) {
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 3️⃣ Role-based access
  if (decoded && isProtected) {
    if (pathname.startsWith("/admin") && !["admin", "superadmin"].includes(decoded.role)) {
      const url = req.nextUrl.clone();
      url.pathname = DASHBOARD_ROUTES[decoded.role] || "/user/dashboard";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/user") && decoded.role !== "user") {
      const url = req.nextUrl.clone();
      url.pathname = DASHBOARD_ROUTES[decoded.role] || "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // 4️⃣ Verification check for restricted routes
  if (decoded && !decoded.is_verified && VERIFIED_ONLY.some((r) => pathname.startsWith(r))) {
    const dashUrl = req.nextUrl.clone();
    dashUrl.pathname = DASHBOARD_ROUTES[decoded.role] || "/user/dashboard";
    dashUrl.searchParams.set("verify", "true");
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/user/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/auth/verify",
    "/auth/check-email",
  ],
};
