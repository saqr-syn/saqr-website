"use client";

import Image from "next/image";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FiPlay } from "react-icons/fi";

export default function ProjectHero({
  project,
  theme,
  carouselIndex = 0,
  setCarouselIndex = () => {}
}) {
  const totalScreenshots = project.screenshots?.length || 0;

  const handlePrev = () =>
    totalScreenshots > 0 && setCarouselIndex((i) => (i - 1 + totalScreenshots) % totalScreenshots);
  const handleNext = () =>
    totalScreenshots > 0 && setCarouselIndex((i) => (i + 1) % totalScreenshots);

  return (
    <div className="rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Main Hero */}
      <div className="relative w-full h-80 sm:h-96 lg:h-[34rem] bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden">
        {project.video ? (
          <div className="relative w-full h-full">
            <video
              src={project.video}
              controls
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <FiPlay size={48} className="text-white" />
            </div>
          </div>
        ) : totalScreenshots > 0 ? (
          <Image
            src={project.screenshots[carouselIndex]}
            alt={`${project.name} screenshot ${carouselIndex + 1}`}
            fill
            priority={carouselIndex === 0} // اول صورة نعملها priority
            style={{ objectFit: "cover" }}
            className="rounded-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Carousel Controls */}
      {totalScreenshots > 1 && (
        <div className="mt-4 flex items-center justify-between gap-2">
          {/* Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
            {project.screenshots.map((s, idx) => (
              <button
                key={s + idx}
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Open screenshot ${idx + 1}`}
                className={`w-20 h-12 rounded-lg overflow-hidden transition-transform duration-200 transform hover:scale-105 border-2 ${
                  carouselIndex === idx
                    ? "border-purple-500 shadow-lg"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={s}
                  alt={`${project.name} thumb ${idx + 1}`}
                  width={80}
                  height={48}
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>

          {/* Prev/Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous screenshot"
              className={`p-2 rounded-full transition-transform duration-200 hover:scale-110 ${
                theme === "dark" ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <BsArrowLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next screenshot"
              className={`p-2 rounded-full transition-transform duration-200 hover:scale-110 ${
                theme === "dark" ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <BsArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
