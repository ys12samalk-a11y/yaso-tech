"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/config";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // إخفاء الزر في صفحات الأدمن
  const isAdmin = pathname?.startsWith("/admin");

  // إظهار الزر بعد التمرير قليلاً
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // إظهار tooltip بعد 3 ثواني من ظهور الزر
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowTooltip(true), 3000);
      const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isVisible]);

  if (isAdmin) return null;

  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className={`fixed bottom-6 left-6 z-40 flex items-center gap-2 transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <div
        className={`hidden md:block whitespace-nowrap rounded-lg bg-navy-light border border-cyan/30 px-3 py-2 text-sm font-semibold text-white shadow-lg transition-all ${
          showTooltip
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-2 pointer-events-none"
        }`}
      >
        تواصل معنا الآن 👋
      </div>

      {/* الزر */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/50 transition-all hover:scale-110 active:scale-95">
        {/* نبضة */}
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping" />

        {/* أيقونة */}
        <MessageCircle size={26} className="relative z-10 text-white" />
      </div>
    </a>
  );
}