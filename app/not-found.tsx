"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag, MessageCircle, ArrowLeft, Search } from "lucide-react";
import { getWhatsAppLink } from "@/lib/config";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* خلفية */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light/50 to-navy" />
        <motion.div
          className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-cyan/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-purple/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto text-center max-w-2xl py-20">
        {/* رقم 404 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <h1 className="text-[120px] md:text-[180px] font-extrabold leading-none bg-gradient-to-br from-cyan via-white to-purple bg-clip-text text-transparent drop-shadow-2xl">
              404
            </h1>
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Search size={40} className="text-cyan" />
            </motion.div>
          </div>
        </motion.div>

        {/* العنوان */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          الصفحة{" "}
          <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
            مش موجودة
          </span>
        </motion.h2>

        {/* الوصف */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-white/70 mb-10 max-w-lg mx-auto"
        >
          يبدو أنك ضللت الطريق 🚀 — الرابط اللي بتدور عليه مش موجود أو تم نقله.
          <br />
          خلينا نرجعك للمسار الصح.
        </motion.p>

        {/* الأزرار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
          >
            <Home size={20} />
            العودة للرئيسية
          </Link>

          <Link
            href="/store"
            className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
          >
            <ShoppingBag size={20} />
            تصفح المتجر
          </Link>

          <a
            href={getWhatsAppLink("مرحبًا، عندي استفسار")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-green-400 px-6 py-4 transition-colors"
          >
            <MessageCircle size={20} />
            تواصل معنا
          </a>
        </motion.div>

        {/* روابط سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-white/40 text-sm mb-4">
            أو يمكنك زيارة:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { href: "/about", label: "من نحن" },
              { href: "/services", label: "خدماتنا" },
              { href: "/portfolio", label: "معرض الأعمال" },
              { href: "/faq", label: "الأسئلة الشائعة" },
              { href: "/contact", label: "تواصل معنا" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-white/60 hover:text-cyan text-sm transition-colors group"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform group-hover:-translate-x-1"
                />
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}