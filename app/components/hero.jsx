"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const heroVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
};

const textVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: "easeInOut" } },
};

const buttonVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 0.4, ease: "easeInOut" } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const imageVariants = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.7, delay: 0.3, ease: "easeInOut" } },
};

function GlowParticle({ position }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: 4,
        height: 4,
        borderRadius: "50%",
        backgroundColor: "rgba(0, 191, 255, 0.6)",
        boxShadow: "0 0 8px rgba(0, 191, 255, 0.8)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.5, 1] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear" }}
    />
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState([]);

  // Motion values for 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    setMounted(true);
    // Generate particles
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth * 0.5,
      y: Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.15,
    }));
    setParticles(newParticles);

    // Mouse move listener
    const handleMouse = (e) => {
      const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";
  const textColorClass = isDark ? "text-gray-200" : "text-gray-900";
  const subtitleColorClass = isDark ? "text-gray-400" : "text-gray-700";
  const buttonGradientClass = isDark
    ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600"
    : "bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600";
  const secondaryButtonBorderClass = isDark
    ? "border-cyan-500 hover:border-cyan-600 text-cyan-500 hover:text-cyan-600"
    : "border-pink-500 hover:border-pink-600 text-pink-500 hover:text-pink-600";

  return (
    <motion.section
      id="home"
      className={`relative ${isDark ? "bg-black" : "bg-white"} pt-24 md:pt-28 pb-10 md:pb-16 overflow-hidden`}
      variants={heroVariants}
      initial="initial"
      animate="animate"
    >
      {/* Glow Particles */}
      <div className="absolute inset-0 z-0">
        {particles.map((p, i) => (
          <GlowParticle key={i} position={p} />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative z-10">
        {/* Text Content */}
        <motion.div className="flex-1 max-w-full md:max-w-lg text-center md:text-left" variants={textVariants}>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight ${textColorClass}`}>
            {t("hero.title")}
          </h1>
          <p className={`mb-6 md:mb-8 text-lg md:text-xl leading-relaxed ${subtitleColorClass}`}>
            {t("hero.subtitle")}
          </p>
          <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center md:justify-start" variants={buttonVariants}>
            <motion.a
              href="#projects"
              className={`inline-block py-3 px-6 rounded-full font-semibold ${textColorClass} ${buttonGradientClass} hover:shadow-lg transition-all duration-300`}
              whileHover="hover"
              whileTap="tap"
            >
              {t("hero.cta")}
            </motion.a>
            <motion.a
              href="#contact"
              className={`inline-block py-3 px-6 rounded-full font-semibold border-2 ${secondaryButtonBorderClass} hover:shadow-lg transition-all duration-300`}
              whileHover="hover"
              whileTap="tap"
            >
              {t("hero.cta_contact")}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Image with 3D parallax */}
        <motion.div
          className="flex-1 flex justify-center md:justify-end"
          variants={imageVariants}
          style={{ rotateX, rotateY, perspective: 800 }}
        >
          <motion.img
            src="/hero-illustration.png"
            alt={t("hero.alt_image")}
            className="w-full max-w-[300px] md:max-w-[400px] rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105"
            style={{ filter: isDark ? "brightness(1.1) contrast(1.1)" : "brightness(1)" }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
