// utils/admin/ToggleFeatured.ts
import { db } from "../firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function toggleFeaturedProject(projectSlug: string) {
  const projectRef = doc(db, "projects", projectSlug);

  try {
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) throw new Error("Project not found");

    const data = projectSnap.data();
    const featuredApps: string[] = data.featuredApps || [];

    let updatedFeatured: string[];
    if (featuredApps.includes(projectSlug)) {
      // إزالة من featuredApps
      updatedFeatured = featuredApps.filter(s => s !== projectSlug);
    } else {
      // إضافة مع التأكد من الحد الأقصى 3
      if (featuredApps.length >= 3) return false;
      updatedFeatured = [...featuredApps, projectSlug];
    }

    await updateDoc(projectRef, { featuredApps: updatedFeatured });
    return true;
  } catch (err) {
    console.error("Failed to toggle featured:", err);
    return false;
  }
}
