"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { getOptions, fallbackLng } from "./settings";
import ar from "./ar.json";
import en from "./en.json";

// لو مش معمول initialize قبل كده
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      ...getOptions(),
      resources: {
        ar: { translation: ar },
        en: { translation: en },
      },
      detection: {
        order: ["path", "cookie", "htmlTag"],
        caches: ["cookie"],
      },
    });
}

export default i18n;
