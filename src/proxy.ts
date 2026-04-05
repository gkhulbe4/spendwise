import { NextRequest, NextResponse } from "next/server";
import { decrypt, updateSession } from "@/lib/auth";

// Exclude these paths from strict session checking
// (allow access if not logged in)
const publicRoutes = ["/landing", "/auth", "/api/auth/login", "/api/auth/register", "/api/invites", "/api/auth/invite/claim"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Public routes and static assets bypass protection
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route)) || path.startsWith("/invite/");
  const isApiRoute = path.startsWith("/api/");
  const isAsset = path.includes(".") || path.includes("/_next");

  if (isAsset) return NextResponse.next();

  const sessionCookie = req.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  // Not logged in and requesting a protected route
  if (!session && !isPublicRoute) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  // Logged in but requesting auth/landing pages -> redirect to dashboard
  if (session && (path === "/landing" || path === "/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Update session expiration organically
  if (session) {
    const res = await updateSession(req);
    if (res) return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
