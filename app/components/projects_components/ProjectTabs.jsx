// File: src/components/projects_components/ProjectTabs.js
"use client";

import { twMerge } from "tailwind-merge";
import { FaStar } from "react-icons/fa";

export default function ProjectTabs({
  project,
  activeTab,
  setActiveTab,
  theme,
  setShowReviewModal,
}) {
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const subTextColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const mainTextColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const reviewCardBg = theme === "dark" ? "bg-gray-800" : "bg-gray-50";
  const reviewCardBorder = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const activeTextColor = theme === "dark" ? "text-white" : "text-purple-700";

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl ${cardBg} shadow-xl border ${
        theme === "dark" ? "border-gray-800" : "border-gray-100"
      }`}
    >
      <div className="flex flex-wrap gap-4 sm:gap-6 border-b border-gray-700 dark:border-gray-700 mb-6">
        {["features", "stages", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative py-3 px-1 font-bold tracking-wide transition-all duration-300
              ${activeTab === tab
                ? `${activeTextColor} after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-t-lg after:bg-gradient-to-r after:from-[#6b4bff] after:to-[#a454ff]`
                : `${subTextColor} hover:text-gray-900 dark:hover:text-white`
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={twMerge(mainTextColor, "transition-all duration-300")}>
        {activeTab === "features" && (
          <ul className="list-disc pl-5 text-base sm:text-lg space-y-2">
            {project.features?.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}

        {activeTab === "stages" && (
          <div className="space-y-6">
            {project.stages?.map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className={`w-3 h-3 mt-1 rounded-full transition-colors duration-300 ${
                    s.done ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <div>
                  <div className="font-bold text-lg">{s.title}</div>
                  <div className="text-sm text-gray-500">{s.desc}</div>
                </div>
                <div className="ml-auto flex-shrink-0 text-sm font-semibold pt-1">
                  {s.done ? "✔" : "⏳"}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {project.reviews?.length === 0 ? (
              <div className={subTextColor}>No reviews yet. Be the first to add one!</div>
            ) : (
              project.reviews.map((r, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border shadow-sm ${reviewCardBg} ${reviewCardBorder}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-semibold">{r.user}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          size={16}
                          className={`
                            ${starIndex < Math.floor(r.rating)
                              ? "text-yellow-400"
                              : theme === "dark"
                              ? "text-gray-600"
                              : "text-gray-300"
                            }
                          `}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm italic">{r.comment}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(r.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-4 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#6b4bff] to-[#a454ff] text-white font-semibold hover:scale-[1.02] transition-transform shadow-lg"
            >
              Add Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
