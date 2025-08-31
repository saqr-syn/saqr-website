// src/app/(site)/[lang]/page.tsx

import { Language } from "@/i18n/settings";
import Hero from "../components/hero";
import About from "../components/about";
import Projects from "../components/projects";
import Testimonials from "../components/testimonials";
import Contact from "../components/contects";
import Footer from "../components/footer";

interface HomePageProps {
  params: Promise<{ lang: Language }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const language: Language = lang || "en";

  return (
    <div className="bg-[#0a0e1a] text-white min-h-screen flex flex-col">
      <Hero lang={language} />
      <About />
      <Projects lang={language} />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}