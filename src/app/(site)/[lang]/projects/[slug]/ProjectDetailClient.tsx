"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useTheme } from "next-themes";

import ProjectHeader from "./components/Header";
import MediaGallery from "./components/Media";
import ProjectDetails from "./components/Details";
import ProjectStages from "./components/Stages";
import ProjectSidebar from "./components/ProjectSidebar";
import Comments from "./components/Comments";
import Loader from "./components/Loader";

import { ProjectData } from "@/data/types";
import { useAuth } from "@/hooks/useAuth";

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.995 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.06, ease: "easeOut", duration: 0.6 },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

interface Props {
  project: ProjectData & { id: string };
  lang?: "ar" | "en";
}

const ProjectDetailClient: React.FC<Props> = ({ project, lang = "en" }) => {
  const { theme } = useTheme();
  const { user, loading } = useAuth(); // <-- المستخدم الحالي وحالة التحميل
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!project) return <Loader dark={theme === "dark"} />;
  if (!mounted || loading) return <Loader dark={theme === "dark"} />;

  const isDark = theme === "dark";

  return (
    <motion.div
      className={`min-h-screen pt-24 px-4 md:px-12 pb-24 transition-colors duration-300 ${
        isDark ? "bg-neutral-950 text-gray-300" : "bg-gray-50 text-gray-900"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-6xl mx-auto">
        <ProjectHeader project={project} lang={lang} isDark={isDark} itemVariants={itemVariants} currentUser={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
              <MediaGallery project={project} isDark={isDark} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ProjectDetails project={project} lang={lang} isDark={isDark} />
            </motion.div>

            {project.stages && project.stages.length > 0 && (
              <ProjectStages stages={project.stages} lang={lang} isDark={isDark} />
            )}
          </div>

          <div className="lg:col-span-1">
            <ProjectSidebar project={project} lang={lang} isDark={isDark} />
          </div>
        </div>

        <motion.div variants={itemVariants} className="mt-10">
          {/* تمرير المستخدم الحالي للمكون اللي يحتاجه */}
          <Comments projectId={project.id} lang={lang} isDark={isDark} currentUser={user} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailClient;
