"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { db } from "@/utils/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/(admin)/components/ui/card";
import { Badge } from "@/app/(admin)/components/ui/badge";
import { FaStar } from "react-icons/fa";
import { ProjectData } from "@/data/types";

const PAGE_SIZE = 12;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 12, stiffness: 120 } },
};

/** Skeleton single card */
const CardSkeleton = () => (
  <div className="rounded-3xl overflow-hidden shadow-lg animate-pulse">
    <div className="bg-gray-200 dark:bg-zinc-800 w-full aspect-[16/9]" />
    <div className="p-4">
      <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full mb-3" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
        <div className="h-6 w-12 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  </div>
);

const ViewAllProjects: React.FC = () => {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : Array.isArray(params?.lang) ? params.lang[0] : "en";

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // --- Hooks ثابتة قبل أي شرط ---
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [queryText, setQueryText] = useState("");

  // --- Effect للـ mount ---
  useEffect(() => setMounted(true), []);

  // --- Fetch أول صفحة ---
  useEffect(() => {
    let mountedFlag = true;
    const fetchFirst = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
        const snap = await getDocs(q);
        if (!mountedFlag) return;
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as ProjectData),
        })) as ProjectData[];
        setProjects(docs);
        setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.docs.length === PAGE_SIZE);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        if (mountedFlag) setLoading(false);
      }
    };
    fetchFirst();
    return () => { mountedFlag = false; };
  }, []);

  // --- Load more ---
  const loadMore = async () => {
    if (!lastDoc) return setHasMore(false);
    setLoadingMore(true);
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(PAGE_SIZE));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as ProjectData),
      })) as ProjectData[];
      setProjects((p) => [...p, ...docs]);
      setLastDoc(snap.docs[snap.docs.length - 1] ?? lastDoc);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("loadMore failed", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // --- Tags derived ---
  const tags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => (p.tags || []).forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  // --- Filtered visible projects ---
  const visible = useMemo(() => {
    return projects.filter((p) => {
      if (selectedTag && !(p.tags || []).includes(selectedTag)) return false;
      if (queryText.trim()) {
        const q = queryText.trim().toLowerCase();
        return (p.name || "").toLowerCase().includes(q) ||
               (p.short || "").toLowerCase().includes(q) ||
               (p.tags || []).some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [projects, selectedTag, queryText]);

  // --- Render placeholder قبل mount ---
  if (!mounted) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen pt-24 pb-20 px-6 md:px-12 ${isDark ? "bg-neutral-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">
          مشاريعي
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSelectedTag(null)} className={`px-3 py-1 rounded-full border ${selectedTag === null ? "bg-sky-500 text-white" : ""}`}>All</button>
            {tags.slice(0, 20).map((t) => (
              <button key={t} onClick={() => setSelectedTag(t)} className={`px-3 py-1 rounded-full border ${selectedTag === t ? "bg-sky-500 text-white" : ""}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              value={queryText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQueryText(e.target.value)}
              placeholder="Search name / tag"
              className="px-4 py-2 rounded-lg border bg-transparent outline-none"
            />
            <button onClick={() => { setQueryText(""); setSelectedTag(null); }} className="px-3 py-2 rounded-lg border">Reset</button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visible.map((proj) => (
                <Link key={proj.id} href={`/${lang}/projects/${proj.id}`} className="block">
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.03, y: -6 }} className="cursor-pointer">
                    <Card className={`rounded-3xl overflow-hidden shadow-md ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                      {proj.screenshotHero ? (
                        <div className="relative w-full aspect-[16/9]">
                          <Image src={proj.screenshotHero} alt={proj.name} fill className="object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      ) : (
                        <div className="w-full aspect-[16/9] bg-gradient-to-r from-gray-100 to-gray-50 flex items-center justify-center text-gray-400">No image</div>
                      )}

                      <CardHeader className="p-4">
                        <CardTitle className="text-lg font-bold">{proj.name}</CardTitle>
                        <p className="text-sm text-gray-500">{proj.short}</p>
                      </CardHeader>

                      <CardContent className="p-4 pt-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(proj.tags || []).slice(0, 5).map((tag) => (
                            <Badge key={tag} className="px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-sky-500 hover:text-white" onClick={() => setSelectedTag(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            <div className="mt-8 flex justify-center">
              {hasMore ? (
                <button onClick={loadMore} disabled={loadingMore} className="px-6 py-3 rounded-full bg-sky-500 text-white shadow-md">
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              ) : (
                <div className="text-sm text-gray-400">No more projects</div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ViewAllProjects;
