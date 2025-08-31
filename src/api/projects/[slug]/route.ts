// src/app/api/projects/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
// هنا بنستورد كل حاجة من firebase-admin عشان نستخدم الدوال الصحيحة
import { db } from "@/api/projects/[slug]/firebase-admin-config";

// هذا الـ Route Handler يستقبل طلب GET ويجلب بيانات المشروع
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // جلب الـ slug من الـ URL
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug parameter is missing." },
        { status: 400 }
      );
    }

    // هنا يتم استخدام Admin SDK لجلب البيانات من Firestore
    // هذا لا يتأثر بقواعد الأمان (Firestore Rules) لأنه يعمل على السيرفر
    const projectsRef = db.collection("projects");
    const q = projectsRef.where("slug", "==", slug);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      // إذا لم يتم العثور على مشروع، يتم إرجاع null
      return NextResponse.json(null, { status: 404 });
    }

    const docSnapshot = querySnapshot.docs[0];
    const projectData = docSnapshot.data();

    // إرجاع بيانات المشروع كـ JSON
    return NextResponse.json({
      id: docSnapshot.id,
      ...projectData,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
