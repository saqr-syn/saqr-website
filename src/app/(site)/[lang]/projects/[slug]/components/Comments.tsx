"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/(admin)/components/ui/avatar";
import { Button } from "@/app/(admin)/components/ui/button";

interface Comment {
  id: string;
  projectId: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: Timestamp;
}

interface CurrentUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export default function Comments({
  projectId,
  currentUser,
  isDark,
  lang,
}: {
  projectId: string;
  currentUser: CurrentUser | null;
  isDark: boolean;
  lang: "en" | "ar";
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📝 ترجمة النصوص
  const t = {
    title: lang === "ar" ? "💬 التعليقات" : "💬 Comments",
    placeholder: lang === "ar" ? "اكتب تعليقك..." : "Write a comment...",
    publish: lang === "ar" ? "نشر" : "Post",
    anonymous: lang === "ar" ? "مجهول" : "Anonymous",
    submitting: lang === "ar" ? "جارٍ النشر..." : "Posting...",
  };

  useEffect(() => {
    if (!projectId) return;
    const q = query(
      collection(db, "comments"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const fetchedComments = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(fetchedComments);
    });
    return () => unsub();
  }, [projectId]);

  const handleAdd = async () => {
    if (!currentUser || !newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        projectId,
        text: newComment.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName || t.anonymous,
        userPhoto: currentUser.photoURL || "/default-avatar.png",
        createdAt: new Date(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      // Here you could show an error toast to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 shadow-lg ${
        isDark ? "bg-neutral-900 text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      <h3 className="text-lg font-semibold mb-4">{t.title}</h3>

      {/* إدخال تعليق */}
      {currentUser && (
        <div className="flex items-start gap-3 mb-6">
          <Avatar className="w-10 h-10">
            <AvatarImage src={currentUser.photoURL ?? undefined} alt={currentUser.displayName ?? 'User'} />
            <AvatarFallback>
              {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <textarea
            className={`flex-1 resize-none rounded-xl border px-4 py-2 focus:outline-none ${
              isDark
                ? "bg-neutral-800 border-neutral-700"
                : "bg-gray-50 border-gray-300"
            }`}
            placeholder={t.placeholder}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? t.submitting : t.publish}
          </Button>
        </div>
      )}

      {/* عرض التعليقات */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className={`flex items-start gap-3 p-3 rounded-xl ${
              isDark ? "bg-neutral-800" : "bg-gray-100"
            }`}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={c.userPhoto ?? undefined} alt={c.userName} />
              <AvatarFallback>
                {c.userName?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{c.userName}</p>
              <p className="text-sm">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
