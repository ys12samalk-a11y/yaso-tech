"use client";

import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  MessageCircle,
  ShoppingCart,
  Star,
  Loader2,
  Play,
} from "lucide-react";
import { ServiceDB, fetchServiceBySlugPublic, fetchAllServicesPublic } from "@/lib/services-db";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/config";

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [service, setService] = useState<ServiceDB | null>(null);
  const [relatedServices, setRelatedServices] = useState<ServiceDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // جلب الخدمة
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchServiceBySlugPublic(slug);

        if (!data) {
          notFound();
          return;
        }

        setService(data);

        // جلب خدمات مشابهة
        const allServices = await fetchAllServicesPublic(data.category);
        const similar = allServices
          .filter((s) => s.id !== data.id)
          .slice(0, 3);
        setRelatedServices(similar);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-cyan animate-spin mx-auto mb-4" />
          <p className="text-white/60">جاري تحميل الخدمة...</p>
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
            <p className="text-red-400 mb-4">{error || "الخدمة غير موجودة"}</p>
            <Link href="/store" className="btn-primary inline-flex">
              العودة للمتجر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* زر الرجوع */}
      <section className="container mx-auto px-4 lg:px-8 pt-8">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-white/60 hover:text-cyan transition-colors text-sm"
        >
          <ArrowRight size={16} />
          رجوع للمتجر
        </Link>
      </section>

      {/* المحتوى الرئيسي */}
      <section className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* الجزء الأيسر: الغلاف */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`relative aspect-square w-full rounded-3xl bg-gradient-to-br ${service.cover_gradient} overflow-hidden shadow-2xl`}
            >
              {service.cover_image_url ? (
                <>
                  <img
                    src={service.cover_image_url}
                    alt={service.title_ar}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(#ffffff30 1px, transparent 1px),
                                        linear-gradient(90deg, #ffffff30 1px, transparent 1px)`,
                      backgroundSize: "40px 40px",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[180px] drop-shadow-2xl">
                      {service.icon}
                    </span>
                  </div>
                </>
              )}

              {service.featured && (
                <div className="absolute top-5 right-5 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-bold text-navy shadow-lg">
                    <Star size={14} fill="currentColor" />
                    خدمة مميزة
                  </span>
                </div>
              )}
            </div>

            {/* فيديو */}
            {service.video_url && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-navy">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-navy-light/50">
                  <Play size={16} className="text-cyan" />
                  <p className="text-sm font-semibold text-white">
                    فيديو الخدمة
                  </p>
                </div>
                <video
                  src={service.video_url}
                  controls
                  className="w-full max-h-96 object-contain"
                  poster={service.cover_image_url || undefined}
                />
              </div>
            )}
          </motion.div>

          {/* الجزء الأيمن: التفاصيل */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-4">
              <span className="inline-block rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-xs font-bold text-cyan">
                {service.category_label}
              </span>
            </div>

            <p className="text-sm font-bold text-cyan mb-2 tracking-wider">
              {service.title_en}
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {service.title_ar}
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
              {service.short_description}
            </p>

            {/* السعر + مدة التنفيذ */}
            <div className="flex flex-wrap items-center gap-6 mb-8 p-5 rounded-2xl border border-cyan/20 bg-navy-light/50">
              <div>
                <p className="text-xs text-white/50 mb-1">السعر</p>
                <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                  {formatPrice(service.price)}
                </p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <p className="text-xs text-white/50 mb-1">مدة التنفيذ</p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Clock size={18} className="text-cyan" />
                  <span>{service.delivery_time}</span>
                </div>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href={`/checkout/${service.slug}`}
                className="btn-primary text-base py-4 px-6 flex-1 justify-center"
              >
                <ShoppingCart size={20} />
                اشترِ الآن
              </Link>

              <a
                href={getWhatsAppLink(
                  `مرحبًا، أريد الاستفسار عن خدمة "${service.title_ar}"`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-base py-4 px-6 flex-1 justify-center"
              >
                <MessageCircle size={20} />
                اسأل قبل الشراء
              </a>
            </div>

            {/* المميزات */}
            <div className="p-5 rounded-2xl border border-white/10 bg-navy-light/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-cyan" />
                ما ستحصل عليه
              </h3>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2
                      size={18}
                      className="text-cyan flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* الوصف الكامل */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-navy-light/30 p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">وصف تفصيلي</h2>
          <p className="text-white/70 leading-relaxed text-base whitespace-pre-wrap">
            {service.full_description}
          </p>
        </motion.div>
      </section>

      {/* خدمات مشابهة */}
      {relatedServices.length > 0 && (
        <section className="container mx-auto px-4 lg:px-8 py-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white mb-8"
          >
            خدمات{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              مشابهة
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel, index) => (
              <RelatedServiceCard key={rel.id} service={rel} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ==================== بطاقة خدمة مشابهة ====================
function RelatedServiceCard({
  service,
  index,
}: {
  service: ServiceDB;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/store/${service.slug}`}
        className="group block overflow-hidden rounded-2xl border border-white/10 bg-navy-light/50 transition-all hover:border-cyan/50 hover:-translate-y-1"
      >
        <div
          className={`relative aspect-video bg-gradient-to-br ${service.cover_gradient} overflow-hidden`}
        >
          {service.cover_image_url ? (
            <>
              <img
                src={service.cover_image_url}
                alt={service.title_ar}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl drop-shadow-2xl">{service.icon}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
            {service.title_ar}
          </h3>
          <p className="text-sm font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
            {formatPrice(service.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}