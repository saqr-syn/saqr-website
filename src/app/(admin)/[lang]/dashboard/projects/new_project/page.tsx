"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Save, Image as ImageIcon, Star, Link, DollarSign, Tags, CheckSquare, Video } from "lucide-react";

import { InputField, FormSelect, AnimatedSelect } from "@/components/InputField";
import { ProjectData } from "@/data/types";
import { defaultProjectData } from "@/data/defaultProjectData";
import addNewProjectToFirestore, { ProjectPayload } from "@/utils/admin/AddNewProject";
import { getAuth } from "firebase/auth";
import { useTheme } from "next-themes";
import { themeColors } from "@/utils/theme";

// --- Animation Variants ---
const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// --- ProjectFormFields Component ---
const ProjectFormFields: React.FC<{
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  theme: "light" | "dark"; // تمرير الثيم
}> = ({ projectData, setProjectData, theme }) => {
  return (
    <div className="space-y-6">
      {/* الاسم والوصف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="اسم المشروع"
          id="name"
          type="text"
          theme={theme}
          value={projectData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectData({ ...projectData, name: e.target.value })
          }
        />
        <InputField
          label="وصف مختصر"
          id="short"
          type="text"
          theme={theme}
          value={projectData.short}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectData({ ...projectData, short: e.target.value })
          }
        />
      </div>

      <InputField
        label="وصف تفصيلي"
        id="description"
        type="textarea"
        theme={theme}
        value={projectData.description}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setProjectData({ ...projectData, description: e.target.value })
        }
      />

      {/* المطور والدور */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="اسم المطور"
          id="developer"
          type="text"
          theme={theme}
          value={projectData.developer}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectData({ ...projectData, developer: e.target.value })
          }
        />
        <InputField
          label="الدور الوظيفي (اختياري)"
          id="developerRole"
          type="text"
          theme={theme}
          value={projectData.developerRole}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectData({ ...projectData, developerRole: e.target.value })
          }
        />
        <InputField
          label="عدد أعضاء الفريق"
          id="teamSize"
          type="number"
          theme={theme}
          value={projectData.teamSize ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectData({ ...projectData, teamSize: Number(e.target.value) })
          }
        />
      </div>

      {/* رؤية المشروع */}
      <InputField
        label="رؤية المشروع"
        id="vision"
        type="textarea"
        theme={theme}
        value={projectData.vision ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setProjectData({ ...projectData, vision: e.target.value })
        }
      />

      {/* التحديات والحلول والمميزات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="التحديات"
          id="challenges"
          type="textarea"
          theme={theme}
          value={(projectData.challenges ?? []).join("\n")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectData({ ...projectData, challenges: e.target.value.split("\n") })
          }
        />
        <InputField
          label="الحلول"
          id="solutions"
          type="textarea"
          theme={theme}
          value={(projectData.solutions ?? []).join("\n")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectData({ ...projectData, solutions: e.target.value.split("\n") })
          }
        />
        <InputField
          label="المميزات"
          id="features"
          type="textarea"
          theme={theme}
          value={(projectData.features ?? []).join("\n")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectData({ ...projectData, features: e.target.value.split("\n") })
          }
        />
      </div>

      {/* مراحل المشروع */}
      <InputField
        label="مراحل المشروع (العنوان | الوصف | تم التنفيذ؟ | تاريخ | ETA)"
        id="stages"
        type="textarea"
        theme={theme}
        value={(projectData.stages ?? []).map(s => `${s.title} | ${s.desc} | ${s.done} | ${s.date ?? ""} | ${s.eta ?? ""}`).join("\n")}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const lines = e.target.value.split("\n");
          const stages = lines.map(line => {
            const [title, desc, done, date, eta] = line.split("|").map(s => s.trim());
            return { title, desc, done: done === "true", date, eta };
          });
          setProjectData({ ...projectData, stages });
        }}
      />

      {/* بيانات إضافية مستقبلية */}
      <InputField
        label="بيانات إضافية مستقبلية (JSON)"
        id="extraMetadata"
        type="textarea"
        theme={theme}
        value={JSON.stringify(projectData.extraMetadata ?? {}, null, 2)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          try {
            const obj = JSON.parse(e.target.value);
            setProjectData({ ...projectData, extraMetadata: obj });
          } catch (err) {
            console.warn("Invalid JSON for extraMetadata");
          }
        }}
      />
    </div>
  );
};

