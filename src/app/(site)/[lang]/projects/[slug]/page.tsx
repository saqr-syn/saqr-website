// src/app/(site)/projects/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { db, admin } from "@/api/projects/[slug]/firebase-admin-config";
import ProjectDetailClient from "./ProjectDetailClient";
import { ProjectData } from "@/data/types";

/** Helper: convert Firestore/Admin SDK values to plain JS values */
function convertFirestoreValue(value: any): any {
  if (value && typeof value.toDate === "function") {
    try { return value.toDate().toISOString(); } catch { return String(value); }
  }
  if (value && typeof value.path === "string" && typeof value.id === "string" && typeof value.parent !== "undefined") {
    return value.path;
  }
  if (value && typeof value.latitude === "number" && typeof value.longitude === "number") {
    return { latitude: value.latitude, longitude: value.longitude };
  }
  if (Array.isArray(value)) return value.map(convertFirestoreValue);
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) out[k] = convertFirestoreValue(v);
    return out;
  }
  return value;
}

/** Convert Firestore snapshot -> plain object */
function docSnapshotToPlain(docSnap: FirebaseFirestore.DocumentSnapshot): Record<string, any> {
  const raw = docSnap.data() || {};
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(raw)) out[k] = convertFirestoreValue(v);
  out.extraMetadata = convertFirestoreValue(out.extraMetadata ?? { views: 0 });
  return { id: docSnap.id, ...out };
}

interface ProjectPageProps {
  params: { slug: string; lang?: string };
}

export default async function ProjectDetail({ params }: ProjectPageProps) {
  const slug = params.slug || "";
  const lang = params.lang === "ar" ? "ar" : "en";

  if (!slug) return notFound();

  const projectsRef = db.collection("projects");

  // 1️⃣ البحث بالـ slug
  let qSnap = await projectsRef.where("slug", "==", slug).get();

  // 2️⃣ fallback: لو مش موجود، جرب بالـ name
  if (qSnap.empty) {
    qSnap = await projectsRef.where("name", "==", slug).get();
  }

  if (qSnap.empty) return notFound();

  const docSnap = qSnap.docs[0];
  const projectPlain = docSnapshotToPlain(docSnap) as ProjectData & { id: string };

  // 3️⃣ زيادة عدد المشاهدات
  try {
    await projectsRef.doc(docSnap.id).update({
      "extraMetadata.views": admin.firestore.FieldValue.increment(1),
    });
  } catch (err) {
    console.error("Failed to increment views:", err);
  }

  return <ProjectDetailClient project={projectPlain} lang={lang} />;
}
