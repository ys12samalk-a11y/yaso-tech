"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Clock,
  ShoppingBag,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { ServiceDB, fetchAllServicesPublic } from "@/lib/services-db";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/config";

// معلومات الفئات
const CATEGORY_INFO = {
  "ai-video": {
    title: "فيديوهات الذكاء الاصطناعي",
    titleEn: "AI Video Production",
    description:
      "إنتاج فيديوهات إعلانية، دعوات مناسبات، فيديوهات ترويجية، ومحتوى إبداعي بالذكاء الاصطناعي.",
    color: "from-cyan to-blue-500",
    icon: "🎬",
  },
  design: {
    title: "التصميم والهوية البصرية",
    titleEn: "Design & Branding",
    description:
      "شعارات، هوية بصرية متكاملة، إعلانات سوشيال ميديا، بوسترات، وتصاميم احترافية للبراندات.",
    color: "from-purple to-pink-500",
    icon: "🎨",
  },
  web: {
    title: "تصميم وتطوير المواقع",
    titleEn: "Web Development",
    description:
      "مواقع احترافية، متاجر إلكترونية، صفحات هبوط، وتصميمات متجاوبة مع جميع الأجهزة.",
    color: "from-cyan to-purple",
    icon: "💻",
  },
  social: {
    title: "محتوى وإعلانات السوشيال ميديا",
    titleEn: "Social Media Content",
    description:
      "منشورات إعلانية، فيديوهات قصيرة، مواد بصرية متوافقة مع هوية براندك على كل المنصات.",
    color: "from-purple to-cyan",
    icon: "📱",
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_INFO;

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await fetchAllServicesPublic();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  // تجميع الخدمات حسب الفئة
  const servicesByCategory = services.reduce((acc, service) => {
    const cat = service.category as CategoryKey;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {} as Record<CategoryKey, ServiceDB[]>);

  return (
    <div className="min-h-screen">
      {/* ==================== Hero ==================== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light/50 to-navy" />
          <motion.div
            className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 mb-6">
              <Sparkles size={16} className="text-cyan" />
              <span className="text-sm font-semibold text-cyan">
                خدماتنا
              </span>
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              حلول{" "}
              <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                رقمية متكاملة
              </span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              نقدم مجموعة متنوعة من الخدمات الرقمية لتلبية جميع احتياجاتك — من
              الفيديوهات والتصميم للمواقع والمحتوى.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/store" className="btn-primary text-base px-8 py-4">
                <ShoppingBag size={20} />
                تصفح المتجر
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-base px-8 py-4"
              >
                <MessageCircle size={20} />
                اسأل عن خدمة
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== المحتوى ==================== */}
      {loading ? (
        <section className="container mx-auto px-4 lg:px-8 py-20">
          <div className="text-center">
            <Loader2
              size={40}
              className="text-cyan animate-spin mx-auto mb-4"
            />
            <p className="text-white/60">جاري تحميل الخدمات...</p>
          </div>
        </section>
      ) : error ? (
        <section className="container mx-auto px-4 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </section>
      ) : (
        (Object.keys(CATEGORY_INFO) as CategoryKey[]).map((category, catIndex) => {
          const categoryServices = servicesByCategory[category] || [];
          if (categoryServices.length === 0) return null;

          const info = CATEGORY_INFO[category];

          return (
            <section
              key={category}
              id={category}
              className={`relative py-16 lg:py-20 overflow-hidden ${
                catIndex % 2 === 1 ? "bg-navy-light/20" : ""
              }`}
            >
              <div className="container mx-auto px-4 lg:px-8">
                {/* رأس الفئة */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <div className="flex items-start gap-5 mb-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${info.color} shadow-lg flex-shrink-0`}
                    >
                      <span className="text-3xl">{info.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cyan mb-1 tracking-wider">
                        {info.titleEn}
                      </p>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        {info.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-white/60 max-w-3xl leading-relaxed">
                    {info.description}
                  </p>
                </motion.div>

                {/* الخدمات */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6 transition-all hover:border-cyan/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan/10"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {service.title_ar}
                          </h3>
                          <p className="text-xs font-bold text-cyan tracking-wider">
                            {service.title_en}
                          </p>
                        </div>
                        <div className="text-left flex-shrink-0">
                          <p className="text-xs text-white/50 mb-1">يبدأ من</p>
                          <p className="text-xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                            {formatPrice(service.price)}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-white/70 leading-relaxed mb-4">
                        {service.short_description}
                      </p>

                      {/* المميزات */}
                      <ul className="space-y-2 mb-5">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-white/70 text-sm"
                          >
                            <CheckCircle2
                              size={16}
                              className="text-cyan flex-shrink-0 mt-0.5"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* التفاصيل السفلية */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-white/60 text-xs">
                          <Clock size={14} />
                          <span>{service.delivery_time}</span>
                        </div>
                        <Link
                          href={`/store/${service.slug}`}
                          className="flex items-center gap-2 text-cyan font-semibold text-sm hover:gap-3 transition-all"
                        >
                          اعرف أكتر
                          <ArrowLeft size={16} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* ==================== CTA ==================== */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-cyan/30 bg-gradient-to-br from-navy-light to-navy p-8 md:p-12 text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple/10 blur-3xl" />

          <div className="relative">
            <Sparkles size={48} className="text-cyan mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              جاهز تبدأ مشروعك؟
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              تصفح المتجر واختر الخدمة اللي تناسبك. أو تواصل معانا على واتساب
              لمناقشة فكرتك.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/store"
                className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
              >
                <ShoppingBag size={20} />
                تصفح المتجر
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
              >
                <MessageCircle size={20} />
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}