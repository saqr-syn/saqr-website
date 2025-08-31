"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "next-themes";
import { throttle } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Language } from "@/i18n/settings";
import UserAuth from "@/utils/users/UserAuth";

interface NavbarProps {
  lang: Language;
}

interface MenuLink {
  name: string;
  href: string;
}

const Navbar = ({ lang }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const currentLang = i18n.language || lang;

  if (pathname.startsWith(`/${lang}/admin`)) return null;

  useEffect(() => {
    setMounted(true);

    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 10);

      const sections = ["#about", "#projects", "#contact"];
      let current = "home";
      for (const sec of sections) {
        const el = document.getElementById(sec.replace("#", ""));
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            current = sec.replace("#", "");
            break;
          }
        }
      }
      setActiveSection(current);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

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

  const menuLinks: MenuLink[] = useMemo(
    () => [
      { name: t("navbar.home"), href: `#home` },
      { name: t("navbar.about"), href: `#about` },
      { name: t("navbar.projects"), href: `#projects` },
      { name: t("navbar.contact"), href: `#contact` },
    ],
    [t]
  );

  const themes = useMemo(
    () => ({
      light: { bg: "bg-white/95", text: "text-gray-900", shadow: "shadow-lg", hoverLink: "text-purple-500", langActive: "bg-purple-500 text-white", langInactive: "text-gray-600 hover:text-purple-500 hover:bg-gray-100", toggleBorder: "border-gray-400/30 hover:border-purple-500", mobileButton: "text-gray-800 hover:bg-gray-300", logoColor: "text-black" },
      dark: { bg: "bg-black/90", text: "text-gray-200", shadow: "shadow-2xl", hoverLink: "text-sky-300", langActive: "bg-sky-400 text-black", langInactive: "text-gray-400 hover:text-sky-300 hover:bg-gray-800", toggleBorder: "border-gray-400/30 hover:border-sky-300", mobileButton: "text-gray-200 hover:bg-gray-800", logoColor: "text-white" },
    }),
    []
  );

  const themeStyles = theme === "dark" ? themes.dark : themes.light;

  if (!mounted) return null;

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${themeStyles.bg} ${scrolled ? themeStyles.shadow : ""}`} style={{ backdropFilter: "blur(5px)" }}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 md:px-12 py-3 sm:py-4">
        <Link href={`/${lang}`} className={`flex items-center space-x-1 cursor-pointer select-none hover:scale-105 transition-transform duration-300`}>
          <span className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${themeStyles.text}`}>SAQR</span>
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-sky-300">-SYN</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 font-medium text-base lg:text-lg">
          {menuLinks.map((link, i) => (
            <Link key={i} href={link.href} className="relative group cursor-pointer text-center">
              <motion.span className={`transition-colors duration-300 ${activeSection === link.href.replace("#", "") ? themeStyles.hoverLink : themeStyles.text}`} whileHover={{ scale: 1.1 }}>{link.name}</motion.span>
            </Link>
          ))}
          <div className="flex items-center space-x-3 lg:space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <UserAuth />
            <motion.button onClick={() => changeLanguage(currentLang === "ar" ? "en" : "ar")} className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold ${currentLang === "ar" ? themeStyles.langInactive : themeStyles.langActive}`} whileHover={{ scale: 1.05 }}> {currentLang === "ar" ? "EN" : "AR"} </motion.button>
            <motion.button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`p-2 rounded-lg ${themeStyles.toggleBorder}`} whileHover={{ scale: 1.1 }}>{theme === "dark" ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />}</motion.button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center space-x-2">
          <motion.button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-lg ${themeStyles.mobileButton}`} whileHover={{ scale: 1.1 }}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden bg-white dark:bg-black w-full absolute top-full left-0 shadow-lg z-50`}
          >
            <div className="flex flex-col items-center py-4 space-y-4">
              {menuLinks.map((link, i) => (
                <Link key={i} href={link.href} className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center space-x-2 pt-2">
                <UserAuth />
                <motion.button onClick={() => changeLanguage(currentLang === "ar" ? "en" : "ar")} className={`px-4 py-2 rounded-full font-semibold ${currentLang === "ar" ? themeStyles.langInactive : themeStyles.langActive}`} whileHover={{ scale: 1.05 }}>
                  {currentLang === "ar" ? "EN" : "AR"}
                </motion.button>
                <motion.button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`p-2 rounded-lg ${themeStyles.toggleBorder}`} whileHover={{ scale: 1.1 }}>
                  {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
