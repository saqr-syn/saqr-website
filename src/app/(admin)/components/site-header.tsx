"use client";

import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import i18n from "@/i18n/i18n";
import { usePathname, useRouter } from "next/navigation";
import { Language } from "@/i18n/settings";
import { useCallback, useMemo } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SiteHeaderProps {
  title?: string; // <-- العنوان متغير
}

export default function SiteHeader({ title }: SiteHeaderProps) {
  const router = useRouter();
  const currentLang = i18n.language as Language || "en";
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themes = useMemo(
    () => ({
      light: { bg: "bg-white/95", text: "text-gray-900", shadow: "shadow-lg", hoverLink: "text-purple-500", langActive: "bg-purple-500 text-white", langInactive: "text-gray-600 hover:text-purple-500 hover:bg-gray-100", toggleBorder: "border-gray-400/30 hover:border-purple-500", mobileButton: "text-gray-800 hover:bg-gray-300", logoColor: "text-black" },
      dark: { bg: "bg-black/90", text: "text-gray-200", shadow: "shadow-2xl", hoverLink: "text-sky-300", langActive: "bg-sky-400 text-black", langInactive: "text-gray-400 hover:text-sky-300 hover:bg-gray-800", toggleBorder: "border-gray-400/30 hover:border-sky-300", mobileButton: "text-gray-200 hover:bg-gray-800", logoColor: "text-white" },
    }),
    []
  );
  const themeStyles = theme === "dark" ? themes.dark : themes.light;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const changeLanguage = useCallback(
    (newLang: Language) => {
      if (newLang === currentLang) return;
      const segments = pathname.split("/").filter(Boolean);
      const hasLang = segments[0] === "ar" || segments[0] === "en";
      const newPath = hasLang
        ? `/${newLang}${segments.slice(1).length > 0 ? "/" + segments.slice(1).join("/") : ""}`
        : `/${newLang}${pathname}`;

      i18n.changeLanguage(newLang);
      router.push(newPath);
    },
    [currentLang, pathname, i18n, router]
  );

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{t(`title.${title}`)}</h1>
        <div className="ml-auto flex items-center gap-2">
          <motion.button onClick={() => changeLanguage(currentLang === "ar" ? "en" : "ar")} className={`px-4 py-1 rounded-full text-sm md:text-base font-semibold ${currentLang === "ar" ? themeStyles.langInactive : themeStyles.langActive}`} whileHover={{ scale: 1.05 }}> {currentLang === "ar" ? "EN" : "AR"} </motion.button>
          <motion.button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`p-2 rounded-lg ${themeStyles.toggleBorder}`} whileHover={{ scale: 1.1 }}>{theme === "dark" ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />}</motion.button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex"
            onClick={handleLogout}
          >
            {t("auth.logout")}
          </Button>
        </div>
      </div>
    </header>
  );
}
