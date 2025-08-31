import { db } from "@/utils/firebase";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  DocumentReference,
} from "firebase/firestore";

import { ProjectData } from "@/data/types"; // ✅ نستخدم الـ interface الأساسي

// --- ProjectPayload للـ backend، متوافق مع ProjectData ---
export interface ProjectPayload extends Partial<ProjectData> {
  // --- بيانات إضافية للـ backend فقط ---
  extraMetadata?: Record<string, string | number | boolean | null>;
  ownerId?: string;
  featuredApps?: string[];
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
  (["tools", "screenshots", "tags", "challenges", "solutions", "features"] as const).forEach(
    (key) => {
      const value = payload[key];
      if (value && !Array.isArray(value)) {
        payload[key] = String(value)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
  );

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
