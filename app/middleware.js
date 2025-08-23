// middleware.js
import { NextResponse } from 'next/server';

const defaultLocale = 'en'; // اللغة الافتراضية
const supportedLocales = ['en', 'ar']; // اللغات المدعومة

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the URL already has a supported language prefix
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // If the URL doesn't have a language prefix, redirect to the default language (English)
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  // Matcher: This regex ensures the middleware runs on all paths except:
  // - API routes (e.g., /api/...)
  // - Files with extensions (e.g., .js, .css, .png)
  // - Next.js internal paths (e.g., /_next/...)
  // - Public directory files (e.g., /en, /ar)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};