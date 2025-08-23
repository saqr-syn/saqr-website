"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const projects = [
  {
    name: "Whispr",
    description: "تطبيق دردشة ذكي وآمن، يدمج الذكاء الاصطناعي لتجربة مستخدم سلسة، ويضمن حماية البيانات بشكل كامل.",
    tools: ["Flutter", "Firebase", "AI"],
    slug: "whispr",
    image: "/projects/whispr.png"
  },
  {
    name: "Project Alpha",
    description: "نظام إدارة مبتكر للمشاريع، يساعد الفرق على تتبع المهام بكفاءة وشفافية عالية.",
    tools: ["Next.js", "Tailwind CSS", "Node.js"],
    slug: "alpha",
    image: "/projects/alpha.png"
  },
  {
    name: "Project Beta",
    description: "تطبيق ويب لتحليل البيانات وعرض التقارير بشكل ديناميكي ومرئي.",
    tools: ["React", "Chart.js", "Firebase"],
    slug: "beta",
    image: "/projects/beta.png"
  }
];

export default function Projects({ lang }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

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

  const handleClick = (slug) => {
    router.push(`/${lang}/projects/${slug}`);
  };

  return (
    <section id="projects" className={`${sectionBg} relative py-20 transition-colors duration-500`}>
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.h2
          className={`text-3xl md:text-4xl font-extrabold text-center mb-12 ${textColor}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span>{t("projects.title")}</span> <span className="text-[#a454ff]">{t("projects.highlight")}</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className={`rounded-3xl overflow-hidden flex flex-col cursor-pointer transition-transform duration-500 ${cardShadow3D}`}
              style={{ backgroundColor: cardBg }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10, scale: 1.03 }}
              onClick={() => handleClick(project.slug)}
            >
              <motion.img
                src={project.image}
                alt={project.name}
                className="w-full h-48 object-cover transition-transform duration-500"
                whileHover={{ scale: 1.05 }}
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#a454ff]">{project.name}</h3>
                  <p className={`${subTextColor} mb-4`}>{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tools.map((tool, j) => (
                      <span key={j} className={`px-3 py-1 rounded-full border border-[#a454ff]/40 ${badgeBg} ${badgeText} text-sm`}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="mt-auto inline-block text-center px-5 py-2 bg-[#a454ff] text-white font-semibold rounded-xl shadow-lg shadow-[#a454ff]/30 hover:bg-[#8241c7] transition-colors duration-300">
                  {t("projects.button")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
