"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import ServiceForm from "@/components/admin/ServiceForm";
import { ServiceDB } from "@/lib/services-db";

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [service, setService] = useState<ServiceDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/admin/services/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "فشل جلب الخدمة");
        }

        setService(data.service);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={40} className="text-cyan animate-spin mx-auto mb-4" />
          <p className="text-white/60">جاري تحميل الخدمة...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="p-6 lg:p-10">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error || "الخدمة غير موجودة"}</p>
          <Link
            href="/admin/services"
            className="text-cyan hover:underline text-sm"
          >
            ← رجوع للخدمات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-white/60 hover:text-cyan transition-colors text-sm mb-6"
      >
        <ArrowRight size={16} />
        رجوع للخدمات
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          تعديل الخدمة
        </h1>
        <p className="text-white/60 font-mono">{service.title_en}</p>
      </div>

      {/* ✅ تمرير الـ id من الـ URL مباشرة إلى الفورم */}
      <ServiceForm mode="edit" initialData={service} id={id} />
    </div>
  );
}