"use client";

// استيراد المكتبات الضرورية
// Importing necessary libraries
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import projectData from "@/data/fake_data";
import { motion, AnimatePresence } from "framer-motion";

// إعدادات الحركة (Fade & Slide)
// The settings for the fade and slide animation.
const fadeSlideUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  viewport: { once: true, amount: 0.3 }
};

// إعدادات الـ Staggered Animations للعناصر المتكررة
// Settings for staggered animations for repeated elements.
const staggerContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ProjectDetail = ({ params }) => {
  // استخدام React.use() لفك الـ Promise من params لحل المشكلة
  // Using React.use() to unwrap the params Promise to fix the issue.
  const { slug, lang } = params;
  const router = useRouter();
  const { theme, systemTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [slide, setSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // البحث عن بيانات المشروع باستخدام الـ slug
  // Finding project data using the slug
  const project = projectData[slug];

  // استخدام useMemo لتحسين أداء التعامل مع الصور
  // Using useMemo to optimize image handling performance
  const screenshots = useMemo(() => {
    const list = Array.isArray(project?.screenshots) && project.screenshots.length > 0
      ? project.screenshots
      : project?.screenshotHero ? [project.screenshotHero] : [];
    return list;
  }, [project]);

  // حساب متوسط التقييمات
  // Calculating the average rating
  const avgRating = useMemo(() => {
    if (!project?.reviews || project.reviews.length === 0) return null;
    const sum = project.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / project.reviews.length).toFixed(1);
  }, [project]);

  useEffect(() => setMounted(true), []);

  if (!mounted || !project) {
    return (
      // شاشة التحميل
      // Loading screen
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-gray-500 transition-colors duration-500">
        Loading...
      </div>
    );
  }

  // تحديد الثيم الحالي (ليلي أو نهاري)
  // Determining the current theme (light or dark).
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const nextSlide = () => setSlide((s) => (s + 1) % screenshots.length);
  const prevSlide = () => setSlide((s) => (s - 1 + screenshots.length) % screenshots.length);

  // المتغيرات الديناميكية للألوان والظلال حسب الثيم
  // Dynamic variables for colors and shadows based on the theme.
  const mainButtonClass = isDark
    ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600"
    : "bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600";

  const secondaryButtonClass = isDark
    ? "border-cyan-500 hover:border-cyan-600 text-cyan-500 hover:text-cyan-600"
    : "border-pink-500 hover:border-pink-600 text-pink-500 hover:text-pink-600";

  // تم تعديل ظلال الكاردز لتناسب الثيم
  // Card shadows have been adjusted to suit the theme
  const cardShadowClass = isDark
    ? "shadow-[0_5px_15px_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.15),0_15px_30px_rgba(0,0,0,0.1)]"
    : "shadow-[0_5px_15px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.1),0_15px_30px_rgba(0,0,0,0.05)]";

  // الألوان الأساسية للخلفيات والنصوص حسب الثيم
  // Core colors for backgrounds and text based on the theme
  const bgColor = isDark ? "bg-black" : "bg-gray-100"; // رجعت bg-gray-100
  const textColor = isDark ? "text-gray-200" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-700";
  const cardBg = isDark ? "bg-[#1a1635]" : "bg-white";
  const badgeBg = isDark ? "bg-[#0a0e1a]" : "bg-[#f0f0f0]"; // رجعت bg-[#f0f0f0]
  const badgeText = isDark ? "text-gray-200" : "text-gray-900";
  const badgeBorder = isDark ? "border-[#a454ff]/40" : "border-[#a454ff]/40"; // رجعت border-[#a454ff]/40
  const titleColor = "text-sky-500";
  const glowShadow = isDark ? "shadow-[0_0_12px_rgba(129,230,217,0.8)]" : "shadow-[0_0_10px_rgba(155,89,182,0.7)]";


  return (
    <motion.div
      className={`min-h-screen pt-24 px-6 md:px-12 pb-20 ${bgColor} transition-colors duration-500 ${textColor}`}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    >

      {/* Header - يتضمن زر الرجوع والمعلومات الأساسية */}
      {/* Header - includes the back button and basic info. */}
      <motion.div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6" variants={staggerItem}>
        <div className="flex items-center gap-4">
          <motion.button
            // تم تعديل هذا السطر ليتأكد من لغة الموقع قبل تحديد مسار الرجوع
            // This line was modified to check the site's language before setting the return path.
            onClick={() => router.push(`/${lang}/projects`)}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl border border-gray-400/30 hover:border-purple-500 dark:hover:border-sky-300 transition-colors duration-500 ${textColor} hover:scale-105`}
          >
            {lang === "ar" ? "‹ رجوع" : "‹ Back"}
          </motion.button>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-1">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 dark:from-fuchsia-500 dark:to-cyan-500`}>
                {project.name}
              </span>
            </h1>
            <p className={`text-sm ${subTextColor}`}>{project.short}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          {avgRating && (
            <div className={`text-center px-4 py-2 rounded-xl border border-sky-300/40 ${cardBg} ${textColor} ${cardShadowClass} transition-colors duration-500`}>
              <div className="font-bold text-lg">{avgRating} ⭐</div>
              <div className={`text-xs ${subTextColor}`}>{project.reviews.length} {lang === "ar" ? "مراجعات" : "reviews"}</div>
            </div>
          )}
          <div className={`px-4 py-2 rounded-xl border border-sky-300/40 ${cardBg} text-sm ${textColor} ${cardShadowClass} transition-colors duration-500`}>
            <div>{project.year}</div>
            <div className={`text-xs ${subTextColor}`}>{project.teamSize} {lang === "ar" ? "أعضاء" : "team"}</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content - المحتوى الرئيسي (الوصف، المميزات، التحديات) */}
        {/* Main Content - Description, Features, Challenges. */}
        <div className="lg:col-span-2 space-y-10">
          {/* Carousel - معرض الصور المتحرك */}
          {/* Carousel - Image slider. */}
          {screenshots.length > 0 && (
            <motion.div {...fadeSlideUp} className={`relative rounded-3xl overflow-hidden ${cardShadowClass}`}>
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={slide}
                src={screenshots[slide]}
                alt={`${project.name} screenshot ${slide + 1}`}
                className="w-full h-72 md:h-[480px] object-cover rounded-3xl hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              />
              {screenshots.length > 1 && (
                <>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={prevSlide} className={`absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/30 text-white rounded-full p-2 hover:bg-gray-800/50 transition-colors`}>
                    ‹
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={nextSlide} className={`absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/30 text-white rounded-full p-2 hover:bg-gray-800/50 transition-colors`}>
                    ›
                  </motion.button>
                </>
              )}
            </motion.div>
          )}

          {/* Lightbox - لتكبير الصور */}
          {/* Lightbox - for enlarging images. */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxOpen(false)}
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer"
              >
                <img src={screenshots[slide]} className="max-h-[90vh] max-w-[90vw] object-contain rounded-3xl" alt="Lightbox" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video - لعرض فيديو توضيحي */}
          {/* Video - to display a demo video. */}
          {project.video && (
            <motion.div {...fadeSlideUp} className={`rounded-3xl overflow-hidden ${cardShadowClass}`}>
              <video controls className="w-full h-64 md:h-80">
                <source src={project.video} type="video/mp4" />
                {lang === "ar" ? "فيديو توضيحي" : "Demo video"}
              </video>
            </motion.div>
          )}

          {/* Description - قسم الوصف */}
          {/* Description Section. */}
          <motion.section {...fadeSlideUp} className={`p-8 ${cardBg} rounded-3xl ${cardShadowClass} transition-colors duration-500`}>
            <h2 className={`text-xl font-bold mb-3 ${titleColor}`}>{lang === "ar" ? "الوصف" : "Description"}</h2>
            <p className={`text-base leading-relaxed ${subTextColor}`}>{project.description}</p>
            <h3 className={`font-bold mt-4 mb-2 ${titleColor}`}>{lang === "ar" ? "رؤية المشروع" : "Vision"}</h3>
            <p className={`text-base leading-relaxed ${subTextColor}`}>{project.vision}</p>
          </motion.section>

          {/* Features - قسم المميزات */}
          {/* Features Section. */}
          <motion.section {...fadeSlideUp} className={`p-8 ${cardBg} rounded-3xl ${cardShadowClass} transition-colors duration-500`}>
            <h2 className={`text-xl font-bold mb-4 ${titleColor}`}>{lang === "ar" ? "المميزات" : "Features"}</h2>
            <motion.ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none" variants={staggerContainer} initial="hidden" animate="show">
              {project.features.map((f, i) => (
                <motion.li key={i} className="flex items-start gap-3" variants={staggerItem}>
                  <span className={`w-7 h-7 flex-shrink-0 mt-1 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm font-bold`}>✓</span>
                  <span className={`text-base ${subTextColor}`}>{f}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>

          {/* Challenges - قسم التحديات والحلول */}
          {/* Challenges and Solutions Section. */}
          <motion.section {...fadeSlideUp} className={`p-8 ${cardBg} rounded-3xl ${cardShadowClass} transition-colors duration-500`}>
            <h2 className={`text-xl font-bold mb-4 ${titleColor}`}>{lang === "ar" ? "التحديات والحلول" : "Challenges & Solutions"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(project.challenges || []).map((ch, i) => (
                <div key={i} className={`p-6 border ${isDark ? "border-gray-700/40" : "border-gray-300/40"} rounded-3xl ${isDark ? "bg-black/20" : "bg-gray-50"} ${cardShadowClass} transition-colors duration-500`}>
                  <div className={`font-bold mb-2 ${titleColor}`}>{lang === "ar" ? "التحدي" : "Challenge"}</div>
                  <div className={`text-sm mb-3 ${subTextColor}`}>{ch}</div>
                  <div className={`font-bold mb-1 text-green-500`}>{lang === "ar" ? "الحل" : "Solution"}</div>
                  <div className={`text-sm ${subTextColor}`}>{(project.solutions && project.solutions[i]) || project.solutions?.[0] || (lang === "ar" ? "لم يذكر حل بعد" : "No solution listed")}</div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Sidebar - الشريط الجانبي (المعلومات والروابط) */}
        {/* Sidebar - Information and links. */}
        <aside className="space-y-10 sticky top-24 h-fit">
          {/* Info Card - كارت المعلومات الأساسية */}
          {/* Info Card - Basic information card. */}
          <div className={`p-6 ${cardBg} rounded-3xl ${cardShadowClass} transition-colors duration-500`}>
            <div className="flex flex-col gap-3 text-sm">
              <div><span className={`font-bold ${titleColor}`}>{lang === "ar" ? "الحالة" : "Status"}: </span><span className={`${subTextColor}`}>{project.status}</span></div>
              <div><span className={`font-bold ${titleColor}`}>{lang === "ar" ? "السنة" : "Year"}: </span><span className={`${subTextColor}`}>{project.year}</span></div>
              <div><span className={`font-bold ${titleColor}`}>{lang === "ar" ? "الفريق" : "Team"}: </span><span className={`${subTextColor}`}>{project.teamSize}</span></div>
              <div className="flex gap-2 flex-wrap mt-3">
                {(project.tags || []).map(t => (
                  <motion.span
                    key={t}
                    className={`px-3 py-1 rounded-full text-xs border ${isDark ? "border-sky-300/40" : "border-purple-300/40"} ${badgeBg} ${badgeText} transition-colors duration-500`}
                    whileHover={{ scale: 1.1, boxShadow: isDark ? "0 0 8px rgba(129,230,217,0.5)" : "0 0 8px rgba(155,89,182,0.5)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Stages - مراحل المشروع */}
          {/* Project Stages. */}
          <motion.div {...fadeSlideUp} className={`p-6 ${cardBg} rounded-3xl ${cardShadowClass} transition-colors duration-500`}>
            <h3 className={`font-bold mb-4 ${titleColor}`}>{lang === "ar" ? "مراحل المشروع" : "Stages"}</h3>
            <div className="space-y-4">
              {(project.stages || []).map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-3 h-3 flex-shrink-0 mt-2 rounded-full ${s.done ? "bg-green-500" : "bg-yellow-400"}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <div className={`font-semibold ${textColor}`}>{s.title}</div>
                      <div className={`text-xs ${subTextColor}`}>{s.date || s.eta || ""}</div>
                    </div>
                    <div className={`text-sm ${subTextColor}`}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Links - روابط المشروع */}
          {/* Project Links. */}
          <div className={`p-6 ${cardBg} rounded-3xl ${cardShadowClass} flex flex-col gap-4 transition-colors duration-500`}>
            {project.website && (
              <motion.a
                href={project.website}
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-2xl text-center font-bold text-white ${mainButtonClass} transition-all duration-300 transform-gpu hover:scale-[1.02]`}
              >
                {lang === "ar" ? "الموقع الرسمي" : "Website"}
              </motion.a>
            )}
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-2xl text-center font-bold border ${secondaryButtonClass} transition-all duration-300 transform-gpu hover:scale-[1.02]`}
              >
                GitHub
              </motion.a>
            )}
            {project.mobileDownload && (
              <motion.a
                href={project.mobileDownload}
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-center font-bold transition-all duration-300 transform-gpu hover:scale-[1.02]`}
              >
                {lang === "ar" ? "تحميل التطبيق" : "Download App"}
              </motion.a>
            )}
          </div>

          {/* Reviews - التقييمات */}
          {/* Reviews Section. */}
          <motion.div {...fadeSlideUp} className={`p-6 ${cardBg} rounded-3xl ${cardShadowClass} transition-colors duration-500`}>
            <h3 className={`font-bold mb-4 ${titleColor}`}>{lang === "ar" ? "التقييمات" : "Reviews"}</h3>
            {(project.reviews && project.reviews.length > 0) ? (
              <motion.div className="space-y-4 max-h-80 overflow-y-auto pr-2" variants={staggerContainer} initial="hidden" animate="show">
                {project.reviews.map((r, i) => (
                  <motion.div key={i} className={`p-4 rounded-3xl ${isDark ? "bg-black/20" : "bg-gray-100"} transition-colors duration-500`} variants={staggerItem}>
                    <div className="flex justify-between items-center mb-1">
                      <div className={`font-semibold ${textColor}`}>{r.user}</div>
                      <div className="text-sm text-yellow-400">⭐ {r.rating}</div>
                    </div>
                    <div className={`text-sm ${subTextColor}`}>{r.comment}</div>
                    <div className={`text-xs text-gray-500 dark:text-gray-600 mt-2`}>{r.date}</div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className={`text-base ${subTextColor} leading-relaxed`}>{lang === "ar" ? "لا يوجد تقييمات بعد" : "No reviews yet"}</div>
            )}
          </motion.div>
        </aside>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;