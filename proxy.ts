import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET || "gelistirme-icin-gecici-bir-anahtar" 
  });

  const pathname = req.nextUrl.pathname;

  // Ziyaretçi korumalı alanları
  const isVisitorDashboard = pathname.startsWith("/dashboard");
  // Şirket korumalı alanları
  const isCompanyProtected = pathname.startsWith("/company/dashboard") || pathname.startsWith("/company/quiz");
  // Giriş sayfaları
  const isAuthPage = pathname.startsWith("/auth");
  const isCompanyAuthPage = pathname.startsWith("/company/login") || pathname.startsWith("/company/auth");
  // Ana sayfa
  const isHomePage = pathname === "/";

  // 1. Korumalı sayfalara giriş yapmamış kullanıcı erişmeye çalışıyorsa
  if (!token) {
    if (isVisitorDashboard) return NextResponse.redirect(new URL("/auth", req.url));
    if (isCompanyProtected) return NextResponse.redirect(new URL("/company/login", req.url));
  }

  // 2. Giriş yapmış kullanıcı auth sayfalarına veya ana sayfaya gitmeye çalışıyorsa
  if (token) {
    if (isAuthPage) return NextResponse.redirect(new URL("/dashboard", req.url));
    if (isCompanyAuthPage) return NextResponse.redirect(new URL("/company/dashboard", req.url));
    // Eğer giriş yapmış kullanıcı ana sayfaya giderse, dashboard'a yönlendir
    if (isHomePage) {
      // Rolüne göre yönlendir
      const role = token.role as string;
      if (role === "COMPANY") return NextResponse.redirect(new URL("/company/dashboard", req.url));
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};