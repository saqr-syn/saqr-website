// ====== Comments.tsx ======
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion"; // ✅ إصلاح الاستيراد
import { FaSpinner } from "react-icons/fa";

type Comment = {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string | null;
  comment: string;
  createdAt: Timestamp | null;
};

const Comments: React.FC<{ projectId: string; lang?: string }> = ({
  projectId,
  lang = "en",
}) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // جلب الكومنتات realtime
  useEffect(() => {
    const commentsRef = collection(db, "projects", projectId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, "id">),
        }))
      );
    });
    return () => unsub();
  }, [projectId]);

  // إضافة تعليق جديد
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage(
        lang === "ar"
          ? "يجب تسجيل الدخول لإضافة تعليق"
          : "You must be logged in to comment."
      );
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const commentsRef = collection(db, "projects", projectId, "comments");
      await addDoc(commentsRef, {
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        userPhoto: user.photoURL || null,
        comment: newComment.trim(),
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      setMessage(lang === "ar" ? "تم إرسال التعليق بنجاح!" : "Comment posted successfully!");
    } catch (err) {
      console.error(err);
      setMessage(lang === "ar" ? "خطأ أثناء إضافة التعليق" : "Error posting comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-2xl font-bold">
        {lang === "ar" ? "التعليقات" : "Comments"}
      </h2>

      {/* رسالة حالة (success/error) */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-center"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* فورم إضافة تعليق */}
      <form onSubmit={handleAddComment} className="flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={lang === "ar" ? "اكتب تعليقك..." : "Write a comment..."}
          className="flex-1 px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-gray-900 transition-colors duration-500"
          disabled={loading}
          autoComplete="off"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`px-4 py-2 rounded-2xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : lang === "ar" ? (
            "إرسال"
          ) : (
            "Post"
          )}
        </motion.button>
      </form>

      {/* عرض التعليقات */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500">
            {lang === "ar" ? "لا توجد تعليقات بعد" : "No comments yet"}
          </p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-2xl border border-gray-200 bg-gray-50 dark:bg-zinc-900 flex gap-3 items-start transition-colors duration-500"
          >
            {/* صورة المستخدم */}
            {c.userPhoto ? (
              <img
                src={c.userPhoto}
                alt={c.userName || "Anonymous"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                {(c.userName || "A")?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold">{c.userName || "Anonymous"}</p>
              <p className="text-gray-700 dark:text-gray-300">{c.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
