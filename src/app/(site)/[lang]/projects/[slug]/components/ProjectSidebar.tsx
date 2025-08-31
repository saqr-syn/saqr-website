// src/app/(site)/projects/[slug]/components/ProjectSidebar.tsx
"use client";

import React from "react";
import { Card } from "@/app/(admin)/components/ui/card";
import { Badge } from "@/app/(admin)/components/ui/badge";
import { FaLink, FaGithub, FaDownload } from "react-icons/fa";
import { ProjectData } from "@/data/types";

interface ProjectSidebarProps {
  project: ProjectData;
  lang: string;
  isDark?: boolean;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ project, lang, isDark = false }) => {
  return (
    <aside className={`space-y-6 sticky top-28 ${isDark ? "bg-neutral-900 p-4 rounded-xl" : ""}`}>
      {/* Summary Card */}
      <Card className="p-5 rounded-2xl">
        <h4 className="text-lg font-semibold mb-3">{lang === "ar" ? "ملخص" : "Summary"}</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <div><strong>{lang === "ar" ? "الحالة" : "Status"}:</strong> <span className="ml-2">{project.status}</span></div>
          {project.year && <div><strong>{lang === "ar" ? "السنة" : "Year"}:</strong> <span className="ml-2">{project.year}</span></div>}
          {project.teamSize !== undefined && <div><strong>{lang === "ar" ? "أعضاء الفريق" : "Team Size"}:</strong> <span className="ml-2">{project.teamSize}</span></div>}
          {project.extraMetadata && Object.keys(project.extraMetadata).length > 0 && (
            <div>
              <strong>{lang === "ar" ? "بيانات إضافية" : "Extra"}:</strong>
              <div className="mt-2 text-xs space-y-1">
                {Object.entries(project.extraMetadata).map(([k, v]) => (
                  <div key={k}><span className="font-medium">{k}</span>: <span className="ml-2">{String(v)}</span></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tags Card */}
      {project.tags && project.tags.length > 0 && (
        <Card className="p-4 rounded-2xl">
          <h4 className="text-lg font-semibold mb-3">{lang === "ar" ? "وسوم" : "Tags"}</h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => <Badge key={i} className="px-3 py-1 rounded-full text-xs">{tag}</Badge>)}
          </div>
        </Card>
      )}

      {/* Links Card */}
      <Card className="p-4 rounded-2xl">
        <h4 className="text-lg font-semibold mb-3">{lang === "ar" ? "روابط" : "Links"}</h4>
        <div className="flex flex-col gap-3">
          {project.links?.website && (
            <a href={project.links.website} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-center">
              <FaLink className="inline mr-2" /> {lang === "ar" ? "زيارة الموقع" : "Visit website"}
            </a>
          )}
          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-full border text-center">
              <FaGithub className="inline mr-2" /> GitHub
            </a>
          )}
          {project.links?.mobileDownload && project.type === "mobile" && (project.price ?? 0) <= 0 && (
            <a href={project.links.mobileDownload} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-full bg-sky-600 text-white text-center">
              <FaDownload className="inline mr-2" /> {lang === "ar" ? "تحميل التطبيق" : "Download"}
            </a>
          )}
        </div>
      </Card>
    </aside>
  );
};

export default ProjectSidebar;
