// HomePage.js
"use client";

import Hero from "./components/hero";
import About from "./components/about";
import Projects from "./components/projects";
import Testimonials from "./components/testimonials";
import Contact from "./components/contects";
import Footer from "./components/footer";

// لازم تستقبل الـ"params" هنا
export default function HomePage({ params }) {

    // وهنا تاخد منها الـ"lang"
    const { lang } = params;

    return (
        <div className="bg-[#0a0e1a] text-white min-h-screen flex flex-col">
            <Hero />
            <About />
            {/* كده الـ"lang" هتوصل صح للـ"Projects" */}
            <Projects params={{ lang }} />
            <Testimonials />
            <Contact />
            <Footer />
        </div>
    );
}