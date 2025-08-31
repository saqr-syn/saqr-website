// src/app/(site)/components/footer.tsx
"use client";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black border-t border-gray-900" : "bg-gray-50 border-t border-gray-200";
  const textColor = isDark ? "text-gray-200" : "text-gray-900";
  const linkHover = "hover:text-[#a454ff] transition-colors";

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${bgColor} py-10 transition-colors duration-500`}>
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-right">

        {/* الجزء الأيمن: الشعار وحقوق النشر */}
        <div className="text-center md:text-right">
          <h3 className={`font-extrabold text-xl mb-2 ${textColor}`}>
            مصطفى <span className="text-[#a454ff]">صقر</span>
          </h3>
          <p className={`text-sm ${textColor}`}>
            © {currentYear} مصطفى صقر. {t("footer.rights")}
          </p>
        </div>

        {/* الجزء الأوسط: روابط التنقل */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          {["home", "about", "projects", "contact"].map((navItem) => (
            <motion.div key={navItem} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={`/#${navItem}`} className={`${textColor} ${linkHover}`}>
                {t(`navbar.${navItem}`)}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* الجزء الأيسر: أيقونات التواصل الاجتماعي */}
        <div className="flex gap-5">
          {[
            { icon: <Github className="w-5 h-5" />, url: "https://github.com/saqr-syn" },
            { icon: <Linkedin className="w-5 h-5" />, url: "https://linkedin.com/" },
            { icon: <Twitter className="w-5 h-5" />, url: "https://twitter.com/" },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <Link href={item.url} target="_blank" className={`${textColor} ${linkHover}`}>
                {item.icon}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* الشعار السفلي الصغير */}
      <div className={`text-center mt-8 text-xs ${textColor}`}>
        {t("footer.motto")}
      </div>
    </footer>
  );
}