// --- ProjectImageUpload Component ---
const ProjectImageUpload: React.FC<{
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
  theme: "light" | "dark"; // إضافة prop للثيم
}> = ({ projectData, setProjectData, theme }) => {
  // إضافة صورة عند الضغط Enter
  const handleAddScreenshot = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      const screenshots = projectData.screenshots ?? []; // تأكيد وجود المصفوفة
      if (value && screenshots.length < 6) {
        setProjectData(prev => ({ ...prev, screenshots: [...screenshots, value] }));
        e.currentTarget.value = "";
      }
    }
  };

  // حذف صورة
  const handleRemoveScreenshot = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      screenshots: (prev.screenshots ?? []).filter((_, i) => i !== index),
    }));
  };

  // تحديد إذا يمكن إضافة صور جديدة
  const canAddMoreScreenshots = (projectData.screenshots ?? []).length < 6;

  return (
    <div className="space-y-4">
      <InputField
        label={
          <span className="flex items-center gap-2">
            <ImageIcon size={18} className="text-sky-500" />
            الصورة الرئيسية (Hero Screenshot)
          </span>
        }
        id="screenshotHero"
        type="text"
        theme={theme} // <-- تمرير الثيم
        value={projectData.screenshotHero}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setProjectData({ ...projectData, screenshotHero: e.target.value })
        }
      />

      <InputField
        label={
          <span className="flex items-center gap-2">
            <ImageIcon size={18} className="text-sky-500" />
            صور إضافية (Screenshots) {(projectData.screenshots ?? []).length}/6
          </span>
        }
        id="screenshots"
        type="image-upload"
        theme={theme} // <-- تمرير الثيم
        images={projectData.screenshots ?? []}
        onImageAdd={(url: string) => {
          const screenshots = projectData.screenshots ?? [];
          if (screenshots.length < 6) {
            setProjectData({ ...projectData, screenshots: [...screenshots, url] });
          }
        }}
        onImageRemove={handleRemoveScreenshot}
        className="mt-2"
      />
    </div>
  );
};



// --- NewProjectPage Component ---
export default function NewProjectPage() {
  const [projectData, setProjectData] = useState<ProjectData>(defaultProjectData);
  const { theme } = useTheme(); // dark / light
  const colors = theme === "dark" ? themeColors.dark : themeColors.light;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: ProjectPayload = {
      ...projectData,
      links: { website: projectData.links.website || "" },
      tags: projectData.tags || [],
      paid: projectData.paid ?? false,
    };

    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      const result = await addNewProjectToFirestore(payload, userId as string);
      console.log("Project added successfully with ID:", result.id);
      setProjectData(defaultProjectData);
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  };

  return (
    <div className={`${colors.bg} ${colors.text} min-h-screen transition-colors duration-500 flex items-center justify-center p-4 font-sans`}>
      <motion.form
        onSubmit={handleSubmit}
        className={`rounded-2xl shadow-xl p-8 w-full max-w-5xl space-y-8 border ${colors.cardBg}`}
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-3 text-3xl font-extrabold">
            <Sparkles className="text-sky-500 w-8 h-8" />
            إنشاء مشروع جديد
          </div>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
            أضف تفاصيل المشروع بالكامل هنا. سيتم حفظ البيانات في قاعدة بيانات Firestore.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProjectFormFields projectData={projectData} setProjectData={setProjectData} theme={(theme === "dark" ? "dark" : "light")} />
        </motion.div>

        <hr className={`border ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`} />

        <motion.div variants={itemVariants}>
          <ProjectImageUpload projectData={projectData} setProjectData={setProjectData} theme={(theme === "dark" ? "dark" : "light")} />
        </motion.div>

        <hr className={`border ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label={<span className="flex items-center gap-2"><Tags size={18} className="text-sky-500" /> الوسوم والكلمات المفتاحية</span>}
            id="tools"
            type="text"
            theme={theme}
            value={projectData.tools.join(", ")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProjectData({ ...projectData, tools: e.target.value.split(",").map((t) => t.trim()) })
            }
          />

          <AnimatedSelect
            label={<span className="flex items-center gap-2"><CheckSquare size={18} className="text-sky-500" /> حالة المشروع</span>}
            id="status"
            theme={(theme === "dark" ? "dark" : "light")}
            options={[
              { value: "active", label: "نشط" },
              { value: "inactive", label: "غير نشط" },
              { value: "archived", label: "مؤرشف" },
            ]}
            value={projectData.status}
            onChange={(val) =>
              setProjectData({ ...projectData, status: val as "active" | "inactive" | "archived" })
            }
          />

          <AnimatedSelect
            label={<span className="flex items-center gap-2"><CheckSquare size={18} className="text-sky-500" /> نوع المشروع</span>}
            id="type"
            theme={(theme === "dark" ? "dark" : "light")}
            options={[
              { value: "web", label: "ويب" },
              { value: "mobile", label: "موبايل" },
            ]}
            value={projectData.type}
            onChange={(val) =>
              setProjectData({ ...projectData, type: val as "web" | "mobile" })
            }
          />
        </div>

        <hr className={`border ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label={<span className="flex items-center gap-2"><Link size={18} className="text-sky-500" /> رابط المشروع</span>}
            id="website"
            type="text"
            theme={theme}
            value={projectData.links.website}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProjectData({ ...projectData, links: { ...projectData.links, website: e.target.value } })
            }
          />

          <InputField
            label={<span className="flex items-center gap-2"><DollarSign size={18} className="text-sky-500" /> السعر ($)</span>}
            id="price"
            type="number"
            theme={theme}
            value={projectData.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectData({ ...projectData, price: Number(e.target.value) })}
          />
        </div>

        <motion.div variants={itemVariants} className="flex justify-end gap-3 flex-wrap pt-4">
          <button
            type="reset"
            className={`px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md hover:scale-105 ${theme === "dark" ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            onClick={() => setProjectData(defaultProjectData)}
          >
            إعادة تعيين
          </button>
          <button
            type="submit"
            className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors duration-300 shadow-md hover:scale-105 ${theme === "dark" ? "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-500/30" : "bg-sky-500 text-white hover:bg-sky-600 shadow-sky-300/30"}`}
          >
            <Save size={20} />
            إنشاء المشروع
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
}
