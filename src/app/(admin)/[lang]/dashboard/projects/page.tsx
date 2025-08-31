"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/(admin)/components/ui/card";
import { Button } from "@/app/(admin)/components/ui/button";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { getAllProjects, Project } from "@/utils/admin/ViewProjects";
import { deleteProject } from "@/utils/admin/DeleteProject";
import { themeColors } from "@/utils/theme";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, duration: 0.6 } },
};

const ProjectsPage = () => {
  const { lang } = useParams() as { lang: string };
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme(); // "light" | "dark"
  const colors = theme === "dark" ? themeColors.dark : themeColors.light;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const allProjects = await getAllProjects();
      setProjects(allProjects);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className={`${colors.bg} transition-colors duration-500 min-h-screen p-8 space-y-12`}>
      {/* Header */}
      <motion.div
        className={`flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b ${colors.border}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className={`text-4xl font-extrabold md:text-5xl ${colors.text} bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500`}>
            {t("AdminProjectsPage.title")} <span className="text-sky-500">{t("AdminProjectsPage.highlight")}</span>
          </h1>
          <p className={`mt-2 text-lg ${colors.textSecondary}`}>
            {t("AdminProjectsPage.description")}
          </p>
        </div>

        <Link href={`/${lang}/dashboard/projects/new_project`} passHref className="group relative">
          <Button className="rounded-full px-8 py-4 text-lg font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 text-white transition-all duration-500 ease-in-out transform group-hover:scale-[1.05] shadow-lg shadow-gray-400/20 dark:shadow-gray-900/40 group-hover:shadow-xl group-hover:shadow-indigo-500/50 dark:group-hover:shadow-indigo-500/50">
            {t("AdminProjectsPage.AddButton")}
          </Button>
        </Link>
      </motion.div>

      {/* Projects Grid */}
      {loading ? (
        <div className={`text-center ${colors.textSecondary}`}>
          <p className="text-lg">Loading Projects...</p>
          <div className="mt-4 animate-pulse">
            <svg className="mx-auto w-10 h-10 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      ) : (
        <motion.div
          className="p-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className={`relative group rounded-2xl border overflow-hidden transition-all duration-300 transform hover:scale-[1.03] ${colors.cardBg} ${colors.border}`}
              variants={cardVariants}
            >
              {/* Hero Image */}
              <div className="relative w-full h-44">
                <Image
                  src={project.screenshotHero || "/projects/default.png"}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                />
              </div>

              {/* Content */}
              <div className="p-6 cursor-pointer" onClick={() => router.push(`/${lang}/dashboard/projects/${project.id}`)}>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className={`text-2xl font-bold ${colors.text}`}>{project.name}</CardTitle>

                  <div className={`flex flex-col sm:flex-row sm:items-center gap-2 text-sm ${colors.textSecondary}`}>
                    <span>{project.type?.toUpperCase()}</span>
                    <span>|</span>
                    <span>{project.status}</span>
                    <span>|</span>
                    <span>{project.paid ? `$${project.price}` : "مجاني"}</span>
                  </div>

                  {project.developer && (
                    <p className={`text-sm mt-1 ${colors.textSecondary}`}>
                      {project.developerRole ? `${project.developerRole} - ` : ""}{project.developer}
                    </p>
                  )}

                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="bg-sky-500/20 text-sky-500 text-xs px-2 py-1 rounded-full font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>

                <CardContent className={`p-0 mt-3 ${colors.textSecondary}`}>
                  <p className="text-sm">{project.short || project.description}</p>
                </CardContent>
              </div>

              {/* Actions */}
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 pt-4">
                <Button
                  onClick={() => router.push(`/${lang}/dashboard/projects/edit/${project.id}`)}
                  className={`w-full sm:w-auto px-12 py-2 transition-all duration-300 transform hover:scale-[1.02] ${colors.button.primaryBg} ${colors.button.primaryText} ${colors.button.shadow} font-semibold rounded-xl`}
                >
                  {t("AdminProjectsPage.EditButton")}
                </Button>
                <Button
                  onClick={async () => {
                    const confirmDelete = confirm(`هل أنت متأكد أنك تريد حذف مشروع "${project.name}"؟`);
                    if (!confirmDelete) return;
                    const success = await deleteProject(project.id);
                    if (success) {
                      setProjects(prev => prev.filter(p => p.id !== project.id));
                      alert("تم حذف المشروع بنجاح ✅");
                    } else {
                      alert("حدث خطأ أثناء حذف المشروع ❌");
                    }
                  }}
                  variant="destructive"
                  className={`w-full sm:w-auto px-12 py-2 transition-all duration-300 transform hover:scale-[1.02] ${colors.button.destructiveBg} ${colors.button.destructiveText} ${colors.button.shadow} font-semibold rounded-xl`}
                >
                  {t("AdminProjectsPage.DeleteButton")}
                </Button>
              </CardFooter>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsPage;
