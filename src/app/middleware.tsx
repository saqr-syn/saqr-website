import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const defaultLocale = "en";
const supportedLocales = new Set(["en", "ar"]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // تجاهل الملفات الثابتة و api و _next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);

  // لو root "/"
  if (segments.length === 0) {
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  const firstSegment = segments[0];

  // admin routes
  if (firstSegment === "admin") {
    const lang = segments[1];
    if (supportedLocales.has(lang)) return NextResponse.next();
    url.pathname = `/admin/${defaultLocale}${segments.slice(1).join("/") ? "/" + segments.slice(1).join("/") : ""}`;
    return NextResponse.redirect(url);
  }

  // site routes
  if (firstSegment === "site") {
    const lang = segments[1];
    if (supportedLocales.has(lang)) return NextResponse.next();
    url.pathname = `/site/${defaultLocale}${segments.slice(1).join("/") ? "/" + segments.slice(1).join("/") : ""}`;
    return NextResponse.redirect(url);
  }

  // لو اللغة مباشرة في root (مثلاً /en أو /ar)
  if (supportedLocales.has(firstSegment)) {
    return NextResponse.next();
  }

  // أي مسار آخر غير متوقع
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

// نفّذ الـ middleware على كل المسارات ما عدا ملفات النظام
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
