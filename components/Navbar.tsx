"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/config";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "خدماتنا" },
  { href: "/store", label: "المتجر" },
  { href: "/portfolio", label: "معرض الأعمال" },
  { href: "/about", label: "من نحن" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // إخفاء الـ Navbar في صفحات الأدمن
  const isAdmin = pathname?.startsWith("/admin");

  // تتبع التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // منع التمرير عند فتح القائمة
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (isAdmin) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-navy/90 backdrop-blur-lg border-b border-cyan/20 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* الشعار */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent transition-transform group-hover:scale-105">
              YASO TECH
            </span>
          </Link>

          {/* روابط الديسكتوب */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold text-white/80 hover:text-cyan transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* زر طلب الخدمة */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-5"
            >
              <MessageCircle size={18} />
              اطلب خدمتك
            </a>
          </div>

          {/* زر القائمة (موبايل) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            aria-label="القائمة"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* القائمة الجانبية (موبايل) */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 top-[64px] bg-navy/98 backdrop-blur-lg transition-all duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-lg font-bold text-white/90 hover:text-cyan hover:bg-white/5 rounded-xl transition-all"
            >
              {link.label}
            </Link>
          ))}

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 text-base py-3"
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle size={20} />
            اطلب خدمتك عبر واتساب
          </a>
        </div>
      </div>
    </header>
  );
}