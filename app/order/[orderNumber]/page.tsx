"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Search,
  Copy,
  Check,
  Package,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
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
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  pending: {
    label: "تحت المراجعة",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    icon: Clock,
  },
  confirmed: {
    label: "تم التأكيد",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "قيد التنفيذ",
    color: "text-cyan",
    bg: "bg-cyan/10 border-cyan/30",
    icon: Package,
  },
  completed: {
    label: "تم التسليم",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    icon: CheckCircle2,
  },
  rejected: {
    label: "مرفوض",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    icon: AlertCircle,
  },
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "فشل جلب الطلب");
        }

        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderNumber]);

  const handleCopy = () => {
    if (order) {
      navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan/30 border-t-cyan animate-spin mx-auto mb-4" />
          <p className="text-white/60">جاري تحميل الطلب...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">
              لم نجد الطلب
            </h1>
            <p className="text-white/60 text-sm mb-6">{error}</p>
            <Link href="/" className="btn-primary inline-flex">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl shadow-green-500/50 mb-6">
            <CheckCircle2 size={44} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            تم استلام طلبك بنجاح!
          </h1>
          <p className="text-white/60 text-lg">
            شكرًا لك {order.customer_name}، سنراجع طلبك ونتواصل معك قريبًا
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-cyan/30 bg-gradient-to-br from-navy-light to-navy p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center md:text-right">
              <p className="text-xs text-white/50 mb-1">رقم الطلب</p>
              <p className="text-2xl font-bold text-white tracking-wider font-mono">
                #{order.order_number}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg border border-cyan/30 bg-navy px-4 py-2 text-sm font-semibold text-cyan hover:bg-cyan/10 transition-all"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy size={16} />
                  نسخ الرقم
                </>
              )}
            </button>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border ${statusConfig.bg} p-4`}
          >
            <StatusIcon size={24} className={statusConfig.color} />
            <div>
              <p className="text-xs text-white/50 mb-0.5">حالة الطلب</p>
              <p className={`text-lg font-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-navy-light/30 p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            📋 ملخص الطلب
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/60 text-sm">الخدمة</span>
              <span className="text-white font-semibold text-sm text-left">
                {order.service_title}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/60 text-sm">المبلغ</span>
              <span className="font-bold text-lg bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                {formatPrice(order.payment_amount)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/60 text-sm">وسيلة الدفع</span>
              <span className="text-white font-semibold text-sm">
                {order.payment_method === "cash"
                  ? "كاش (تحويل على الرقم)"
                  : order.payment_method}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/60 text-sm">اسكرين التحويل</span>
              <span className="text-green-400 font-semibold text-sm flex items-center gap-1">
                <CheckCircle2 size={14} />
                تم الرفع
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <Clock size={24} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-2">
                ⏳ سيتم مراجعة طلبك خلال 24 ساعة
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                سنقوم بمراجعة بياناتك واسكرين التحويل، وبعدها سيتم التواصل معك
                عبر واتساب لتأكيد الطلب وبدء التنفيذ.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href={getWhatsAppLink(
              `مرحبًا، عايز أتابع طلبي رقم ${order.order_number}`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 justify-center py-4"
          >
            <MessageCircle size={20} />
            تواصل عبر واتساب
          </a>

          <Link
            href={`/track-order?order=${order.order_number}`}
            className="btn-secondary flex-1 justify-center py-4"
          >
            <Search size={20} />
            تتبع الطلب
          </Link>
        </motion.div>

        <p className="text-center text-white/40 text-sm mt-8">
          احتفظ برقم الطلب{" "}
          <span className="text-cyan font-mono">
            #{order.order_number}
          </span>{" "}
          للمتابعة
        </p>
      </div>
    </div>
  );
}