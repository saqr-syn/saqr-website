// src/app/(site)/components/contects.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Github, Linkedin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useState, useEffect, FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "sonner";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  const sectionBg = isDark ? "bg-black" : "bg-gray-50";
  const formBg = isDark ? "bg-gray-800" : "bg-white";
  const inputBg = isDark ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDark ? "text-gray-200" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-700";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.preventDefault();
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      toast.success("تم إرسال الرسالة بنجاح!");
      setFormData({ name: "", email: "", message: "" }); // إعادة تعيين الفورم
    } catch (err) {
      console.error("Error sending contact message:", err);
      toast.error("حدث خطأ أثناء إرسال الرسالة.");
    }
  };

  return (
    <section id="contact" className={`${sectionBg} py-20 transition-colors duration-500`}>
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <motion.h2
          className={`text-3xl md:text-4xl font-extrabold text-center mb-12 ${textColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t("contact.title1")} <span className="text-sky-500">{t("contact.title2")}</span>
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-12">
          <motion.div
            className="flex-1 space-y-6 text-right"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className={`text-lg ${subTextColor}`}>{t("contact.intro")}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-end">
                <a href="mailto:saqr.syn@gimal.com" className={`hover:underline ${subTextColor}`}>
                  saqr.syn@gimal.com
                </a>
                <Mail className="w-5 h-5 text-sky-500" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span dir="ltr" className={`tracking-wide ${subTextColor}`}>+20 103 414 5441</span>
                <Phone className="w-5 h-5 text-sky-500" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Link href="https://github.com/saqr-syn" className={`hover:underline ${subTextColor}`}>github/saqr-syn</Link>
                <Github className="w-5 h-5 text-sky-500" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Link href="https://linkedin.com/in/yourprofile" className={`hover:underline ${subTextColor}`}>
                  linkedin.com/in/yourprofile
                </Link>
                <Linkedin className="w-5 h-5 text-sky-500" />
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className={`flex-1 ${formBg} p-8 rounded-2xl shadow-xl shadow-gray-700/50 dark:shadow-black/70 space-y-6 text-right transition-all duration-500`}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <label className={`block text-sm mb-2 ${subTextColor}`}>{t("contact.name")}</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder={t("contact.namePlaceholder")}
                className={`w-full px-4 py-3 rounded-xl ${inputBg} border border-gray-700 ${textColor} text-right focus:outline-none focus:border-sky-500`}
              />
            </div>
            <div>
              <label className={`block text-sm mb-2 ${subTextColor}`}>{t("contact.email")}</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder={t("contact.emailPlaceholder")}
                className={`w-full px-4 py-3 rounded-xl ${inputBg} border border-gray-700 ${textColor} text-right focus:outline-none focus:border-sky-500`}
              />
            </div>
            <div>
              <label className={`block text-sm mb-2 ${subTextColor}`}>{t("contact.message")}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder={t("contact.messagePlaceholder")}
                className={`w-full px-4 py-3 rounded-xl ${inputBg} border border-gray-700 ${textColor} text-right focus:outline-none focus:border-sky-500 resize-none`}
              />
            </div>

            <motion.button
              type="submit"
              className="w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300
                bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("contact.send")}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
