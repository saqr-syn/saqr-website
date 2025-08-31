// src/app/(admin)/[lang]/login/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { FcGoogle } from "react-icons/fc";

const googleProvider = new GoogleAuthProvider();

export default function LoginPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  const pageBg = isDark ? "bg-gray-950" : "bg-gray-50";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-gray-200" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-600";
  const cardShadow = isDark ? "shadow-xl shadow-black/70" : "shadow-xl shadow-gray-400/50";

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User logged in successfully:", result.user);
      window.location.href = "/"; 
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <main className={`flex items-center justify-center min-h-screen p-6 transition-colors duration-500 ${pageBg}`}>
      <motion.div
        className={`w-full max-w-md p-8 text-center rounded-3xl border ${cardBg} ${cardShadow}
        ${isDark ? "border-gray-800" : "border-gray-200"} transition-all duration-500`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={`text-3xl font-bold mb-3 ${textColor}`}>
          تسجيل الدخول
        </h1>
        <p className={`mb-8 ${subTextColor}`}>
          سجل الدخول باستخدام حساب Google الخاص بك.
        </p>

        <motion.button
          onClick={handleGoogleLogin}
          className={`w-full flex items-center justify-center gap-3 py-3 px-4 text-lg font-semibold rounded-2xl
          ${cardBg} ${textColor} border ${isDark ? "border-gray-700" : "border-gray-300"}
          shadow-lg shadow-gray-200/50 ${isDark ? "shadow-black/70" : ""}
          transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/30`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FcGoogle className="w-6 h-6" />
          تسجيل الدخول باستخدام Google
        </motion.button>
      </motion.div>
    </main>
  );
}
