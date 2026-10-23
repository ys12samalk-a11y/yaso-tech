"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, Play, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/config";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* خلفية متحركة خفيفة */}
      <div className="absolute inset-0 -z-10">
        {/* تدرج أساسي */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light to-navy" />

        {/* دوائر ضوئية */}
        <motion.div
          className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-cyan/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-purple/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* شبكة خفيفة */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#00E5FF 1px, transparent 1px),
                              linear-gradient(90deg, #00E5FF 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        {/* شارة صغيرة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 mb-6"
        >
          <Sparkles size={16} className="text-cyan" />
          <span className="text-sm font-semibold text-cyan">
            إبداع رقمي بالذكاء الاصطناعي
          </span>
        </motion.div>

        {/* الشعار */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 bg-gradient-to-r from-cyan via-white to-purple bg-clip-text text-transparent"
        >
          YASO TECH
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl font-bold text-cyan mb-6 tracking-widest"
        >
          AI • DESIGN • BRANDING • WEB
        </motion.p>

        {/* العنوان الرئيسي */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto"
        >
          نحوّل أفكارك إلى{" "}
          <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
            إبداع رقمي
          </span>{" "}
          يصنع الفرق
        </motion.h2>

        {/* الوصف */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base md:text-lg text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          نقدم حلولًا إبداعية وتقنية تشمل إنتاج فيديوهات الذكاء الاصطناعي،
          والتصميم والهوية البصرية، والإعلانات الرقمية، وتصميم المواقع والمتاجر
          الإلكترونية، لمساعدة الأفراد والمشروعات والبراندات على الظهور بصورة
          احترافية.
        </motion.p>

        {/* الأزرار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/services" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
            استكشف خدماتنا
            <ArrowLeft size={20} />
          </Link>

          <Link href="/portfolio" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
            <Play size={20} />
            شاهد أعمالنا
          </Link>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-base px-8 py-4 w-full sm:w-auto border border-white/10"
          >
            <MessageCircle size={20} />
            تواصل واتساب
          </a>
        </motion.div>
      </div>

      {/* مؤشر التمرير */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-cyan/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-cyan" />
        </div>
      </motion.div>
    </section>
  );
}