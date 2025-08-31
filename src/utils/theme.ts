// src/utils/theme.ts
export const themeColors = {
  light: {
    bg: "bg-gray-50",                        // خلفية الصفحة
    text: "text-gray-900",                    // النص الرئيسي
    textSecondary: "text-gray-600",          // نص ثانوي
    cardBg: "bg-white border-gray-200",      // خلفية الكارد وحدوده
    border: "border-gray-300",               // الحدود العامة
    inputBg: "bg-gray-100 text-gray-900",    // خلفية الحقول والنصوص بداخلها
    button: {
      primaryBg: "bg-sky-500 hover:bg-sky-600",     // خلفية زر رئيسي
      primaryText: "text-white",                     // نص الزر الرئيسي
      destructiveBg: "bg-red-500 hover:bg-red-600", // خلفية زر تدميري
      destructiveText: "text-white",                // نص الزر التدميري
      shadow: "shadow-md shadow-gray-300/30 hover:shadow-lg hover:shadow-gray-400/50", // ظل الزر
    },
  },
  dark: {
    bg: "bg-black",                             // خلفية الصفحة
    text: "text-gray-200",                      // النص الرئيسي
    textSecondary: "text-gray-400",            // نص ثانوي
    cardBg: "bg-gray-900 border-gray-800",     // خلفية الكارد وحدوده
    border: "border-gray-700",                 // الحدود العامة
    inputBg: "bg-gray-800 text-gray-200",      // خلفية الحقول والنصوص بداخلها
    button: {
      primaryBg: "bg-sky-600 hover:bg-sky-700",     // خلفية زر رئيسي
      primaryText: "text-white",                     // نص الزر الرئيسي
      destructiveBg: "bg-red-600 hover:bg-red-700", // خلفية زر تدميري
      destructiveText: "text-white",                // نص الزر التدميري
      shadow: "shadow-md shadow-sky-500/30 hover:shadow-lg hover:shadow-sky-500/50", // ظل الزر
    },
  },
};
