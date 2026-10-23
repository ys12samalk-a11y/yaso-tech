"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { SITE_CONFIG, getWhatsAppLink } from "@/lib/config";

// ============ أيقونات السوشيال ميديا (SVG) ============

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z" />
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
  </svg>
);

const YoutubeIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
);

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37s-1.03 1.01-1.03 2.46 1.06 2.85 1.21 3.05c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.79h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 012.9 7c0 5.45-4.45 9.89-9.91 9.89zM20.52 3.48A11.82 11.82 0 0012.05.01C5.49.01.16 5.34.15 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.86 11.86 0 005.68 1.45h.01c6.56 0 11.89-5.33 11.9-11.89a11.82 11.82 0 00-3.43-8.43z" />
  </svg>
);

// ============ قائمة السوشيال ============

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: SITE_CONFIG.social.facebook,
    icon: FacebookIcon,
    color: "hover:text-blue-500",
  },
  {
    name: "TikTok",
    href: SITE_CONFIG.social.tiktok,
    icon: TikTokIcon,
    color: "hover:text-pink-400",
  },
  {
    name: "YouTube",
    href: SITE_CONFIG.social.youtube,
    icon: YoutubeIcon,
    color: "hover:text-red-500",
  },
  {
    name: "Instagram",
    href: SITE_CONFIG.social.instagram,
    icon: InstagramIcon,
    color: "hover:text-pink-500",
  },
  {
    name: "WhatsApp",
    href: SITE_CONFIG.social.whatsappChannel,
    icon: WhatsAppIcon,
    color: "hover:text-green-400",
  },
];

const QUICK_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "خدماتنا" },
  { href: "/store", label: "المتجر" },
  { href: "/portfolio", label: "معرض الأعمال" },
  { href: "/about", label: "من نحن" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // إخفاء Footer في صفحات الأدمن
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative mt-20 border-t border-cyan/20 bg-navy-dark">
      {/* تأثير توهج خفيف */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* العمود الأول: البراند */}
          <div>
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent mb-2">
              YASO TECH
            </h3>
            <p className="text-cyan text-sm font-bold mb-4">
              {SITE_CONFIG.brand.tagline}
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              {SITE_CONFIG.brand.description}
            </p>
          </div>

          {/* العمود التاني: روابط سريعة */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-cyan text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود التالت: تواصل */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">تواصل معنا</h4>

            <div className="space-y-3 mb-6">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-cyan text-sm transition-colors"
              >
                <Phone size={16} />
                {SITE_CONFIG.contact.phone}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="flex items-center gap-2 text-white/60 hover:text-cyan text-sm transition-colors"
              >
                <Mail size={16} />
                {SITE_CONFIG.contact.email}
              </a>
            </div>

            {/* روابط السوشيال ميديا */}
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all hover:scale-110 hover:border-cyan/50 hover:bg-white/10 ${social.color}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* السطر الأخير */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {currentYear} {SITE_CONFIG.brand.name}. جميع الحقوق محفوظة.
          </p>
          <p className="text-white/50 text-sm">
            صُنع بـ ❤️ بواسطة {SITE_CONFIG.brand.owner}
          </p>
        </div>
      </div>
    </footer>
  );
}