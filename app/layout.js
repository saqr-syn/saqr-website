// src/app/layout.js

import "./globals.css";
import { dir } from "i18next";
import { languages } from "./i18n/settings";
import { ThemeProvider } from "next-themes";
import I18nProvider from "./i18n/client-provider";
import Navbar from "./components/navbar";

// ----------------------------------------------------
// 1- SEO & Social Media Metadata
// تم تعديل كل الأوصاف و الكلمات المفتاحية عشان تكون على اسم saqr-syn
// ----------------------------------------------------
export const metadata = {
  title: "Saqr-SYN | Full-Stack Developer & مبتكر تقني",
  description:
    "Saqr-SYN | استوديو تطوير ويب شغوف ببناء تطبيقات قوية وآمنة وسهلة الاستخدام. متخصصون في Next.js, Flutter, و Firebase.",
  keywords:
    "Saqr, Saqr-SYN, Full-Stack Developer, مطور ويب, Next.js, React, Flutter, Node.js, Firebase, Web Development, Software Engineering, تطوير تطبيقات, Whispr, Portfolio",
  authors: [{ name: "Saqr-SYN" }], // تم تغيير الاسم هنا
  robots: "index, follow",

  openGraph: {
    title: "Saqr-SYN | Full-Stack Developer & مبتكر تقني",
    description:
      "Saqr-SYN | مطور Full-Stack شغوف ببناء تطبيقات حديثة باستخدام Next.js, Flutter, Firebase.", // تم تغيير الوصف هنا
    url: "https://saqr-syn.vercel.app",
    siteName: "Saqr-SYN",
    images: [
      {
        url: "https://saqr-syn.vercel.app/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Saqr-SYN Portfolio Preview",
      },
    ],
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG", "ar_SA"],
  },

  twitter: {
    card: "summary_large_image",
    site: "@SaqrSYN", // تم تغيير الـ Twitter handle
    creator: "@SaqrSYN", // تم تغيير الـ Twitter handle
    title: "Saqr-SYN | Full-Stack Developer & مبتكر تقني",
    description:
      "Full-Stack Developer | مطور ويب شغوف ببناء تطبيقات قوية وآمنة وسهلة الاستخدام.",
    images: ["https://saqr-syn.vercel.app/images/og-image.jpg"],
  },
};


// ----------------------------------------------------
// 2- Generate Static Params for i18n
// ----------------------------------------------------
export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

// ----------------------------------------------------
// 3- RootLayout Component
// ----------------------------------------------------
export default function RootLayout({ children, params }) {
  const lang = params?.lang || "en";

  return (
    <html lang={lang} dir={dir(lang)} suppressHydrationWarning>
      <head>
        {/* You can add more meta tags here if needed */}
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            <Navbar lang={lang} /> {/* Pass the language prop */}
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}