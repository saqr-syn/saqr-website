"use client";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0820] border-t border-[#1f1b3d] text-gray-400 py-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-right">

        {/* Left: Logo + Rights */}
        <div className="text-center md:text-right">
          <h3 className="text-white font-extrabold text-xl mb-2">
            مصطفى <span className="text-[#a454ff]">صقر</span>
          </h3>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} مصطفى صقر. كل الحقوق محفوظة.
          </p>
        </div>

        {/* Middle: Nav */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-[#a454ff] transition">الرئيسية</Link>
          <Link href="/#about" className="hover:text-[#a454ff] transition">من أنا</Link>
          <Link href="/#projects" className="hover:text-[#a454ff] transition">المشاريع</Link>
          <Link href="/#contact" className="hover:text-[#a454ff] transition">تواصل معي</Link>
        </nav>

        {/* Right: Social Icons */}
        <div className="flex gap-5">
          <Link href="https://github.com/" target="_blank" className="hover:text-[#a454ff] transition">
            <Github className="w-5 h-5" />
          </Link>
          <Link href="https://linkedin.com/" target="_blank" className="hover:text-[#a454ff] transition">
            <Linkedin className="w-5 h-5" />
          </Link>
          <Link href="https://twitter.com/" target="_blank" className="hover:text-[#a454ff] transition">
            <Twitter className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Bottom Small Line */}
      <div className="text-center mt-8 text-xs text-gray-500">
        "نكتب المستقبل، فكرة ذكية وراء الأخرى."
      </div>
    </footer>
  );
}
