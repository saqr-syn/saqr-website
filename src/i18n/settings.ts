export const languages = ["ar", "en"] as const;
export type Language = typeof languages[number];

export const fallbackLng: Language = "en";

export function getOptions(lang: Language = fallbackLng) {
  return {
    lng: lang,
    fallbackLng,
    supportedLngs: languages,
    defaultNS: "translation",
    interpolation: { escapeValue: false },
  };
}
