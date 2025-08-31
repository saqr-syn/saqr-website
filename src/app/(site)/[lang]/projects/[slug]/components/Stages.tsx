// src/app/(site)/projects/[slug]/components/Stages.tsx
"use client";

import React from "react";
import { Card } from "@/app/(admin)/components/ui/card";
import { motion, Variants } from "framer-motion";
import { ProjectData } from "@/data/types";

// Props الخاصة بالمكون
interface ProjectStagesProps {
  stages?: ProjectData["stages"];
  lang: string;
  isDark?: boolean;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const ProjectStages: React.FC<ProjectStagesProps> = ({ stages, lang, isDark = false }) => {
  if (!stages || stages.length === 0) return null;

  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const subText = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <motion.div variants={itemVariants}>
      <Card className="p-6 rounded-2xl">
        <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>
          {lang === "ar" ? "مراحل المشروع" : "Project Stages"}
        </h3>
        <div className="space-y-3">
          {stages.map((stg, i) => (
            <details key={i} className={`p-3 rounded-lg border ${isDark ? "border-neutral-800" : "border-gray-200"}`}>
              <summary className="cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      stg.done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {stg.done ? "✔" : i + 1}
                  </div>
                  <div>
                    <div className="font-medium">{stg.title}</div>
                    {stg.date && <div className={`text-xs ${subText}`}>{stg.date}</div>}
                  </div>
                </div>
                <div className={`text-sm ${subText}`}>
                  {stg.eta ? `${lang === "ar" ? "المتوقع" : "ETA"}: ${stg.eta}` : ""}
                </div>
              </summary>
              <div className={`mt-3 text-sm ${subText}`}>{stg.desc}</div>
            </details>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectStages;
