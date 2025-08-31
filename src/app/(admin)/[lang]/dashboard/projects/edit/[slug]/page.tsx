"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/utils/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/(admin)/components/ui/card";
import { Button } from "@/app/(admin)/components/ui/button";
import { FaSpinner } from "react-icons/fa";
import { InputField, AnimatedSelect } from "@/components/InputField";
import { themeColors } from "@/utils/theme";
import { useTheme } from "next-themes";

import { ProjectData } from "@/data/types";  // النوع هنا
import { getAuth } from "firebase/auth";

// ====== Motion Variants ======
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 } }
};
const itemVariants = { hidden: { opacity: 0, y: 10, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } } };

// ====== Component ======
const EditProject = () => {
  const { slug } = useParams() as { slug: string };
  const { t } = useTranslation();
  const router = useRouter();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();

  // ====== Fetch Project ======
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "projects", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProjectData({ id: docSnap.id, ...(docSnap.data() as ProjectData) });
        else console.error("Project not found");
      } catch (err) {
        console.error("Error fetching project:", err);
      }
      setLoading(false);
    };
    fetchProject();
  }, [slug]);

  // ====== Handlers ======
  const handleSave = async () => {
    if (!projectData) return;
    setSaving(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        setSaving(false);
        return;
      }

      const docRef = doc(db, "projects", projectData.id!);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("Project not found");
        setSaving(false);
        return;
      }

      // التأكد من صلاحية المستخدم: صاحب المشروع أو admin
      const project = docSnap.data();
      const isOwner = project.ownerId === user.uid;
      const isAdmin = (user as any).admin === true; // لو عندك token.admin

      if (!isOwner && !isAdmin) {
        console.error("You don't have permission to update this project.");
        setSaving(false);
        return;
      }

      const { id, ...data } = projectData;
      await updateDoc(docRef, { ...data, ownerId: user.uid, updatedAt: serverTimestamp() });

      router.push(`/${t("lang")}/dashboard/projects/${projectData.id}`);
    } catch (err) {
      console.error("Failed to save:", err);
    }

    setSaving(false);
  };


  const handleChange = <K extends keyof ProjectData>(field: K, value: ProjectData[K]) => {
    setProjectData({ ...projectData!, [field]: value });
  };

  const handleArrayChange = (field: keyof ProjectData, value: string, action: "add" | "remove") => {
    let arr = Array.isArray(projectData?.[field]) ? [...(projectData[field] as any[])] : [];
    if (action === "add" && value) arr.push(value);
    if (action === "remove") arr = arr.filter(v => v !== value);
    setProjectData({ ...projectData!, [field]: arr });
  };

  const handleScreenshotAdd = (url: string) => handleArrayChange("screenshots", url, "add");
  const handleScreenshotRemove = (index: number) => {
    const arr = [...(projectData?.screenshots || [])];
    arr.splice(index, 1);
    setProjectData({ ...projectData!, screenshots: arr });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-300">
        <FaSpinner className="animate-spin h-8 w-8 text-sky-500 mr-3" />
        <span className="font-medium">{t("editProject.loading")}...</span>
      </div>
    );

  if (!projectData)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-bold">
        {t("editProject.notFound")}
      </div>
    );

  return (
    <motion.div
      className={`${themeColors[theme === "dark" ? "dark" : "light"].bg} min-h-screen p-8 transition-colors duration-500`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="max-w-5xl mx-auto p-6 rounded-3xl shadow-2xl dark:shadow-sky-500/10">
        <CardHeader className="border-b dark:border-gray-800 pb-4 mb-4">
          <CardTitle className="text-3xl font-bold">{t("editProject.title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.name")}
              id="name"
              type="text"
              value={projectData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Short Description */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.shortDescription")}
              id="short"
              type="text"
              value={projectData.short}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("short", e.target.value)}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Full Description */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.fullDescription")}
              id="description"
              type="textarea"
              value={projectData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("description", e.target.value)}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Hero Image */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.heroImage")}
              id="screenshotHero"
              type="text"
              value={projectData.screenshotHero || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("screenshotHero", e.target.value)}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Screenshots */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.screenshots")}
              id="screenshots"
              type="image-upload"
              images={projectData.screenshots || []}
              onImageAdd={handleScreenshotAdd}
              onImageRemove={handleScreenshotRemove}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Price & Paid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <InputField
                label={t("editProject.price")}
                id="price"
                type="number"
                value={projectData.price || 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("price", parseFloat(e.target.value))}
                theme={theme === "dark" ? "dark" : "light"}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedSelect
                label={t("editProject.paid")}
                id="paid"
                options={[
                  { value: "true", label: t("editProject.paidOption") },
                  { value: "false", label: t("editProject.freeOption") }
                ]}
                value={projectData.paid ? "true" : "false"}
                onChange={(v) => handleChange("paid", v === "true")}
                theme={theme === "dark" ? "dark" : "light"}
              />
            </motion.div>
          </div>

          {/* Status & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <AnimatedSelect
                label={t("editProject.status")}
                id="status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "archived", label: "Archived" }
                ]}
                value={projectData.status}
                onChange={(v) => handleChange("status", v as ProjectData["status"])}
                theme={theme === "dark" ? "dark" : "light"}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedSelect
                label={t("editProject.type")}
                id="type"
                options={[
                  { value: "web", label: "Web" },
                  { value: "mobile", label: "Mobile" }
                ]}
                value={projectData.type}
                onChange={(v) => handleChange("type", v as ProjectData["type"])}
                theme={theme === "dark" ? "dark" : "light"}
              />
            </motion.div>
          </div>

          {/* Developer */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.developer")}
              id="developer"
              type="text"
              value={projectData.developer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("developer", e.target.value)}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Tools */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.tools")}
              id="tools"
              type="textarea"
              value={projectData.tools.join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "tools",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Tags */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.tags")}
              id="tags"
              type="textarea"
              value={projectData.tags.join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "tags",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Links */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.website")}
              id="website"
              type="text"
              value={projectData?.links?.website || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("links", { ...projectData.links, website: e.target.value })
              }
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Video */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.video")}
              id="video"
              type="text"
              value={projectData.video || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("video", e.target.value)}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Vision */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.vision")}
              id="vision"
              type="textarea"
              value={projectData.vision || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("vision", e.target.value)}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.features")}
              id="features"
              type="textarea"
              value={(projectData.features || []).join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "features",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Challenges */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.challenges")}
              id="challenges"
              type="textarea"
              value={(projectData.challenges || []).join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "challenges",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Solutions */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.solutions")}
              id="solutions"
              type="textarea"
              value={(projectData.solutions || []).join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "solutions",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Stages */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.stages")}
              id="stages"
              type="textarea"
              placeholder="مرحلة1|الوصف|true,مرحلة2|الوصف|false"
              value={(projectData.stages || [])
                .map((s) => `${s.title}|${s.desc}|${s.done}`)
                .join(",")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "stages",
                  e.target.value.split(",").map((v: string) => {
                    const [title, desc, done] = v.split("|");
                    return { title: title.trim(), desc: desc.trim(), done: done === "true" };
                  })
                )
              }
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Team Size */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.teamSize")}
              id="teamSize"
              type="number"
              value={projectData.teamSize || 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("teamSize", parseInt(e.target.value))}
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>

          {/* Extra Metadata */}
          <motion.div variants={itemVariants}>
            <InputField
              label={t("editProject.extraMetadata")}
              id="extraMetadata"
              type="textarea"
              placeholder="key1:value1,key2:value2"
              value={projectData.extraMetadata
                ? Object.entries(projectData.extraMetadata)
                  .map(([k, v]) => `${k}:${v}`)
                  .join(",")
                : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "extraMetadata",
                  Object.fromEntries(
                    e.target.value.split(",").map((pair) => {
                      const [k, v] = pair.split(":");
                      return [k.trim(), v.trim()];
                    })
                  )
                )
              }
              theme={theme === "dark" ? "dark" : "light"}
            />
          </motion.div>
        </CardContent>

        <CardFooter className="pt-4 border-t dark:border-gray-800 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <FaSpinner className="animate-spin mr-2" /> : null}
            {t("editProject.save")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EditProject;
