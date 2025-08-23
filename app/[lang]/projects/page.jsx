// src/app/[lang]/projects/page.jsx

"use client";

// استيراد المكتبات الأساسية
import { useState, useEffect, useMemo, use } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import projectData from "@/data/fake_data";

// تجهيز بيانات المشاريع
const projectsArray = Object.values(projectData).map(p => ({
  slug: p.slug,
  name: p.name,
  type: p.mobileDownload ? { en: "Mobile", ar: "محمول" } : { en: "Web", ar: "ويب" },
  description: { en: p.short, ar: p.short },
  image: p.screenshotHero
}));

// المكون الرئيسي ProjectsClient
export default function ProjectsClient({ params, searchParams }) {
  const router = useRouter();
  const { theme } = useTheme();

  // 🍑 استخدام use() لفك الـ Promises للـ params و searchParams
  // هذا هو الحل للمشكلة المذكورة في الـ Console
  // The 'use' hook unwraps the Promise to get the real value
  const { lang } = use(params);
  const { q } = use(searchParams);

  // استخدام الـ State
  const ALL_LABEL = lang === "ar" ? "الكل" : "All";
  const [mounted, setMounted] = useState(false);
  const [typeFilter, setTypeFilter] = useState(ALL_LABEL);
  const [filteredProjects, setFilteredProjects] = useState(projectsArray);
  
  // ⭐️⭐️ الحل هنا ⭐️⭐️
  // نستخدم state فارغ في البداية
  const [search, setSearch] = useState(''); 
  
  // نحدث قيمة البحث فقط بعد ما المكون يتم تحميله على الكلاينت
  useEffect(() => {
    // نتأكد إن q مش undefined أو null عشان ما يظهرش "undefined"
    if (q !== undefined && q !== null) {
      setSearch(String(q));
    }
  }, [q]);
  
  // تأثير جانبي لضمان أن المكون تم تحميله على العميل
  // Essential for hydration with Next.js & Framer Motion
  useEffect(() => setMounted(true), []);

  // استخدام useMemo لتحسين أداء خيارات الفلترة
  const typeOptions = useMemo(
    () => [ALL_LABEL, ...Array.from(new Set(projectsArray.map(p => p.type[lang])))],
    [lang, ALL_LABEL]
  );

  // تأثير جانبي لفلترة المشاريع عند تغير البحث أو الفلتر
  useEffect(() => {
    const searchLower = (search || "").toLowerCase();
    const filtered = projectsArray.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(searchLower);
      const typeMatch = p.type[lang].toLowerCase().includes(searchLower);
      const typeFilterMatch = typeFilter === ALL_LABEL || p.type[lang] === typeFilter;
      return (nameMatch || typeMatch) && typeFilterMatch;
    });
    setFilteredProjects(filtered);
  }, [search, typeFilter, lang, ALL_LABEL]);

  // If the component hasn't mounted yet, render nothing to avoid hydration issues
  if (!mounted) {
    return null;
  }

  // الواجهة الرسومية (UI)
  return (
    <div
      className={`min-h-screen pt-28 px-6 md:px-12 pb-20 transition-colors duration-500
        ${theme === "dark" ? "bg-black text-gray-200" : "bg-gray-100 text-gray-900"}`}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-extrabold mb-10 text-center text-[#a454ff]"
      >
        {lang === "ar" ? "المشروعات" : "Projects"}
      </motion.h1>

      {/* شريط البحث وخيارات الفلترة */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-center gap-4 mb-10 items-center"
      >
        {/* حقل البحث */}
        <input
          type="text"
          placeholder={lang === "ar" ? "ابحث بالاسم أو النوع..." : "Search by name or type..."}
          className={`px-5 py-3 rounded-2xl w-full max-w-md border focus:outline-none focus:ring-2 focus:ring-[#a454ff] shadow-md transition-colors duration-300
            ${theme === "dark" ? "bg-gray-800 text-gray-200 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* أزرار الفلترة */}
        <div className="flex gap-2 flex-wrap justify-center">
          {typeOptions.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTypeFilter(option)}
              className={`px-5 py-2 rounded-2xl font-semibold transition-colors duration-300 shadow-md
                ${theme === "dark"
                  ? (typeFilter === option ? "bg-[#a454ff] text-white hover:bg-[#8241c7]" : "bg-gray-800 text-gray-200 hover:bg-gray-700")
                  : (typeFilter === option ? "bg-[#a454ff] text-white hover:bg-[#8241c7]" : "bg-white text-gray-900 hover:bg-gray-100")
                }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* عرض المشاريع في شبكة Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ scale: 1.03, y: -5, boxShadow: theme === "dark" ? "0 15px 30px rgba(0,0,0,0.4)" : "0 15px 30px rgba(0,0,0,0.15)" }}
            className={`cursor-pointer rounded-3xl overflow-hidden relative transition-all duration-500
              ${theme === "dark" ? "shadow-[0_8px_20px_rgba(0,0,0,0.6)] bg-[#1a1635] hover:shadow-[0_12px_25px_rgba(0,0,0,0.8)]"
                : "shadow-xl bg-white hover:shadow-2xl"}`}
            onClick={() => router.push(`/${lang}/projects/${project.slug}`)}
          >
            {/* صورة المشروع */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-56 md:h-64"
            >
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index < 3} // Priority for the first 3 images
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
              )}
            </motion.div>

            {/* بادج نوع المشروع */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className={`absolute top-4 ${lang === "ar" ? "left-4" : "right-4"} px-4 py-1 rounded-full font-semibold text-sm transition-colors duration-300
                ${theme === "dark" ? "bg-[#0a0e1a] text-gray-200 border border-[#a454ff]/40 shadow-sm" : "bg-[#f0f0f0] text-gray-900 border border-[#a454ff]/40 shadow-sm"}`}
            >
              {project.type[lang]}
            </motion.div>

            {/* تفاصيل المشروع */}
            <div className="p-6 md:p-8 space-y-3">
              <h3 className="text-2xl font-bold text-[#a454ff]">{project.name}</h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
                {project.description[lang]}
              </p>
            </div>
          </motion.div>
        ))}

        {/* رسالة عند عدم وجود مشاريع */}
        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-6 text-lg"
          >
            {lang === "ar" ? "لا توجد مشروعات" : "No projects found."}
          </motion.p>
        )}
      </div>
    </div>
  );
}