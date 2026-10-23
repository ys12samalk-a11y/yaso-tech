"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { getWhatsAppLink } from "@/lib/config";

export default function CTASection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />

        {/* توهج سماوي */}
        <motion.div
          className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* توهج بنفسجي */}
        <motion.div
          className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl rounded-3xl border border-cyan/30 bg-navy-light/60 p-8 md:p-12 lg:p-16 text-center backdrop-blur-lg shadow-2xl shadow-cyan/10"
        >
          {/* شارة */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 mb-6">
            <Sparkles size={16} className="text-cyan" />
            <span className="text-sm font-semibold text-cyan">
              جاهزين نبدأ
            </span>
          </div>

          {/* العنوان */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            عندك فكرة؟{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              خلينا نحولها
            </span>{" "}
            إلى مشروع مميز
          </h2>

          {/* الوصف */}
          <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            تواصل معنا الآن وناقشنا في فكرتك. فريق YASO TECH جاهز يحوّل رؤيتك
            إلى واقع رقمي احترافي.
          </p>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppLink(
                "مرحبًا، عندي فكرة مشروع وعايز أتناقش فيها معاكم"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
            >
              <MessageCircle size={20} />
              تواصل عبر واتساب
            </a>

            <Link
              href="/request"
              className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
            >
              اطلب خدمتك الآن
              <ArrowLeft size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}