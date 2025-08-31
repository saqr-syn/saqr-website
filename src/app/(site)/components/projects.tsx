"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ProjectData } from "@/data/types";
import { useTranslation } from "react-i18next";

interface ProjectsProps {
  lang: "en" | "ar";
}

export default function Projects({ lang }: ProjectsProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data: ProjectData[] = [];
        snapshot.forEach((doc) => {
          const project = doc.data() as ProjectData;
          if (project.features?.length) {
            data.push(project);
          }
        });
        setProjects(data.slice(0, 3)); // أقصى 3 مشاريع
      } catch (err) {
        console.error("Error fetching featured projects:", err);
      }
    };
    fetchProjects();
  }, []);

  if (!mounted || projects.length === 0) return null;

  const isDark = theme === "dark";
  const sectionBg = isDark ? "bg-black" : "bg-gray-100";
  const textColor = isDark ? "text-gray-200" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-700";
  const cardBg = isDark ? "#1a1635" : "#ffffff";
  const badgeBg = isDark ? "#0a0e1a" : "#f0f0f0";
  const badgeText = isDark ? "text-gray-200" : "text-gray-900";

  const cardShadow3D = isDark
    ? "shadow-[0_5px_15px_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.15),0_15px_30px_rgba(0,0,0,0.1)]"
    : "shadow-[0_5px_15px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.1),0_15px_30px_rgba(0,0,0,0.05)]";

  const handleClick = (slug: string) => {
    router.push(`/${lang}/projects/${slug}`);
  };

  return (
    <section id="projects" className={`${sectionBg} relative py-20 transition-colors duration-500`}>
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.h2
          className={`text-3xl md:text-4xl font-extrabold text-center mb-12`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t("projects.title")}{" "}
          <span className="text-sky-500">{t("projects.titleHighlight")}</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id || i}
              className={`rounded-3xl overflow-hidden flex flex-col cursor-pointer transition-transform duration-500 ${cardShadow3D}`}
              style={{ backgroundColor: cardBg }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10, scale: 1.03 }}
              onClick={() => handleClick(project.id || "")}
            >
              {project.screenshotHero && (
                <motion.img
                  src={project.screenshotHero}
                  alt={project.name}
                  className="w-full h-48 object-cover transition-transform duration-500"
                  whileHover={{ scale: 1.05 }}
                />
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#a454ff] text-center md:text-left">
                    {project.name}
                  </h3>
                  <p className={`${subTextColor} mb-4 text-center md:text-left`}>
                    {project.description || project.short}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {project.tools.map((tool, j) => (
                      <span
                        key={j}
                        className={`px-3 py-1 rounded-full border border-[#a454ff]/40 ${badgeBg} ${badgeText} text-sm`}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  className="mt-auto inline-block text-center px-5 py-2 bg-[#a454ff] text-white font-semibold rounded-xl shadow-lg shadow-[#a454ff]/30 hover:bg-[#8241c7] transition-colors duration-300"
                >
                  View Project
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
