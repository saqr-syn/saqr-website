// utils/admin/DeleteProject.ts
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteProject(projectId: string) {
  try {
    await deleteDoc(doc(db, "projects", projectId));
    return true;
  } catch (err) {
    console.error("Failed to delete project:", err);
    return false;
  }
}
