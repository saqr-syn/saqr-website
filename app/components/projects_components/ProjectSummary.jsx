// File: src/components/projects_components/ProjectSummary.js
"use client";

import { BsDownload, BsGithub, BsLink45Deg } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

export default function ProjectSummary({
  project,
  purchased,
  handlePurchase,
  handleDownload,
  openWebsite,
  isMobileApp,
  theme,
}) {
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const mainTextColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const subTextColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";

  const totalRating = project.reviews?.reduce((a, r) => a + (r.rating || 0), 0) || 0;
  const avgRating = project.reviews?.length > 0
    ? (totalRating / project.reviews.length).toFixed(1)
    : "0.0";
  const fullStars = Math.floor(avgRating);

  return (
    <div className={`p-6 sm:p-8 md:p-10 rounded-2xl ${cardBg} shadow-xl border ${borderColor} space-y-8 ${mainTextColor} transition-all`}>
      
      {/* ---------------- Header: Title & Rating ---------------- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight truncate">
            {project.name}
          </h1>
          <p className={`mt-2 text-sm sm:text-base md:text-lg ${subTextColor} truncate`}>
            {project.short}
          </p>
        </div>
        <div className="flex-shrink-0 mt-4 md:mt-0 min-w-[140px] text-right">
          <div className={`text-sm sm:text-base ${subTextColor}`}>Average Rating</div>
          <div className="flex items-center justify-end gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${i < fullStars ? "text-yellow-400" : "text-gray-400"}`}
              />
            ))}
            <span className="ml-2 text-base sm:text-lg md:text-xl font-semibold">{avgRating}</span>
          </div>
        </div>
      </div>

      {/* ---------------- Project Info Grid ---------------- */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 border-t ${borderColor} pt-6`}>
        <div className={subTextColor}>Year</div>
        <div className="font-medium">{project.year}</div>

        <div className={subTextColor}>Status</div>
        <div className="font-medium">{project.status}</div>

        <div className={subTextColor}>Team</div>
        <div className="font-medium">{project.teamSize}</div>

        <div className={subTextColor}>Downloads</div>
        <div className="font-medium">{project.downloadsCount || 0}</div>
      </div>

      {/* ---------------- Actions: Purchase / Download ---------------- */}
      <div className={`border-t ${borderColor} pt-6 space-y-4`}>
        {project.paid ? (
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <div>
              <div className={subTextColor}>Paid Project</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">{project.price} USD</div>
            </div>
            {!purchased ? (
              <button
                onClick={handlePurchase}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold transition-transform hover:scale-105 shadow-lg w-full sm:w-auto"
              >
                Purchase
              </button>
            ) : (
              <div className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold shadow w-full sm:w-auto text-center">
                Purchased
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleDownload}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-lg"
          >
            <BsDownload className="w-5 h-5" /> Download App
          </button>
        )}

        {/* ---------------- Website & Code Links ---------------- */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {project.website && !isMobileApp && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={openWebsite}
              className={`flex-1 px-5 py-3 rounded-lg border text-center transition-all duration-300 hover:bg-opacity-50 ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              Live Site <BsLink45Deg className="inline ml-1" />
            </a>
          )}
          {project.codeRepo && (
            <a
              href={project.codeRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white text-center transition-transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3"
            >
              <BsGithub className="w-5 h-5" /> View Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
