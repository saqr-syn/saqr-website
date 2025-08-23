// src/app/layout.js

import "./globals.css";
import { dir } from "i18next";
import { languages } from "./i18n/settings";
import { ThemeProvider } from "next-themes";
import I18nProvider from "./i18n/client-provider";
import Navbar from "./components/navbar";

// ----------------------------------------------------
// SEO & Social Media Metadata
// ----------------------------------------------------
export const metadata = {
  title: "Saqr-SYN | Full-Stack Developer & مبتكر تقني",
  description:
    "Saqr-SYN | استوديو تطوير ويب شغوف ببناء تطبيقات قوية وآمنة وسهلة الاستخدام. متخصصون في Next.js, Flutter, و Firebase.",
  keywords:
    "Saqr-SYN, Saqr, Saqr SYN, Saqr-SYN portfolio, Mostafa Saqr developer, Whispr project, Full-Stack Developer, Next.js developer, Flutter developer, React.js, Node.js, Firebase, Tailwind CSS, Backend developer, Frontend developer, Software Engineering, Full-Stack Developer Egypt, Web Developer Alexandria, مطور ويب الإسكندرية, مطور فول ستاك مصر, توظيف مطور ويب, شركات برمجة في الإسكندرية",
  authors: [{ name: "Saqr-SYN" }],
  robots: "index, follow",
  openGraph: {
    title: "Saqr-SYN | Full-Stack Developer & مبتكر تقني",
    description:
      "Saqr-SYN | مطور Full-Stack شغوف ببناء تطبيقات حديثة باستخدام Next.js, Flutter, Firebase.",
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
    site: "@SaqrSYN",
    creator: "@SaqrSYN",
    title: "Saqr-SYN | Full-Stack Developer & مبتكر تقني",
    description:
      "Full-Stack Developer | مطور ويب شغوف ببناء تطبيقات قوية وآمنة وسهلة الاستخدام.",
    images: ["https://saqr-syn.vercel.app/images/og-image.jpg"],
  },
};

// ----------------------------------------------------
// Generate Static Params for i18n
// ----------------------------------------------------
export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

// ----------------------------------------------------
// RootLayout Component
// ----------------------------------------------------
export default function RootLayout({ children, params }) {
  const lang = params?.lang || "en";

  return (
    <html lang={lang} dir={dir(lang)} suppressHydrationWarning>
      <head>
        {/* يمكن إضافة meta tags إضافية هنا */}
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            <Navbar lang={lang} />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
