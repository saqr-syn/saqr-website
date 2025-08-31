"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/(admin)/components/ui/card";
import { motion, Variants } from "framer-motion";
import { ProjectData } from "@/data/types";

interface ProjectDetailsProps {
  project: ProjectData;
  lang: string;
  isDark: boolean;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// دالة مساعدة لتحويل أي قيمة لمصفوفة آمنة
const safeArray = (arr: any) => (Array.isArray(arr) ? arr : []);

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, lang, isDark }) => {
  const subText = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div className="space-y-6">
      {/* الوصف */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-4 bg-transparent">
            <CardTitle className="text-2xl font-bold">
              {lang === "ar" ? "تفاصيل المشروع" : "Project Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div
              className={`prose max-w-none ${isDark ? "prose-invert" : ""} text-base`}
              dangerouslySetInnerHTML={{ __html: project.description || "<p>-</p>" }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* الرؤية */}
      {project.vision && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 rounded-xl h-full">
            <h3 className="text-lg font-semibold mb-2">{lang === "ar" ? "الرؤية" : "Vision"}</h3>
            <p className={subText}>{project.vision}</p>
          </Card>
        </motion.div>
      )}

      {/* المميزات */}
      {safeArray(project.features).length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 rounded-xl h-full">
            <h3 className="text-lg font-semibold mb-3">{lang === "ar" ? "المميزات" : "Features"}</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {safeArray(project.features).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* التحديات */}
      {safeArray(project.challenges).length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 rounded-xl h-full">
            <h3 className="text-lg font-semibold mb-3">{lang === "ar" ? "التحديات" : "Challenges"}</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {safeArray(project.challenges).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* الحلول */}
      {safeArray(project.solutions).length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 rounded-xl h-full">
            <h3 className="text-lg font-semibold mb-3">{lang === "ar" ? "الحلول" : "Solutions"}</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {safeArray(project.solutions).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectDetails;
