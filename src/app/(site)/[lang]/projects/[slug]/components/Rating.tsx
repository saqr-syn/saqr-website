// src/app/(site)/projects/[slug]/components/Rating.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { doc, updateDoc, increment, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { ProjectData } from "@/data/types";
import { User } from "firebase/auth";
import { toast } from "sonner";

interface RatingProps {
  projectId: string;
  votes?: ProjectData["votes"];
  currentUser: User | null; // ✅ المستخدم الحالي
}

const Rating: React.FC<RatingProps> = ({ projectId, votes: initialVotes, currentUser }) => {
  const user = currentUser;

  const [votes, setVotes] = useState<ProjectData["votes"]>(
    initialVotes ?? { total: 0, count: 0, users: [] }
  );
  const [userVote, setUserVote] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ استمع لأي تغييرات مباشرة من Firestore
  useEffect(() => {
    const projectRef = doc(db, "projects", projectId);
    const unsubscribe = onSnapshot(projectRef, (snap) => {
      if (snap.exists()) {
        setVotes(snap.data().votes);
      }
    });
    return () => unsubscribe();
  }, [projectId]);

  // حساب المتوسط
  const average = useMemo(() => {
    if (!votes || !votes.count) return 0;
    return votes.total / votes.count;
  }, [votes]);

  // لو المستخدم صوت قبل كده
  useEffect(() => {
    if (user && votes?.users?.includes(user.uid)) {
      setUserVote(Math.round(average));
    }
  }, [user, votes, average]);

  // التصويت
  const handleVote = async (value: number) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول للتصويت");
      return;
    }
    if (votes?.users?.includes(user.uid)) {
      toast.error("لقد صوتت بالفعل");
      return;
    }

    setLoading(true);
    try {
      const projectRef = doc(db, "projects", projectId);

      await updateDoc(projectRef, {
        "votes.total": increment(value),
        "votes.count": increment(1),
        "votes.users": arrayUnion(user.uid),
      });

      setUserVote(value); // تحديث سريع محلي
    } catch (err) {
      console.error("Vote Error:", err);
      alert("حدث خطأ أثناء التصويت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = average >= star || (userVote !== null && userVote >= star);
        const isVoted = votes?.users?.includes(user?.uid || "");

        return (
          <motion.button
            key={star}
            onClick={() => handleVote(star)}
            disabled={loading || isVoted}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            className={`text-2xl transition-all duration-200 ${filled ? "text-yellow-400" : "text-gray-300"
              } ${loading || isVoted ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-label={`Rate ${star}`}
          >
            <FaStar />
          </motion.button>
        );
      })}
      <span className="ml-3 text-sm text-muted-foreground">
        ({votes?.count || 0})
      </span>
    </div>
  );
};

export default Rating;
