"use client";

import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";

// -----------------------------------------------------------------------------
// * المكون الأساسي
// -----------------------------------------------------------------------------
export default function UserAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme } = useTheme();

  const themeStyles = {
    loginIcon: theme === "dark" ? "text-gray-300 hover:text-sky-300" : "text-gray-600 hover:text-purple-600",
    logoutIcon: theme === "dark" ? "text-red-500 hover:text-red-400" : "text-red-500 hover:text-red-600",
    shadow: theme === "dark" ? "shadow-sky-400/30" : "shadow-purple-500/40",
    userText: theme === "dark" ? "text-gray-200" : "text-gray-800",
    adminText: "text-sky-500 hover:text-sky-600" // ستايل مميز للأدمن
  };

  useEffect(() => {
    setMounted(true);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!mounted) return null;

  // ✅ تحقق إذا كان المستخدم Admin
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL; // غيّر الإيميل ده لإيميل الأدمن بتاعك

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <>
          {isAdmin ? (
            <Link href="/en/dashboard">
              <p
                className={`hidden sm:block text-sm md:text-base font-semibold cursor-pointer transition-colors duration-300 ${themeStyles.adminText}`}
              >
                {user.displayName || "Admin"}
              </p>
            </Link>
          ) : (
            <p
              className={`hidden sm:block text-sm md:text-base font-semibold transition-colors duration-300 ${themeStyles.userText}`}
            >
              {user.displayName}
            </p>
          )}

          <motion.button
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${themeStyles.logoutIcon}`}
            onClick={handleLogout}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </>
      ) : (
        <motion.button
          className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${themeStyles.loginIcon}`}
          onClick={handleLogin}
          whileTap={{ scale: 0.95 }}
        >
          <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      )}
    </div>
  );
}
