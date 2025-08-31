// src/app/(site)/projects/[slug]/components/Loader.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface LoaderProps {
  dark?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ dark = false, className = "" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // لغاية ما يتعمل mount، رجّع نسخة safe (مفيهاش اختلاف عن السيرفر)
  if (!mounted) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 ${className}`}>
        <FaSpinner className="animate-spin w-12 h-12 text-sky-500" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        dark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      } ${className}`}
    >
      <FaSpinner className="animate-spin w-12 h-12 text-sky-500" />
    </div>
  );
};

export default Loader;
