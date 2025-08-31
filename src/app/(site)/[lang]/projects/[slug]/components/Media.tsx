// src/app/(site)/[lang]/projects/[slug]/components/Media.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaExpand } from "react-icons/fa";
import { ProjectData } from "@/data/types";

interface MediaGalleryProps {
  project: ProjectData;
  isDark?: boolean;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ project, isDark = false }) => {
  const [slide, setSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  const screenshots = useMemo(() => {
    if (!project) return [];
    return Array.isArray(project.screenshots) && project.screenshots.length > 0
      ? project.screenshots
      : project.screenshotHero
      ? [project.screenshotHero]
      : [];
  }, [project]);

  useEffect(() => {
    if (!autoPlay || screenshots.length <= 1) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % screenshots.length), 5000);
    return () => clearInterval(id);
  }, [autoPlay, screenshots.length]);

  const handleSlide = (direction: "prev" | "next") => {
    setAutoPlay(false);
    setSlide((s) => (direction === "prev" ? (s - 1 + screenshots.length) % screenshots.length : (s + 1) % screenshots.length));
  };

  const handleManualSlide = (index: number) => {
    setAutoPlay(false);
    setSlide(index);
  };

  if (!project.video && screenshots.length === 0) {
    return (
      <div className="w-full h-[420px] flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-50">
        <div className="text-center">
          <div className="text-xl font-semibold">لا توجد وسائط</div>
          <div className="text-sm text-gray-500 mt-2">سيعرض المحتوى بعد إضافة صور أو فيديو</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden">
      {project.video ? (
        <div className="relative w-full h-[420px] bg-black">
          <video src={project.video} controls className="w-full h-full object-cover" />
        </div>
      ) : (
        <>
          <div className="relative w-full h-[420px] bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.45 }}
              >
                <Image src={screenshots[slide]} alt={`${project.name} screenshot`} width={1600} height={900} className="w-full h-[420px] object-cover" />
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute inset-0 flex items-end justify-between p-4 pointer-events-none">
              <div className="pointer-events-auto">
                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">{`${slide + 1} / ${screenshots.length}`}</span>
              </div>
              <div className="flex gap-2 pointer-events-auto">
                <button onClick={() => handleSlide("prev")} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition">
                  <FaChevronLeft />
                </button>
                <button onClick={() => handleSlide("next")} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition">
                  <FaChevronRight />
                </button>
                <button onClick={() => setAutoPlay(!autoPlay)} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition">
                  {autoPlay ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={() => { setAutoPlay(false); setLightboxOpen(true); }} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition">
                  <FaExpand />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {screenshots.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-2 py-1 rounded-full bg-black/40 pointer-events-auto">
                {screenshots.slice(0, 6).map((src, i) => (
                  <button key={i} onClick={() => handleManualSlide(i)} className={`w-12 h-7 rounded overflow-hidden border ${i === slide ? "border-white" : "border-white/30"} transition-all`}>
                    <Image src={src} alt={`thumb-${i}`} width={48} height={28} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6">
                <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 z-50 text-white bg-white/10 p-3 rounded-full">✕</button>
                <motion.img initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} src={screenshots[slide]} alt="lightbox" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <button onClick={() => setSlide((s) => (s - 1 + screenshots.length) % screenshots.length)} className="p-3 bg-white/10 rounded-full text-white">
                    <FaChevronLeft />
                  </button>
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <button onClick={() => setSlide((s) => (s + 1) % screenshots.length)} className="p-3 bg-white/10 rounded-full text-white">
                    <FaChevronRight />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default MediaGallery;
