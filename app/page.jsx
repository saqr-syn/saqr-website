"use client";

import Hero from "./components/hero";
import About from "./components/about";
import Projects from "./components/projects";
import Testimonials from "./components/testimonials";
import Contact from "./components/contects";
import Footer from "./components/footer";

export default function HomePage() {

    return (
        <div className="bg-[#0a0e1a] text-white min-h-screen flex flex-col">
            <Hero />
            <About />
            <Projects />
            <Testimonials />
            <Contact />
            <Footer />
        </div>
    );
}
