// src/app/utils/admin/AdminAuthGuard.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useTranslation } from "react-i18next";

interface AdminAuthGuardProps {
  children: ReactNode;
  lang: string;
}

const AdminAuthGuard = ({ children, lang }: AdminAuthGuardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (user) {
        if (user.email === adminEmail) {
          setIsAuthenticated(true);
          // لا تـ push تلقائي هنا — لو محتاج إعادة توجيه لما يفتح صفحة لوجين تعاملها في الـ layout
        } else {
          // لوجين لكن مش أدمن -> Home
          setIsAuthenticated(false);
          router.replace(`/${lang}`);
        }
      } else {
        // مش مسجل -> يروح للوجين
        setIsAuthenticated(false);
        router.replace(`/${lang}/login`);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, lang]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-900 dark:text-gray-200 bg-white dark:bg-black">
        <p className="text-2xl animate-pulse">{t("auth.checking")}</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AdminAuthGuard;
