export const languages = ["ar", "en"]; 
export const fallbackLng = "en";
export function getOptions(lang = fallbackLng) {
  return {
    lng: lang,
    fallbackLng,
    supportedLngs: languages,
    defaultNS: "translation",
    interpolation: { escapeValue: false },
  };
}