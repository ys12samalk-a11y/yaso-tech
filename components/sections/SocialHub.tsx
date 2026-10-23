"use client";

import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

// ==================== أيقونات السوشيال ====================
const FacebookIcon = ({ size = 32, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z" />
  </svg>
);

const InstagramIcon = ({ size = 32, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
  </svg>
);

const YoutubeIcon = ({ size = 32, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
);

const TikTokIcon = ({ size = 32, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const WhatsAppIcon = ({ size = 32, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37s-1.03 1.01-1.03 2.46 1.06 2.85 1.21 3.05c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.79h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 012.9 7c0 5.45-4.45 9.89-9.91 9.89zM20.52 3.48A11.82 11.82 0 0012.05.01C5.49.01.16 5.34.15 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.86 11.86 0 005.68 1.45h.01c6.56 0 11.89-5.33 11.9-11.89a11.82 11.82 0 00-3.43-8.43z" />
  </svg>
);

// ==================== روابط السوشيال ====================
const SOCIALS = [
  {
    name: "Facebook",
    href: SITE_CONFIG.social.facebook,
    icon: FacebookIcon,
    gradient: "from-blue-500 to-blue-600",
    color: "text-blue-500",
    description: "تابعنا على فيسبوك",
  },
  {
    name: "TikTok",
    href: SITE_CONFIG.social.tiktok,
    icon: TikTokIcon,
    gradient: "from-pink-500 to-purple-500",
    color: "text-pink-500",
    description: "شوف فيديوهاتنا على تيك توك",
  },
  {
    name: "YouTube",
    href: SITE_CONFIG.social.youtube,
    icon: YoutubeIcon,
    gradient: "from-red-500 to-red-600",
    color: "text-red-500",
    description: "قناتنا على يوتيوب",
  },
  {
    name: "Instagram",
    href: SITE_CONFIG.social.instagram,
    icon: InstagramIcon,
    gradient: "from-pink-500 via-purple-500 to-orange-500",
    color: "text-pink-500",
    description: "شوف تصاميمنا على إنستجرام",
  },
  {
    name: "WhatsApp",
    href: SITE_CONFIG.social.whatsappChannel,
    icon: WhatsAppIcon,
    gradient: "from-green-400 to-green-600",
    color: "text-green-500",
    description: "قناة واتساب الرسمية",
  },
];

export default function SocialHub() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* خلفية */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light/30 to-navy" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 mb-4">
            <Sparkles size={16} className="text-cyan" />
            <span className="text-sm font-semibold text-cyan">
              تابعنا
            </span>
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            تابعنا على{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              منصاتنا
            </span>
          </h2>

          <p className="text-white/60 max-w-2xl mx-auto">
            كن على اطلاع بأحدث أعمالنا ومشاريعنا ومحتوى حصري على كل منصات
            التواصل الاجتماعي
          </p>
        </motion.div>

        {/* البطاقات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SOCIALS.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6 overflow-hidden transition-all hover:border-cyan/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan/20"
              >
                {/* توهج خلفي */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="relative">
                  {/* الأيقونة */}
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${social.gradient} shadow-lg mb-4 transition-transform group-hover:scale-110`}
                  >
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* الاسم */}
                  <h3 className="text-xl font-bold text-white mb-1">
                    {social.name}
                  </h3>

                  {/* الوصف */}
                  <p className="text-sm text-white/60 mb-4">
                    {social.description}
                  </p>

                  {/* زر */}
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold ${social.color} group-hover:gap-3 transition-all`}
                  >
                    <span>تابعنا الآن</span>
                    <ExternalLink size={16} />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}