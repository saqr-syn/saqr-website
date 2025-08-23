// File: src/components/projects_components/ReviewModal.js

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FaStar } from "react-icons/fa";

// --- Reusable Rating Component ---
const RatingInput = ({ rating, onRatingChange, theme }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const currentRating = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={currentRating}
              onClick={() => onRatingChange(currentRating)}
              className="hidden"
            />
            <FaStar
              className={`cursor-pointer transition-colors duration-300 ${
                currentRating <= rating
                  ? "text-yellow-400" // Filled star color
                  : theme === "dark"
                  ? "text-gray-600" // Unfilled dark mode
                  : "text-gray-300" // Unfilled light mode
              }`}
              size={20}
            />
          </label>
        );
      })}
    </div>
  );
};

// --- Main Review Modal Component ---
export default function ReviewModal({ show, onClose, reviewForm, setReviewForm, onSubmit }) {
  const { theme } = useTheme();
  const reviewTextRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const el = reviewTextRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.max(80, el.scrollHeight) + "px";
  }, [reviewForm.comment, show]);

  if (!show) return null;

  // Dynamic colors based on theme
  const modalBg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const modalTextColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const inputBorder = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBg = theme === "dark" ? "bg-gray-800" : "bg-gray-50";
  const inputTextColor = theme === "dark" ? "text-white" : "text-gray-900";
  const inputPlaceholderColor = theme === "dark" ? "placeholder-gray-500" : "placeholder-gray-400";
  const btnStyle = `px-5 py-2 rounded-lg font-semibold transition-all duration-300`;
  const cancelBtnStyle = theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl w-[95%] sm:w-96 p-8 relative shadow-2xl ${modalBg} ${modalTextColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-5">Add Your Review</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={reviewForm.user}
          onChange={(e) => setReviewForm({ ...reviewForm, user: e.target.value })}
          className={`w-full p-3 mb-3 rounded-lg border ${inputBorder} ${inputBg} ${inputTextColor} ${inputPlaceholderColor} focus:outline-none focus:ring-2 focus:ring-[#a454ff] transition-all duration-300`}
        />
        <textarea
          ref={reviewTextRef}
          placeholder="What do you think of this project?"
          value={reviewForm.comment}
          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          className={`w-full p-3 mb-3 rounded-lg border ${inputBorder} ${inputBg} ${inputTextColor} ${inputPlaceholderColor} resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#a454ff] transition-all duration-300`}
        />

        <div className="flex items-center justify-between mb-5">
          <span className="font-medium">Your Rating:</span>
          <RatingInput
            rating={reviewForm.rating}
            onRatingChange={(newRating) => setReviewForm({ ...reviewForm, rating: newRating })}
            theme={theme}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className={`${btnStyle} ${cancelBtnStyle}`}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={`${btnStyle} bg-gradient-to-r from-[#6b63ff] to-[#a454ff] text-white hover:scale-105`}
          >
            Submit
          </button>
        </div>
      </div>
    </motion.div>
  );
}