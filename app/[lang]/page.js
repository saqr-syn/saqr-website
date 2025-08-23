"use client";
// app/[lang]/page.js (server component)
import Hero from "../components/hero";
import About from "../components/about";
import Projects from "../components/projects";
import Testimonials from "../components/testimonials";
import Contact from "../components/contects";
import Footer from "../components/footer";

export default function HomePage({ params }) {
    const { lang } = params; // "ar" أو "en"

    return (
        <div className="bg-[#0a0e1a] text-white min-h-screen flex flex-col">
            <Hero lang={lang} />
            <About lang={lang} />
            <Projects lang={lang} /> {/* هنا تمرر اللغة */}
            <Testimonials lang={lang} />
            <Contact lang={lang} />
            <Footer lang={lang} />
        </div>
    );
}
