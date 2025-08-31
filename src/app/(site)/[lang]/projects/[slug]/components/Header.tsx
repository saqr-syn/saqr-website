// src/app/(site)/projects/[slug]/components/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { motion, Variants } from "framer-motion";
import Rating from "./Rating";
import { ProjectData } from "@/data/types";
import { User } from "firebase/auth";

interface ProjectHeaderProps {
  project: ProjectData & { id?: string };
  lang: string;
  isDark: boolean;
  containerVariants?: Variants;
  itemVariants?: Variants;
  currentUser: User | null; // ✅ تحديد نوع المستخدم
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  lang,
  isDark,
  itemVariants,
  currentUser,
}) => {
  const subText = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <motion.header
      variants={itemVariants}
      className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8"
    >
      {/* زر الرجوع */}
      <Link href={`/${lang}/projects`} className="order-1 md:order-0">
        <button
          className={`px-4 py-2 rounded-full border ${
            isDark ? "border-gray-700" : "border-gray-200"
          } text-sm font-medium hover:scale-105 transition-transform`}
        >
          <span className="flex items-center gap-2">
            <FaChevronLeft /> {lang === "ar" ? "رجوع" : "Back"}
          </span>
        </button>
      </Link>

      {/* العنوان والتصويت */}
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
          {project.name}
        </h1>
        <p className={`text-base ${subText} max-w-3xl`}>{project.short}</p>

        {project.id && (
          <Rating
            projectId={project.id}
            votes={project.votes}
            currentUser={currentUser} // ✅ تمرير المستخدم
          />
        )}
      </div>

      {/* السعر واللينك */}
      <div className="mt-4 md:mt-0 flex gap-3 items-center">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">
            {project.type?.toUpperCase()}
          </div>
          <div className="mt-1 font-bold text-lg">
            {(project.price ?? 0) > 0
              ? `$${project.price}`
              : lang === "ar"
              ? "مجاني"
              : "Free"}
          </div>
        </div>

        {project.links?.website && (
          <a
            href={project.links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-cyan-500 text-white hover:scale-105 shadow-md"
          >
            {lang === "ar" ? "زيارة" : "Visit"}
          </a>
        )}
      </div>
    </motion.header>
  );
};

export default ProjectHeader;
