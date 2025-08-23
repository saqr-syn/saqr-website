"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "أحمد علي",
    role: "رائد أعمال",
    feedback:
      "مصطفى ساعدني أحول فكرتي لتطبيق شغال بسرعة وأمان. شخص ملتزم وذكي جدًا في الحلول.",
    avatar: "/avatars/client1.png",
  },
  {
    name: "سارة إبراهيم",
    role: "مديرة منتج",
    feedback:
      "شغله معايا في المشروع كان منظم وسلس جدًا. بيعرف يوازن بين الإبداع والأداء.",
    avatar: "/avatars/client2.png",
  },
  {
    name: "محمد حسن",
    role: "مطور",
    feedback:
      "اتعلمت كتير من أسلوبه. خبرة قوية في Flutter و Next.js، وبيدمجهم بشكل عبقري.",
    avatar: "/avatars/client3.png",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-[#0a0820] text-white py-20">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        {/* Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          آراء <span className="text-[#a454ff]">العملاء</span>
        </motion.h2>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-[#14122b] rounded-2xl p-6 shadow-lg shadow-black/40 border border-[#a454ff]/20 hover:border-[#a454ff]/50 transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border-2 border-[#a454ff]/40"
                />
                <div>
                  <h3 className="font-semibold text-lg">{t.name}</h3>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">“{t.feedback}”</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
