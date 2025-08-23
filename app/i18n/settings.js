export const fallbackLng = "ar"; // اللغة الافتراضية

export const languages = ["ar", "en"]; // اللغات المدعومة

export function getOptions(lang = fallbackLng) {
  return {
    lng: lang,
    fallbackLng,
    supportedLngs: languages,
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  };
}
