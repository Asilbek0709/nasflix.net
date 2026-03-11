import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies?.get("access_token")?.value || null;
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/movie/");

  try {
    if (!token && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    if (token && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.next(); // предотвращаем падение сборки
  }
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"],
};