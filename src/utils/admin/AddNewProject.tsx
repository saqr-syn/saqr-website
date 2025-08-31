// src/utils/admin/AddNewProject.ts
import { db } from "@/utils/firebase";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  DocumentReference,
} from "firebase/firestore";

// --- ProjectPayload متوافق مع ProjectData من الواجهة ---
export interface ProjectPayload {
  id?: string;
  slug?: string;

  // --- المعلومات الأساسية ---
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
  links: { website: string };

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

  // --- مالك المشروع وتطبيقات مميزة ---
  ownerId?: string;
  featuredApps?: string[];

  [key: string]: any; // لأي بيانات إضافية مستقبلية
}

// --- validate URLs ---
function looksLikeUrl(v?: string) {
  if (!v) return false;
  return /^(https?:\/\/|\/)/.test(v);
}

// --- normalize payload ---
function normalizePayload(input: ProjectPayload): ProjectPayload {
  const payload: ProjectPayload = { ...input };

  // تحويل أي arrays من نصوص لفهرس
  ["tools", "screenshots", "tags", "challenges", "solutions", "features"].forEach((key) => {
    if (payload[key] && !Array.isArray(payload[key])) {
      payload[key] = String(payload[key])
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  });

  // تحقق من paid و price
  if (typeof payload.paid !== "boolean") payload.paid = Boolean(payload.paid);
  if (payload.price !== undefined && typeof payload.price !== "number") {
    const p = parseFloat(String(payload.price));
    payload.price = Number.isFinite(p) ? p : 0;
  }

  // تحقق من صحة روابط الصور
  if (payload.screenshots)
    payload.screenshots = payload.screenshots.filter(looksLikeUrl);
  if (payload.screenshotHero && !looksLikeUrl(payload.screenshotHero)) {
    // ممكن نخليها فاضية أو نتركها كما هي
    // payload.screenshotHero = "";
  }

  // تأكيد وجود الرابط الأساسي
  if (!payload.links) payload.links = { website: "" };
  else if (!payload.links.website) payload.links.website = "";

  // تأكيد وجود ownerId
  if (!payload.ownerId) payload.ownerId = "";

  return payload;
}

// --- إضافة مشروع جديد ---
export async function addNewProjectToFirestore(
  payload: ProjectPayload,
  userId: string // UID المستخدم الحالي
): Promise<{ id: string; ref: DocumentReference }> {
  if (!db) throw new Error("Firestore 'db' instance not found.");

  const normalized = normalizePayload(payload);

  // إضافة ownerId
  normalized.ownerId = userId;

  const stored = {
    ...normalized,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const idCandidate = normalized.slug?.trim();

  try {
    if (idCandidate) {
      const ref = doc(db, "projects", idCandidate);
      await setDoc(ref, stored, { merge: true });
      return { id: idCandidate, ref };
    } else {
      const colRef = collection(db, "projects");
      const docRef = await addDoc(colRef, stored);
      return { id: docRef.id, ref: docRef };
    }
  } catch (err) {
    console.error("Failed to save project to Firestore:", err);
    throw err;
  }
}

export default addNewProjectToFirestore;
