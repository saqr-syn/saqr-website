// app/components/navbar.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "next-themes";
import { throttle } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ----------------------------------------------------
// 1- Navbar Component
// ----------------------------------------------------
const Navbar = ({ lang }) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  // Hooks
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Current language from i18n
  const currentLang = i18n.language || lang;

  // ----------------------------------------------------
  // 2- Effects for Mount, Scroll and Pathname Change
  // ----------------------------------------------------
  useEffect(() => {
    // Component mounted, safe to render
    setMounted(true);

    const handleScroll = throttle(() => {
      // Toggle shadow based on scroll position
      setScrolled(window.scrollY > 10);

      // Highlight active section based on scroll
      const sections = ["/", "#about", "/projects", "#contact"];
      const currentSection = sections.find((sec) => {
        const el = document.querySelector(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Check if the section is within the viewport, with a top offset for the navbar
          return rect.top <= 80 && rect.bottom > 80;
        }
        return false;
      });
      setActiveSection(currentSection || "/home");
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change (depends on pathname only)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // ----------------------------------------------------
  // 3- Language Switching Logic
  // ----------------------------------------------------
  const changeLanguage = useCallback((newLang) => {
    // Only switch if the language is different
    if (newLang === currentLang) return;

    // Use URL segments to build the new path correctly
    const segments = pathname.split("/").filter(Boolean);
    const hasLang = segments[0] === "ar" || segments[0] === "en";
    
    // Construct the new path with the correct language segment
    const newPath = hasLang
      ? `/${newLang}${segments.slice(1).length > 0 ? "/" + segments.slice(1).join("/") : ""}`
      : `/${newLang}${pathname}`;

    // Update i18n language and navigate
    i18n.changeLanguage(newLang);
    router.push(newPath);
  }, [currentLang, pathname, i18n, router]);

  // ----------------------------------------------------
  // 4- Navigation Links
  // ----------------------------------------------------
  const menuLinks = useMemo(
    () => [
      { name: t("navbar.home"), href: `/${lang}` },
      { name: t("navbar.about"), href: `/${lang}/#about` },
      { name: t("navbar.projects"), href: `/${lang}/projects` },
      { name: t("navbar.contact"), href: `/${lang}/#contact` },
    ],
    [t, lang]
  );
  
  // ----------------------------------------------------
  // 5- Smooth Scrolling Function
  // ----------------------------------------------------
  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const targetId = href.split("#")[1];
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const offset = targetEl.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: "smooth" });
    } else {
      // If the section is not on the current page, navigate to the correct page first
      router.push(href);
    }
    setIsOpen(false);
  };
  
  // ----------------------------------------------------
  // 6- Theme and Style Configuration
  // ----------------------------------------------------
  const themes = useMemo(
    () => ({
      light: {
        bg: "bg-white/95",
        text: "text-gray-900",
        shadow: "shadow-lg",
        hoverLink: "text-purple-500",
        hoverGlow: "0px 0px 10px rgba(155, 89, 182, 0.7)",
        langActive: "bg-purple-500 text-white",
        langInactive: "text-gray-600 hover:text-purple-500 hover:bg-gray-100",
        toggleBorder: "border-gray-400/30 hover:border-purple-500",
        mobileButton: "text-gray-800 hover:bg-gray-300",
        logoColor: "text-black",
      },
      dark: {
        bg: "bg-black/90",
        text: "text-gray-200",
        shadow: "shadow-2xl",
        hoverLink: "text-sky-300",
        hoverGlow: "0px 0px 12px rgba(129, 230, 217, 0.8)",
        langActive: "bg-sky-400 text-black",
        langInactive: "text-gray-400 hover:text-sky-300 hover:bg-gray-800",
        toggleBorder: "border-gray-400/30 hover:border-sky-300",
        mobileButton: "text-gray-200 hover:bg-gray-800",
        logoColor: "text-white",
      },
    }),
    []
  );

  const themeStyles = theme === "dark" ? themes.dark : themes.light;

  // ----------------------------------------------------
  // 7- Language and Theme Button Components
  // ----------------------------------------------------
  const LanguageSwitcher = () => (
    <motion.button
      onClick={() => changeLanguage(currentLang === "ar" ? "en" : "ar")}
      className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 hover:brightness-105 ${
        currentLang === "ar" ? themeStyles.langInactive : themeStyles.langActive
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {currentLang === "ar" ? "EN" : "AR"}
    </motion.button>
  );

  const ThemeSwitcher = () => (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`p-2 rounded-lg transition-colors duration-300 ${themeStyles.toggleBorder}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
      )}
    </motion.button>
  );

  // Avoid hydration mismatch by returning null until mounted
  if (!mounted) {
    return null;
  }

  // ----------------------------------------------------
  // 8- JSX Structure
  // ----------------------------------------------------
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${themeStyles.bg} ${scrolled ? themeStyles.shadow : ""}`}
      style={{ backdropFilter: "blur(5px)" }} // Add blur effect
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 md:px-12 py-3 sm:py-4">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="flex items-center space-x-1 cursor-pointer select-none hover:scale-105 transition-transform duration-300"
        >
          <span className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${themeStyles.text}`}>
            SAQR
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-sky-300">
            -SYN
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 font-medium text-base lg:text-lg">
          {menuLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              onClick={(e) => link.href.includes('#') ? handleScrollTo(e, link.href) : null}
              className="relative group cursor-pointer"
            >
              <motion.span
                className={`transition-colors duration-300 ${
                  activeSection === link.href.split('#')[1] ? themeStyles.hoverLink : themeStyles.text
                }`}
                whileHover={{ scale: 1.1, textShadow: themeStyles.hoverGlow }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.span>
              <motion.span
                className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-purple-500 to-sky-400 origin-center"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: activeSection === link.href.split('#')[1] ? 1 : 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </Link>
          ))}
          {/* Language & Theme Switcher */}
          <div className="flex items-center space-x-3 lg:space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-md transition ${themeStyles.mobileButton}`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isOpen ? "menu" : "x"}
                initial={{ opacity: 0, rotate: isOpen ? -90 : 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: isOpen ? 90 : -90 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`md:hidden px-6 py-4 space-y-3 font-medium border-t border-gray-200 dark:border-gray-700 ${themeStyles.bg}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {menuLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                onClick={(e) => link.href.includes('#') ? handleScrollTo(e, link.href) : null}
                className={`block w-full py-2 cursor-pointer transition-colors duration-200 ${
                  activeSection === link.href.split('#')[1] ? themeStyles.hoverLink : themeStyles.text
                }`}
                whileHover={{ scale: 1.05, textShadow: themeStyles.hoverGlow }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
