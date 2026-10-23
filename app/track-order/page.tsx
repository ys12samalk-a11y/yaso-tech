"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { formatPrice, isValidEgyptianPhone } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/config";

type Order = {
  id: string;
  order_number: string;
  service_title: string;
  service_slug: string;
  customer_name: string;
  payment_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  confirmed_at: string | null;
  admin_notes: string | null;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: any; step: number }
> = {
  pending: {
    label: "تحت المراجعة",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    icon: Clock,
    step: 1,
  },
  confirmed: {
    label: "تم التأكيد",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    icon: CheckCircle2,
    step: 2,
  },
  in_progress: {
    label: "قيد التنفيذ",
    color: "text-cyan",
    bg: "bg-cyan/10 border-cyan/30",
    icon: Package,
    step: 3,
  },
  completed: {
    label: "تم التسليم",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    icon: CheckCircle2,
    step: 4,
  },
  rejected: {
    label: "مرفوض",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    icon: AlertCircle,
    step: 0,
  },
};

const STEPS = [
  { num: 1, label: "تحت المراجعة" },
  { num: 2, label: "تم التأكيد" },
  { num: 3, label: "قيد التنفيذ" },
  { num: 4, label: "تم التسليم" },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    // التحقق من المدخلات
    if (!orderNumber.trim()) {
      setError("أدخل رقم الطلب");
      return;
    }

    if (!isValidEgyptianPhone(phone)) {
      setError("رقم التليفون غير صحيح (مثال: 01012345678)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber.trim(),
          customer_phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل البحث");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOrder(null);
    setOrderNumber("");
    setPhone("");
    setError("");
  };

  return (
    <div className="min-h-screen py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-purple shadow-xl mb-4">
            <Search size={28} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            تتبع طلبك
          </h1>
          <p className="text-white/60">
            أدخل رقم الطلب ورقم التليفون لمعرفة حالة طلبك
          </p>
        </motion.div>

        {/* ==================== نموذج البحث ==================== */}
        {!order && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="rounded-2xl border border-white/10 bg-navy-light/30 p-6 md:p-8 space-y-5"
          >
            <div>
              <label className="label-field">
                رقم الطلب <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="مثال: YASO-2026-4051"
                className="input-field font-mono"
                required
              />
            </div>

            <div>
              <label className="label-field">
                رقم التليفون <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="input-field"
                required
              />
              <p className="text-xs text-white/40 mt-1">
                نفس الرقم اللي استخدمته في الطلب
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
                <AlertCircle
                  size={20}
                  className="text-red-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Search size={20} />
                  ابحث عن الطلب
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* ==================== نتائج البحث ==================== */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* زر رجوع للبحث */}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-white/60 hover:text-cyan transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              ابحث عن طلب آخر
            </button>

            {/* بطاقة الطلب */}
            <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6 md:p-8">
              {/* رأس */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <div>
                  <p className="text-xs text-white/50 mb-1">رقم الطلب</p>
                  <p className="text-xl font-bold text-white font-mono">
                    #{order.order_number}
                  </p>
                </div>
                {(() => {
                  const config =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const Icon = config.icon;
                  return (
                    <div
                      className={`flex items-center gap-2 rounded-full border ${config.bg} px-4 py-2`}
                    >
                      <Icon size={16} className={config.color} />
                      <span className={`text-sm font-bold ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Progress Steps */}
              {order.status !== "rejected" && (
                <div className="mb-6">
                  <div className="flex items-center justify-between relative">
                    {STEPS.map((step, idx) => {
                      const currentStep =
                        STATUS_CONFIG[order.status]?.step || 1;
                      const isCompleted = step.num <= currentStep;
                      return (
                        <div
                          key={step.num}
                          className="flex-1 flex flex-col items-center relative z-10"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                              isCompleted
                                ? "bg-gradient-to-br from-cyan to-purple text-white"
                                : "bg-navy-light border-2 border-white/20 text-white/40"
                            }`}
                          >
                            {isCompleted ? "✓" : step.num}
                          </div>
                          <p
                            className={`text-xs mt-2 text-center ${
                              isCompleted
                                ? "text-cyan font-semibold"
                                : "text-white/40"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}

                    {/* خط أفقي */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 -z-0" />
                  </div>
                </div>
              )}

              {/* التفاصيل */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60 text-sm">الخدمة</span>
                  <span className="text-white font-semibold text-sm text-left">
                    {order.service_title}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60 text-sm">المبلغ</span>
                  <span className="font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                    {formatPrice(order.payment_amount)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60 text-sm">
                    تاريخ الطلب
                  </span>
                  <span className="text-white text-sm">
                    {new Date(order.created_at).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* ملاحظات الأدمن */}
              {order.admin_notes && (
                <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-4 mb-6">
                  <p className="text-xs text-cyan font-semibold mb-1">
                    📝 ملاحظة من الفريق
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {order.admin_notes}
                  </p>
                </div>
              )}

              {/* زر تواصل */}
              <a
                href={getWhatsAppLink(
                  `مرحبًا، عايز أتابع طلبي رقم ${order.order_number}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-4"
              >
                <MessageCircle size={20} />
                تواصل مع الفريق
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}