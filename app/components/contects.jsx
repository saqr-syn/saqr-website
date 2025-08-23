"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Github, Linkedin, Phone } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="relative bg-gradient-to-b from-[#0a0820] to-[#100c2a] text-white py-20">
            <div className="container mx-auto px-6 md:px-12 max-w-5xl">

                {/* Title */}
                <motion.h2
                    className="text-3xl md:text-4xl font-extrabold text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    خلينا <span className="text-[#a454ff]">نبني</span> حاجة عظيمة سوا
                </motion.h2>

                <div className="flex flex-col md:flex-row gap-12">

                    {/* Contact Info */}
                    <motion.div
                        className="flex-1 space-y-6 text-right"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-lg text-gray-300">
                            عندك فكرة مشروع أو حابب نتعاون مع بعض؟
                            دايمًا مفتوح للمناقشات، التعاونات، أو الفرص الجديدة.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 justify-end">
                                <a href="mailto:mostafas@yourmail.com" className="hover:underline">mostafas@yourmail.com</a>
                                <Mail className="w-5 h-5 text-[#a454ff]" />
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                                <span dir="ltr" className="tracking-wide">+20 103 414 5441</span>
                                <Phone className="w-5 h-5 text-[#a454ff]" />
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                                <Link href="https://github.com/yourprofile" className="hover:underline">github.com/yourprofile</Link>
                                <Github className="w-5 h-5 text-[#a454ff]" />
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                                <Link href="https://linkedin.com/in/yourprofile" className="hover:underline">linkedin.com/in/yourprofile</Link>
                                <Linkedin className="w-5 h-5 text-[#a454ff]" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.form
                        className="flex-1 bg-[#141129] p-8 rounded-2xl shadow-lg space-y-6 text-right"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <label className="block text-sm mb-2">اسمك</label>
                            <input
                                type="text"
                                placeholder="اكتب اسمك هنا"
                                className="w-full px-4 py-3 rounded-xl bg-[#0a0820] border border-gray-700 text-white text-right focus:outline-none focus:border-[#a454ff]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">بريدك الإلكتروني</label>
                            <input
                                type="email"
                                placeholder="اكتب بريدك الإلكتروني"
                                className="w-full px-4 py-3 rounded-xl bg-[#0a0820] border border-gray-700 text-white text-right focus:outline-none focus:border-[#a454ff]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">رسالتك</label>
                            <textarea
                                rows="4"
                                placeholder="اكتب رسالتك هنا..."
                                className="w-full px-4 py-3 rounded-xl bg-[#0a0820] border border-gray-700 text-white text-right focus:outline-none focus:border-[#a454ff]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-6 py-3 rounded-xl bg-[#a454ff] text-[#0a0820] font-semibold shadow-lg shadow-[#a454ff]/30 hover:bg-[#8241c7] transition-colors duration-300"
                        >
                            إرسال الرسالة
                        </button>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
