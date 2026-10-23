"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, Clock, Star, Loader2 } from "lucide-react";
import { ServiceDB } from "@/lib/services-db";
import { formatPrice } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "ai-video", label: "فيديو AI" },
  { id: "design", label: "تصميم" },
  { id: "web", label: "تطوير ويب" },
  { id: "social", label: "سوشيال ميديا" },
] as const;

export default function StorePage() {
  const [services, setServices] = useState<ServiceDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError("");

      try {
        const url =
          activeCategory === "all"
            ? "/api/services"
            : `/api/services?category=${activeCategory}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "فشل جلب الخدمات");
        }

        setServices(data.services || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [activeCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-12 pb-16 overflow-hidden">
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
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 mb-6">
              <Sparkles size={16} className="text-cyan" />
              <span className="text-sm font-semibold text-cyan">
                المتجر الإلكتروني
              </span>
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              اختر{" "}
              <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                خدمتك
              </span>{" "}
              وابدأ الآن
            </h1>

            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              تصفح كل الخدمات، اختر ما يناسبك، واطلب خدمتك في دقائق
            </p>
          </motion.div>
        </div>
      </section>

      {/* الفلتر */}
      <section className="container mx-auto px-4 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-cyan to-purple text-navy shadow-lg shadow-cyan/30"
                  : "border border-white/10 bg-white/5 text-white/70 hover:border-cyan/50 hover:text-cyan"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>
      </section>

      {/* الخدمات */}
      <section className="container mx-auto px-4 lg:px-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2
                size={40}
                className="text-cyan animate-spin mx-auto mb-4"
              />
              <p className="text-white/60">جاري تحميل الخدمات...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">
              لا توجد خدمات في هذا القسم
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: ServiceDB;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        href={`/store/${service.slug}`}
        className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan/20"
      >
        {/* الغلاف */}
        <div
          className={`relative aspect-video w-full bg-gradient-to-br ${service.cover_gradient} overflow-hidden`}
        >
          {service.cover_image_url ? (
            <>
              <img
                src={service.cover_image_url}
                alt={service.title_ar}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/30" />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(#ffffff30 1px, transparent 1px),
                                    linear-gradient(90deg, #ffffff30 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl drop-shadow-2xl transition-transform group-hover:scale-125">
                  {service.icon}
                </span>
              </div>
            </>
          )}

          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block rounded-full bg-navy/80 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-bold text-white">
              {service.category_label}
            </span>
          </div>

          {service.featured && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 text-xs font-bold text-navy shadow-lg">
                <Star size={12} fill="currentColor" />
                مميز
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs font-bold text-cyan mb-2 tracking-wider">
            {service.title_en}
          </p>
          <h3 className="text-lg font-bold text-white mb-2 leading-tight">
            {service.title_ar}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
            {service.short_description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-white/50 mb-1">يبدأ من</p>
              <p className="text-xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                {formatPrice(service.price)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <Clock size={14} />
              <span>{service.delivery_time}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-cyan font-semibold text-sm group-hover:gap-3 transition-all">
            <span>اعرف أكتر</span>
            <ArrowLeft size={16} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}