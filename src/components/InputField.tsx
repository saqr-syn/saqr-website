// src/components/FormField.tsx
"use client";

import React, { useState, useRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface BaseProps {
  label: string | React.ReactNode;
  id: string;
  theme?: "light" | "dark";
}

interface InputFieldProps extends BaseProps {
  type?: "text" | "email" | "password" | "number" | "textarea" | "image-upload";
  images?: Array<string>;
  onImageAdd?: (url: string) => void;
  onImageRemove?: (index: number) => void;
  id: string; // Explicitly define 'id' to resolve conflicts
  autoComplete?: string; // Explicitly define 'autoComplete' to resolve conflicts
  className?: string;
  [key: string]: any; // Allow additional props for input or textarea
}

interface FormSelectProps extends BaseProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  options: { value: string; label: string }[];
}

interface AnimatedSelectProps extends BaseProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

// --- InputField Component ---
export const InputField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputFieldProps & { theme?: "light" | "dark" }
>(({ label, id, type = "text", className, images = [], onImageAdd, onImageRemove, theme = "dark", ...props }, ref) => {
  const isTextarea = type === "textarea";
  const isImageUpload = type === "image-upload";
  const Element = isTextarea ? "textarea" : "input";

  // ألوان حسب الثيم
  const colors = theme === "dark"
    ? {
        bg: "bg-gray-800",
        border: "border-gray-700",
        text: "text-gray-200",
        focusRing: "focus:ring-sky-500",
        hoverBorder: "hover:border-sky-500",
      }
    : {
        bg: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-900",
        focusRing: "focus:ring-purple-500",
        hoverBorder: "hover:border-purple-500",
      };

  const handleAddImage = () => {
    const url = prompt("أدخل رابط الصورة:");
    if (url && onImageAdd) onImageAdd(url);
  };

  if (isImageUpload) {
    return (
      <div className="flex flex-col mb-6 w-full">
        <label className={`font-medium mb-2 ${colors.text}`}>{label}</label>
        <div className={cn(
          "flex flex-wrap items-center gap-2 p-3 rounded-xl border",
          colors.border,
          colors.bg,
          className
        )}>
          {images.map((img: string, i: number) => (
            <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden group">
              <img src={img} alt={`Uploaded ${i + 1}`} className="w-full h-full object-cover" />
              {onImageRemove && (
                <button
                  type="button"
                  onClick={() => onImageRemove(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className={`w-20 h-20 ${colors.bg} ${colors.text} rounded-md flex items-center justify-center border border-dashed ${colors.border} ${colors.hoverBorder} transition-colors`}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-6 w-full">
      <label className={`font-medium mb-2 ${colors.text}`}>{label}</label>
      <Element
        id={id}
        ref={ref as any}
        className={cn(
          `w-full p-3 rounded-xl border ${colors.border} ${colors.bg} ${colors.text} focus:outline-none ${colors.focusRing} transition-all duration-300 shadow-sm`,
          isTextarea ? "resize-none" : "",
          className
        )}
        {...props}
      />
    </div>
  );
});

InputField.displayName = "InputField";

// --- FormSelect Component ---
export const FormSelect: React.FC<FormSelectProps> = ({ label, id, options, className, theme = "dark", ...props }) => {
  return (
    <div className="flex flex-col mb-6 w-full">
      <label className="text-gray-400 font-medium mb-2">{label}</label>
      <select
        id={id}
        className={cn(
          "w-full p-3 rounded-xl border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 shadow-sm",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// --- AnimatedSelect Component (Adjusted Dropdown Position) ---
export const AnimatedSelect: React.FC<AnimatedSelectProps & { theme: "light" | "dark" }> = ({
  label,
  id,
  options,
  value,
  onChange,
  theme, // تمرير الثيم
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ألوان حسب الثيم
  const colors = theme === "dark"
    ? {
        bg: "bg-gray-800",
        border: "border-gray-700",
        text: "text-gray-200",
        hoverBg: "hover:bg-sky-600",
        hoverText: "hover:text-white",
        selectedBg: "bg-sky-500",
        selectedText: "text-white",
        label: "text-gray-400",
      }
    : {
        bg: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-900",
        hoverBg: "hover:bg-purple-300",
        hoverText: "hover:text-white",
        selectedBg: "bg-purple-500",
        selectedText: "text-white",
        label: "text-gray-700",
      };

  return (
    <div className="flex flex-col mb-6 relative w-full" ref={containerRef}>
      <label className={`font-medium mb-2 ${colors.label}`}>{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 rounded-xl border ${colors.border} ${colors.bg} ${colors.text} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 shadow-sm flex justify-between items-center`}
      >
        {options.find((o) => o.value === value)?.label || "اختر قيمة"}
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`absolute z-50 w-full top-full left-0 ${colors.bg} border ${colors.border} rounded-xl shadow-lg max-h-60 overflow-auto py-1 mt-1`}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  opt.value === value
                    ? `${colors.selectedBg} ${colors.selectedText}`
                    : `${colors.text} ${colors.hoverBg} ${colors.hoverText}`
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
