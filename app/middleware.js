// middleware.js
import { NextResponse } from "next/server";

const defaultLocale = "en"; // اللغة الافتراضية
const supportedLocales = new Set(["en", "ar"]); // اللغات المدعومة

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 1) تجاهل بعض المسارات التي لا نريد أن يعالجها الـ middleware
  // - ملفات داخل _next أو api أو assets
  // - ملفات لها امتداد (ملفات ستاتيك مثل .png, .css, .js، إلخ)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    /\.[^/]+$/.test(pathname) // أي مسار يحتوي امتداد ملف
  ) {
    return NextResponse.next();
  }

  // 2) إذا كان المقبس يحتوي بالفعل على بادئة لغة مدعومة، لا نغير شيء
  const firstSegment = pathname.split("/").filter(Boolean)[0]; // أول قطعة بعد '/'
  if (supportedLocales.has(firstSegment)) {
    return NextResponse.next();
  }

  // 3) اعادة التوجيه للبادئة الافتراضية مع المحافظة على query و hash
  // مثال: "/" -> "/en"
  //         "/projects" -> "/en/projects"
  url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

// Matcher: نفّذ الـ middleware على كل المسارات (باستثناء ما استبعدناه بالأعلى)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
