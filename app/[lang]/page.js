
// app/[lang]/page.js

"use client"
// بنستورد الـ 'use' Hook الجديد من 'react'
import { use } from 'react';
import Navbar from '../components/navbar';
import Hero from '../components/hero';
import About from '../components/about';
import Projects from '../components/projects';
import Contact from '../components/contects';
import Footer from '../components/footer';
import Testimonials from '../components/testimonials';

// ده الكود الجديد اللي لازم تعتمد عليه
export default function HomePage({ params }) {
    // بنستخدم use() لـ unwrap الـ params قبل ما نوصل للمحتوى
    // use() بيقدر يتعامل مع الـ Promise بشكل صحيح
    const unwrappedParams = use(params);
    const lang = unwrappedParams.lang || "en";

    // هنا ممكن تستخدم lang بشكل طبيعي
    // وممكن كمان نستخدم الـ `destructuring` مباشرة بعد الـ `use()`
    // زي كده: const { lang } = use(params);

    return (
        <div className="bg-[#0a0e1a] text-white min-h-screen flex flex-col">
            <Navbar lang={lang} />
            <Hero lang={lang} />
            <About lang={lang} />
            <Projects lang={lang} />
            <Testimonials lang={lang} />
            <Contact lang={lang} />
            <Footer lang={lang} />
        </div>
    );
}