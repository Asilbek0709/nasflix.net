import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value ?? "";
  const { pathname } = request.nextUrl;

  // публичные маршруты
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/movie"];
  const isPublic = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + "/")
  );

  // если нет токена и маршрут не публичный → редирект на логин
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // если есть токен и пытаются попасть на auth → редирект на /
  if (token && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};