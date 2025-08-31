// src/app/(admin)/[lang]/layout.tsx
"use client";

import "./globals.css";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { use } from "react";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import AdminAuthGuard from "@/utils/admin/AdminAuthGuard";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import SiteHeader from "../components/site-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // نفك الـ params بأمان
  const { lang } = use(params) || { lang: "en" };

  // تعريف الصفحات
  const isLoginPage = pathname.includes(`/${lang}/login`);
  const isDashboardPage = pathname === `/${lang}/dashboard`;

  const [checking, setChecking] = useState(isLoginPage);

  // --- استخراج اسم الصفحة ---
  const parts = pathname.split("/");
  let pageName = parts[parts.length - 1] || "Dashboard";
  if (pageName === "dashboard") pageName = "Dashboard";

  // Capitalize أول حرف
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  useEffect(() => {
    if (!isLoginPage) return;

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (!user) {
        setChecking(false);
        return;
      }

      if (user.email === adminEmail) {
        router.replace(`/${lang}/dashboard`);
      } else {
        router.replace(`/${lang}`);
      }
    });

    return () => unsubscribe();
  }, [isLoginPage, lang, router]);

  if (checking) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex items-center justify-center min-h-screen">
          <p className="animate-pulse text-lg dark:text-gray-200">Checking...</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isLoginPage ? (
        <>{children}</>
      ) : (
        <AdminAuthGuard lang={lang}>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <AppSidebar variant="inset" collapsible="icon" />
            <SidebarInset>
              <SiteHeader title={title} />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </AdminAuthGuard>
      )}
    </ThemeProvider>
  );
}
