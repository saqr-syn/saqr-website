// src/app/(site)/components/Hero.tsx
"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Particle { x: number; y: number; }

interface GlowParticleProps { position: Particle; }

const GlowParticle = ({ position }: GlowParticleProps) => (
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

interface HeroProps { lang: "en" | "ar"; }

export default function Hero({ lang }: HeroProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Motion values for 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    setMounted(true);

    // Generate particles safely after mount
    const newParticles: Particle[] = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth * 0.5,
      y: Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.15,
    }));
    setParticles(newParticles);

    const handleMouse = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  // قبل mount نرجع null → حماية من Hydration mismatch
  if (!mounted) return null;

  const isDark = theme === "dark";
  const textColorClass = isDark ? "text-gray-200" : "text-gray-900";
  const subtitleColorClass = isDark ? "text-gray-400" : "text-gray-700";

  return (
    <motion.section className={`relative ${isDark ? "bg-black" : "bg-white"} pt-24 md:pt-28 pb-10 md:pb-16 overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        {particles.map((p, i) => <GlowParticle key={i} position={p} />)}
      </div>

      <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative z-10">
        <motion.div className="flex-1 max-w-full md:max-w-lg text-center md:text-left">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight ${textColorClass}`}>
            {t("hero.title")}
          </h1>
          <p className={`mb-6 md:mb-8 text-lg md:text-xl leading-relaxed ${subtitleColorClass}`}>
            {t("hero.subtitle")}
          </p>
        </motion.div>

        <motion.div className="flex-1 flex justify-center md:justify-end" style={{ rotateX, rotateY, perspective: 800 }}>
          <motion.img
            src="https://i.postimg.cc/YqNFMbm4/hero-illustration.png"
            alt={t("hero.alt_image")}
            className="w-full max-w-[300px] md:max-w-[400px] rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105"
            style={{ filter: isDark ? "brightness(1.1) contrast(1.1)" : "brightness(1)" }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
