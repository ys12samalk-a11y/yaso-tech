"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Loader2,
  AlertCircle,
  Package,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Video,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ServiceDB } from "@/lib/services-db";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services?includeInactive=true");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل جلب الخدمات");
      }

      setServices(data.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;

    setDeletingId(id);

    // 🔍 سطر تشخيص - في المتصفح (Console)
    console.log("🗑️ [DELETE] ID:", id);

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      // 🔍 نشوف الرد
      console.log("📡 [DELETE] Response status:", res.status);
      const data = await res.json();
      console.log("📡 [DELETE] Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || "فشل الحذف");
      }

      // نشيلها من الشاشة
      setServices((prev) => prev.filter((s) => s.id !== id));
      console.log("✅ [DELETE] Removed from UI successfully");
    } catch (err) {
      console.error("❌ [DELETE] Error:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (service: ServiceDB) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !service.is_active }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل التحديث");
      }

      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? data.service : s))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "حدث خطأ");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={40} className="text-cyan animate-spin mx-auto mb-4" />
          <p className="text-white/60">جاري تحميل الخدمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      {/* العنوان */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            الخدمات
          </h1>
          <p className="text-white/60">{services.length} خدمة</p>
        </div>

        <Link href="/admin/services/new" className="btn-primary py-3 px-6">
          <Plus size={20} />
          إضافة خدمة جديدة
        </Link>
      </div>

      {/* الخطأ */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <AlertCircle
            size={20}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* القائمة */}
      {services.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-16 text-center">
          <Package size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg mb-6">لا توجد خدمات بعد</p>
          <Link href="/admin/services/new" className="btn-primary inline-flex">
            <Plus size={20} />
            إضافة أول خدمة
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`rounded-2xl border bg-navy-light/50 overflow-hidden transition-all ${
                service.is_active
                  ? "border-white/10"
                  : "border-red-500/30 opacity-70"
              }`}
            >
              {/* الغلاف */}
              <div
                className={`relative aspect-video bg-gradient-to-br ${service.cover_gradient} overflow-hidden`}
              >
                {service.cover_image_url ? (
                  <>
                    <img
                      src={service.cover_image_url}
                      alt={service.title_ar}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/40" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl drop-shadow-2xl">
                      {service.icon}
                    </span>
                  </div>
                )}

                {service.featured && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-navy">
                      <Star size={10} fill="currentColor" />
                      مميز
                    </span>
                  </div>
                )}

                {!service.is_active && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="rounded-full bg-red-500/90 px-2 py-1 text-xs font-bold text-white">
                      معطلة
                    </span>
                  </div>
                )}

                {service.video_url && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-navy">
                      <Video size={12} />
                      فيديو
                    </span>
                  </div>
                )}
              </div>

              {/* المحتوى */}
              <div className="p-4">
                <p className="text-xs font-bold text-cyan mb-1">
                  {service.title_en}
                </p>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                  {service.title_ar}
                </h3>
                <p className="text-sm text-white/60 mb-3 line-clamp-2">
                  {service.short_description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                    {formatPrice(service.price)}
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60">
                    {service.category_label}
                  </span>
                </div>

                {/* الأزرار */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-cyan/10 border border-cyan/30 py-2 text-cyan text-sm font-semibold hover:bg-cyan/20 transition-all"
                  >
                    <Edit size={14} />
                    تعديل
                  </Link>

                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`p-2 rounded-lg border transition-all ${
                      service.is_active
                        ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                        : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                    }`}
                    title={service.is_active ? "تعطيل" : "تفعيل"}
                  >
                    {service.is_active ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(service.id, service.title_ar)}
                    disabled={deletingId === service.id}
                    className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    title="حذف"
                  >
                    {deletingId === service.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}