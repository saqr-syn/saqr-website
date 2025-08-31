// src/app/(admin)/[lang]/dashboard/projects/[id]/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/app/(admin)/components/ui/card";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";

// ====== Types ======
interface Project {
  id: string;
  name: string;
  description?: string;
  short?: string;
  screenshotHero?: string;
  screenshots?: string[];
  developer?: string;
  price?: number;
  paid?: boolean;
  github?: string;
  website?: string;
  tags?: string[];
  tools?: string[];
  featuredApps?: string[];
  status?: string;
  year?: number;
  createdAt?: any;
  updatedAt?: any;
}

// ====== Motion Variants ======
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

import type { Variants } from "framer-motion";

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

// ====== Component ======
const ProjectDetail = () => {
  const { id } = useParams() as { id: string };
  const { t } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // ====== Parallax Effect Hooks ======
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - top) / height - 0.5; // -0.5 to 0.5
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const springConfig = { damping: 20, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

  // ====== Data Fetching ======
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          console.error("Project not found");
          setProject(null); // Explicitly set to null to show "Not Found" message
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setProject(null);
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  // ====== Render States ======
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-300">
        <svg
          className="animate-spin h-8 w-8 text-sky-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.96l2-2.669z"
          ></path>
        </svg>
        <span className="ml-3 font-medium">
          {t("projectDetail.loading")}...
        </span>
      </div>
    );

  if (!project)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-bold">
        {t("projectDetail.notFound")}
      </div>
    );

  return (
    <motion.div
      className="p-8 space-y-8 bg-gray-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="rounded-3xl shadow-2xl dark:shadow-sky-500/10">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              {project.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ====== 3D Parallax Hero Image ====== */}
            {project.screenshotHero && (
              <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                  mouseX.set(0);
                  mouseY.set(0);
                }}
                className="relative w-full h-96 rounded-3xl overflow-hidden shadow-xl cursor-pointer"
                style={{
                  perspective: 1000,
                  transform: "perspective(1000px)",
                }}
              >
                <motion.div
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                  }}
                  className="w-full h-full"
                >
                  <Image
                    src={project.screenshotHero}
                    alt={project.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </motion.div>
            )}

            {/* ====== Project Overview ====== */}
            {project.short && (
              <motion.p
                variants={itemVariants}
                className="text-xl font-semibold text-gray-700 dark:text-gray-200"
              >
                {project.short}
              </motion.p>
            )}
            {project.description && (
              <motion.p
                variants={itemVariants}
                className="text-base leading-relaxed text-gray-600 dark:text-gray-400"
              >
                {project.description}
              </motion.p>
            )}

            {/* ====== Details Section ====== */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("projectDetail.developer")}
                </h3>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {project.developer}
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("projectDetail.status")}
                </h3>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {project.status}
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("projectDetail.year")}
                </h3>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {project.year}
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("projectDetail.price")}
                </h3>
                <p className="font-semibold text-sky-500">
                  {project.paid ? `$${project.price}` : t("projectDetail.free")}
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("projectDetail.github")}
                </h3>
                <Link
                  href={project.github || "#"}
                  target="_blank"
                  className="font-medium text-sky-500 hover:underline transition-all"
                >
                  {t("projectDetail.viewCode")}
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("projectDetail.website")}
                </h3>
                <Link
                  href={project.website || "#"}
                  target="_blank"
                  className="font-medium text-sky-500 hover:underline transition-all"
                >
                  {t("projectDetail.visitWebsite")}
                </Link>
              </motion.div>
            </motion.div>

            {/* ====== Tags & Tools ====== */}
            <div className="space-y-4">
              {project.tags && project.tags.length > 0 && (
                <motion.div variants={containerVariants}>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t("projectDetail.tags")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        variants={badgeVariants}
                        className="px-4 py-1.5 bg-sky-100 dark:bg-sky-900/30 rounded-full text-sm font-medium text-sky-700 dark:text-sky-200 shadow-md transition-all hover:scale-105"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {project.tools && project.tools.length > 0 && (
                <motion.div variants={containerVariants}>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t("projectDetail.tools")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <motion.span
                        key={tool}
                        variants={badgeVariants}
                        className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-200 shadow-md transition-all hover:scale-105"
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ====== Screenshots Grid ====== */}
            {project.screenshots && project.screenshots.length > 0 && (
              <motion.div variants={containerVariants}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  {t("projectDetail.screenshots")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.screenshots.map((src, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="relative w-full h-48 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Image
                        src={src}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>

          {/* ====== Actions Footer ====== */}
          <CardFooter className="flex justify-end gap-4 p-6">
            <motion.div variants={itemVariants}>
              <Link
                href="/en/dashboard/projects"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900 hover:scale-[1.02] shadow-sm"
              >
                {t("projectDetail.back")}
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetail;