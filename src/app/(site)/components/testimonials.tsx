// src/app/(site)/components/testimonials.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { motion, easeOut } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  body: string;
  rating: number;
  avatar: string;
  status: "approved" | "pending";
  projectSlug?: string;
}

export default function TestimonialsSection({ projectSlug }: { projectSlug?: string }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // ✅ Hydration fix
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        let q = query(
          collection(db, "testimonials"),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        if (projectSlug) {
          q = query(
            collection(db, "testimonials"),
            where("status", "==", "approved"),
            where("projectSlug", "==", projectSlug),
            orderBy("createdAt", "desc"),
            limit(3)
          );
        }

        const snap = await getDocs(q);
        const fetchedTestimonials = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })) as Testimonial[];
        setTestimonials(fetchedTestimonials);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [projectSlug]);

  if (!mounted) return null; // ✅ مهم لمنع mismatch

  if (loading) {
    return (
      <section className="flex justify-center items-center py-20 min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-t-4 border-sky-500 rounded-full border-t-transparent"
        ></motion.div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const isDark = theme === "dark";
  const sectionBg = isDark ? "bg-zinc-950" : "bg-gray-50";
  const cardBg = isDark ? "bg-zinc-800" : "bg-white";
  const textColor = isDark ? "text-gray-200" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-700";

  return (
    <section id="testimonials" className={`${sectionBg} py-20 transition-colors duration-500`}>
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.h2
          className={`text-3xl md:text-4xl font-extrabold text-center mb-12 ${textColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span>{t("testimonials.title")}</span>{" "}
          <span className="text-sky-500">{t("testimonials.highlight")}</span>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {testimonials.map(tst => (
            <motion.div
              key={tst.id}
              className={`rounded-3xl p-6 ${cardBg} border border-[#a454ff]/20 hover:border-[#a454ff]/50 transition-all duration-300 shadow-xl shadow-gray-700/50 dark:shadow-black/70`}
              variants={{ hidden: { opacity: 0, y: 40, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: easeOut } } }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center gap-4 mb-4">
                {tst.avatar && (
                  <img src={tst.avatar} alt={tst.name} className="w-12 h-12 rounded-full border-2 border-[#a454ff]/40 object-cover" />
                )}
                <div className="flex flex-col flex-1">
                  <h3 className={`font-semibold text-lg ${textColor}`}>{tst.name}</h3>
                  {tst.role && <p className={`text-sm ${subTextColor}`}>{tst.role}</p>}
                </div>
                {tst.rating && <div className="ml-auto text-yellow-500">{"★".repeat(tst.rating)}</div>}
              </div>
              <p className={`${subTextColor} leading-relaxed text-center md:text-left`}>“{tst.body}”</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
