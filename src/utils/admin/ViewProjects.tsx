// src/utils/admin/ViewProjects.tsx
import { db } from "../firebase"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// ====== Type ======
export interface Project {
  id: string;
  slug?: string;
  name: string;
  short?: string;
  description?: string;
  
  // --- المطور والفريق ---
  developer?: string;
  developerRole?: string;
  teamSize?: number;
  vision?: string;

  // --- أدوات وتقنيات ---
  tools?: string[];

  // --- الصور والفيديو ---
  screenshotHero?: string;
  screenshots?: string[];
  video?: string;

  // --- الحالة والنوع والسعر ---
  status?: "active" | "inactive" | "archived";
  type?: "web" | "mobile";
  paid?: boolean;
  price?: number;
  links?: { website?: string };

  // --- الوسوم ---
  tags?: string[];

  // --- التحديات والحلول والمميزات ---
  challenges?: string[];
  solutions?: string[];
  features?: string[];

  // --- مراحل المشروع ---
  stages?: Array<{
    title: string;
    desc: string;
    done: boolean;
    date?: string;
    eta?: string;
  }>;

  // --- بيانات إضافية مستقبلية ---
  extraMetadata?: Record<string, any>;
  ownerId?: string;
  featuredApps?: string[];
  
  [key: string]: any; // لأي بيانات مستقبلية
}

// ====== Function to fetch all projects ======
export async function getAllProjects(): Promise<Project[]> {
  if (!db) throw new Error("Firestore 'db' instance not found.");

  try {
    const colRef = collection(db, "projects");
    const q = query(colRef, orderBy("createdAt", "desc")); // ترتيب المشاريع من الأحدث للأقدم
    const snapshot = await getDocs(q);

    const projects: Project[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug ?? doc.id,
        name: data.name ?? "",
        short: data.short ?? "",
        description: data.description ?? "",
        developer: data.developer ?? "",
        developerRole: data.developerRole ?? "",
        teamSize: data.teamSize ?? 1,
        vision: data.vision ?? "",
        tools: Array.isArray(data.tools) ? data.tools : [],
        screenshotHero: data.screenshotHero ?? "",
        screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
        video: data.video ?? "",
        status: data.status ?? "inactive",
        type: data.type ?? "web",
        paid: data.paid ?? false,
        price: data.price ?? 0,
        links: data.links ?? { website: "" },
        tags: Array.isArray(data.tags) ? data.tags : [],
        challenges: Array.isArray(data.challenges) ? data.challenges : [],
        solutions: Array.isArray(data.solutions) ? data.solutions : [],
        features: Array.isArray(data.features) ? data.features : [],
        stages: Array.isArray(data.stages) ? data.stages : [],
        extraMetadata: data.extraMetadata ?? {},
        ownerId: data.ownerId ?? "",
        featuredApps: Array.isArray(data.featuredApps) ? data.featuredApps : [],
        ...data, // أي بيانات إضافية مستقبلية
      };
    });

    return projects;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return [];
  }
}

export default getAllProjects;
