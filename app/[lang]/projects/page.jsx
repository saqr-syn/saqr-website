// app/[lang]/projects/ProjectsClient.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import projectData from "@/data/fake_data"; // تأكد من المسار

// تحويل object لمصفوفة لتسهيل العرض
const projectsArray = Object.values(projectData).map(p => ({
  slug: p.slug,
  name: p.name,
  type: p.mobileDownload ? { en: "Mobile", ar: "محمول" } : { en: "Web", ar: "ويب" },
  description: { en: p.short, ar: p.short },
  image: p.screenshotHero
}));

export default function ProjectsClient({ params = {}, searchParams = {} }) {
  const router = useRouter();
  const { theme } = useTheme();
  const { lang = "en" } = params;

  // label لـ "All" حسب اللغة حتى لا يحدث انقسام بالفلتر
  const ALL_LABEL = lang === "ar" ? "الكل" : "All";

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState(() => (searchParams.q ? String(searchParams.q) : ""));
  const [typeFilter, setTypeFilter] = useState(ALL_LABEL);
  const [filteredProjects, setFilteredProjects] = useState(projectsArray);

  useEffect(() => setMounted(true), []);

  // احسب خيارات النوع محليًا
  const typeOptions = useMemo(() => {
    return [ALL_LABEL, ...Array.from(new Set(projectsArray.map(p => p.type[lang])))];
  }, [lang, ALL_LABEL]);

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

  if (!mounted) return null; // يحمي تعارضات SSR/CSR مع next-themes

  return (
    <div className={`min-h-screen pt-28 px-6 md:px-12 pb-20 ${theme === "dark" ? "bg-black text-gray-300" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-[#a454ff]">
        {lang === "ar" ? "المشروعات" : "Projects"}
      </h1>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 items-center">
        <input
          type="text"
          placeholder={lang === "ar" ? "ابحث بالاسم أو النوع..." : "Search by name or type..."}
          className={`px-5 py-3 rounded-2xl w-full max-w-md border focus:outline-none focus:ring-2 focus:ring-[#a454ff] shadow-md transition-colors duration-300
            ${theme === "dark" ? "dark:bg-gray-800 dark:text-white dark:border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
          {typeOptions.map(option => (
            <button
              key={option}
              onClick={() => setTypeFilter(option)}
              className={`px-5 py-2 rounded-2xl font-semibold transition-colors duration-300 shadow-md
                ${theme === "dark"
                  ? (typeFilter === option ? "bg-[#a454ff] text-white hover:bg-[#8b36ff]" : "bg-gray-800 text-gray-300 hover:bg-gray-700")
                  : (typeFilter === option ? "bg-[#a454ff] text-white hover:bg-[#8b36ff]" : "bg-white text-gray-900 hover:bg-gray-100")
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <motion.div
            key={project.slug}
            whileHover={{ scale: 1.03 }}
            className={`cursor-pointer rounded-3xl overflow-hidden relative transition-transform duration-300
                      ${theme === "dark" ? "shadow-[0_8px_20px_rgba(0,0,0,0.6)] bg-gray-800 hover:shadow-[0_12px_25px_rgba(0,0,0,0.8)]"
                : "shadow-xl bg-white hover:shadow-2xl"}`}
            onClick={() => router.push(`/${lang}/projects/${project.slug}`)}
          >
            <div className="relative w-full h-56 md:h-64">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
              )}
            </div>

            <div className={`absolute top-4 right-4 px-4 py-1 rounded-full font-semibold text-sm 
              ${project.type.en === "Mobile" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>
              {project.type[lang]}
            </div>

            <div className="p-6 md:p-8 space-y-3">
              <h3 className="text-2xl font-bold text-[#a454ff]">{project.name}</h3>
              <p className="text-gray-700 dark:text-gray-300">{project.description[lang]}</p>
            </div>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-6 text-lg">
            {lang === "ar" ? "لا توجد مشروعات" : "No projects found."}
          </p>
        )}
      </div>
    </div>
  );
}
