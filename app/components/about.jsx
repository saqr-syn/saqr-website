"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function About() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const skills = t("about.skills", { returnObjects: true });
  const isDark = theme === "dark";

  // ألوان ثابتة، بدون لعب في Light/Dark
  const sectionBg = isDark ? "bg-black" : "bg-gray-50";
  const textColor = isDark ? "text-gray-200" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-700";
  const skillBg = isDark ? "bg-gray-900" : "bg-white";
  const skillText = isDark ? "text-gray-200" : "text-gray-900";
  const shadowStyle = "shadow-md";

  // Variants للأنيميشن
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="about"
      className={`${sectionBg} relative py-20 overflow-hidden transition-colors duration-500`}
    >
      <div className="site-container">

        {/* Title */}
        <motion.h2
          className={`text-3xl sm:text-4xl md:text-4xl font-extrabold text-center mb-12 ${textColor}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t("about.title")} <span className="text-sky-500">{t("about.titleHighlight")}</span>
        </motion.h2>

        <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">

          {/* Text */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.p
              className={`text-base sm:text-lg md:text-lg leading-relaxed mb-5 ${textColor}`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              {t("about.intro")}{" "}
              <span className={`font-semibold ${textColor}`}>{t("about.name")}</span>{" "}
              {t("about.descriptionHighlight")}{" "}
              <span className="text-sky-500 font-bold">{t("about.descriptionEmphasis")}</span>.
            </motion.p>

            <motion.p
              className={`mb-5 italic text-sm sm:text-base ${subTextColor}`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              {t("about.missionStart")}{" "}
              <span className="text-sky-500 font-semibold">{t("about.missionHighlight")}</span>{" "}
              {t("about.missionEnd")}
            </motion.p>

            {/* Skills */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center md:justify-start"
              variants={containerVariants}
            >
              {skills.map((skill, i) => (
                <motion.span
                  key={i}
                  className={`px-4 py-2 rounded-full text-sm sm:text-sm font-medium border border-sky-300/40 ${skillBg} ${skillText} ${shadowStyle} cursor-default transition transform hover:scale-105`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Image / Illustration */}
          <motion.div
            className="flex-1 mt-10 md:mt-0"
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="/about-illustration.png"
              alt={t("about.imageAlt")}
              className="w-full max-w-sm sm:max-w-md md:max-w-md mx-auto rounded-3xl shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
