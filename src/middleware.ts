import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me-please-make-it-long-enough"
);

const PROTECTED = ["/dashboard", "/projects", "/users", "/account"];
const ADMIN_ONLY = ["/users"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("wo_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const { payload } = await jwtVerify(token, secret);
    const isAdminRoute = ADMIN_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isAdminRoute && payload.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/users/:path*", "/account/:path*"],
};
