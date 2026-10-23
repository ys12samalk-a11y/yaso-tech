"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Video,
  Palette,
  Code2,
  Share2,
  ArrowLeft,
} from "lucide-react";

const SERVICES = [
  {
    id: "ai-video",
    icon: Video,
    titleEn: "AI Video Production",
    titleAr: "إنتاج فيديوهات الذكاء الاصطناعي",
    description:
      "فيديوهات إعلانية احترافية، دعوات مناسبات، فيديوهات ترويجية، ومحتوى إبداعي بالذكاء الاصطناعي.",
    color: "from-cyan to-blue-500",
    bgGlow: "bg-cyan/20",
  },
  {
    id: "design-branding",
    icon: Palette,
    titleEn: "Design & Branding",
    titleAr: "التصميم والهوية البصرية",
    description:
      "شعارات، هوية بصرية متكاملة، إعلانات سوشيال ميديا، بوسترات، وتصاميم احترافية للبراندات.",
    color: "from-purple to-pink-500",
    bgGlow: "bg-purple/20",
  },
  {
    id: "web-development",
    icon: Code2,
    titleEn: "Web Development",
    titleAr: "تصميم وتطوير المواقع",
    description:
      "مواقع احترافية، متاجر إلكترونية، صفحات هبوط، وتصميمات متجاوبة مع جميع الأجهزة.",
    color: "from-cyan to-purple",
    bgGlow: "bg-cyan/20",
  },
  {
    id: "social-media",
    icon: Share2,
    titleEn: "Social Media Content",
    titleAr: "محتوى وإعلانات السوشيال ميديا",
    description:
      "منشورات إعلانية، فيديوهات قصيرة، مواد بصرية متوافقة مع هوية براندك على كل المنصات.",
    color: "from-purple to-cyan",
    bgGlow: "bg-purple/20",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* خلفية خفيفة */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy via-navy-light/30 to-navy" />

      <div className="container mx-auto px-4 lg:px-8">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-bold text-cyan tracking-widest mb-3">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            حلول{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              إبداعية متكاملة
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            نقدم مجموعة متنوعة من الخدمات الرقمية لتلبية جميع احتياجاتك
          </p>
        </motion.div>

        {/* البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/services#${service.id}`}
                  className="group relative block h-full rounded-2xl border border-white/10 bg-navy-light/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan/20"
                >
                  <div
                    className={`absolute inset-0 -z-10 rounded-2xl ${service.bgGlow} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div
                    className={`relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} shadow-lg transition-transform group-hover:scale-110`}
                  >
                    <Icon size={26} className="text-white" />
                  </div>

                  <p className="text-xs font-bold text-cyan mb-2 tracking-wider">
                    {service.titleEn}
                  </p>

                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                    {service.titleAr}
                  </h3>

                  <p className="text-sm text-white/60 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-cyan font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>اعرف أكتر</span>
                    <ArrowLeft size={16} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/services" className="btn-secondary inline-flex">
            عرض كل الخدمات
            <ArrowLeft size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}