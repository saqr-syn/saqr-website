// app/(site)/[lang]/layout.tsx
import "./globals.css";
import { Language, languages } from "@/i18n/settings";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import I18nProvider from "@/i18n/I18nProvider";
import Navbar from "../components/navbar";
import { ReactNode } from "react";

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
  icons: { icon: "/my-logo.png" },
  openGraph: {
    title: "Saqr-SYN | Full-Stack Developer & مبتكر تقني",
    description:
      "Saqr-SYN | مطور Full-Stack شغوف ببناء تطبيقات حديثة باستخدام Next.js, Flutter, Firebase.",
    url: "https://saqr-syn.vercel.app",
    siteName: "Saqr-SYN",
    images: [
      {
        url: "https://saqr-syn.vercel.app/og-image.png",
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
    images: ["https://saqr-syn.vercel.app/og-image.png"],
  },
};

// ✅ لازم await للـ params كـ object كامل
export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: Language }>; // ⚡ Next.js 15: params بقى Promise
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params; // ✅ صح
  const language: Language = lang || "en";

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        <div data-lang={language} className="min-h-screen">
          <Navbar lang={language} />
          {children}
        </div>
      </I18nProvider>
    </NextThemesProvider>
  );
}
