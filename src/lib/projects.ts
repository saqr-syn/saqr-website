// src/lib/projects.ts
import { db } from "@/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getProjectBySlug(slug: string) {
  const q = query(collection(db, "projects"), where("slug", "==", slug));
  const snap = await getDocs(q);

  if (snap.empty) {
    console.warn("No project found for slug:", slug);
    return null;
  }

  return {
    id: snap.docs[0].id,
    ...snap.docs[0].data(),
  };
}
