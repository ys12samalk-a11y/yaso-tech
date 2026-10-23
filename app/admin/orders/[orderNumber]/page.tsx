"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Phone,
  Mail,
  Calendar,
  Link as LinkIcon,
  DollarSign,
  User,
  FileText,
  MessageCircle,
  Save,
  Copy,
  Check,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/config";

type Order = {
  id: string;
  order_number: string;
  service_title: string;
  service_slug: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  project_details: string;
  budget: string | null;
  deadline: string | null;
  reference_link: string | null;
  payment_method: string;
  payment_amount: number;
  payment_screenshot_url: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  confirmed_at: string | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: {
    label: "تحت المراجعة",
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    icon: Clock,
  },
  confirmed: {
    label: "مؤكد",
    color: "text-green-400 bg-green-500/10 border-green-500/30",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "قيد التنفيذ",
    color: "text-cyan bg-cyan/10 border-cyan/30",
    icon: Package,
  },
  completed: {
    label: "تم التسليم",
    color: "text-green-400 bg-green-500/10 border-green-500/30",
    icon: CheckCircle2,
  },
  rejected: {
    label: "مرفوض",
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    icon: XCircle,
  },
};

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  // جلب الطلب
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${orderNumber}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "فشل جلب الطلب");
        }

        setOrder(data.order);
        setAdminNotes(data.order.admin_notes || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderNumber]);

  // تحديث الحالة
  const handleUpdateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تحديث الحالة");
      }

      setOrder(data.order);
      setSuccessMessage("تم تحديث حالة الطلب بنجاح ✅");

      // إخفاء الرسالة بعد 3 ثواني
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // حفظ الملاحظات
  const handleSaveNotes = async () => {
    setSaving(true);
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل حفظ الملاحظات");
      }

      setOrder(data.order);
      setSuccessMessage("تم حفظ الملاحظات ✅");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  // نسخ رقم الطلب
  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={40} className="text-cyan animate-spin mx-auto mb-4" />
          <p className="text-white/60">جاري تحميل الطلب...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 lg:p-10">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error || "الطلب غير موجود"}</p>
          <Link
            href="/admin/orders"
            className="text-cyan hover:underline text-sm"
          >
            ← رجوع للطلبات
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-6 lg:p-10">
      {/* رجوع */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-white/60 hover:text-cyan transition-colors text-sm mb-6"
      >
        <ArrowRight size={16} />
        رجوع للطلبات
      </Link>

      {/* رسالة النجاح */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/50 bg-green-500/10 p-4"
        >
          <CheckCircle2 size={20} className="text-green-400" />
          <p className="text-green-400 text-sm font-semibold">
            {successMessage}
          </p>
        </motion.div>
      )}

      {/* الرأس */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-mono">
            #{order.order_number}
          </h1>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-cyan/30 bg-navy px-3 py-1.5 text-xs font-semibold text-cyan hover:bg-cyan/10 transition-all"
          >
            {copied ? (
              <>
                <Check size={14} />
                تم النسخ
              </>
            ) : (
              <>
                <Copy size={14} />
                نسخ
              </>
            )}
          </button>
        </div>

        {/* الحالة الحالية */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${statusConfig.color}`}
          >
            <StatusIcon size={16} />
            {statusConfig.label}
          </span>
          <span className="text-white/40 text-xs">
            {new Date(order.created_at).toLocaleString("ar-EG", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>

      {/* أزرار تغيير الحالة */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-navy-light/30 p-5">
        <h2 className="text-sm font-bold text-white/70 mb-3">
          تغيير حالة الطلب
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleUpdateStatus("pending")}
            disabled={updatingStatus || order.status === "pending"}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              order.status === "pending"
                ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 cursor-default"
                : "border border-white/10 bg-white/5 text-white/70 hover:border-yellow-500/50 hover:text-yellow-400 disabled:opacity-50"
            }`}
          >
            <Clock size={16} />
            تحت المراجعة
          </button>

          <button
            onClick={() => handleUpdateStatus("confirmed")}
            disabled={updatingStatus || order.status === "confirmed"}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              order.status === "confirmed"
                ? "border border-green-500/30 bg-green-500/10 text-green-400 cursor-default"
                : "border border-white/10 bg-white/5 text-white/70 hover:border-green-500/50 hover:text-green-400 disabled:opacity-50"
            }`}
          >
            <CheckCircle2 size={16} />
            تأكيد
          </button>

          <button
            onClick={() => handleUpdateStatus("in_progress")}
            disabled={updatingStatus || order.status === "in_progress"}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              order.status === "in_progress"
                ? "border border-cyan/30 bg-cyan/10 text-cyan cursor-default"
                : "border border-white/10 bg-white/5 text-white/70 hover:border-cyan/50 hover:text-cyan disabled:opacity-50"
            }`}
          >
            <Package size={16} />
            قيد التنفيذ
          </button>

          <button
            onClick={() => handleUpdateStatus("completed")}
            disabled={updatingStatus || order.status === "completed"}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              order.status === "completed"
                ? "border border-green-500/30 bg-green-500/10 text-green-400 cursor-default"
                : "border border-white/10 bg-white/5 text-white/70 hover:border-green-500/50 hover:text-green-400 disabled:opacity-50"
            }`}
          >
            <CheckCircle2 size={16} />
            تم التسليم
          </button>

          <button
            onClick={() => handleUpdateStatus("rejected")}
            disabled={updatingStatus || order.status === "rejected"}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              order.status === "rejected"
                ? "border border-red-500/30 bg-red-500/10 text-red-400 cursor-default"
                : "border border-white/10 bg-white/5 text-white/70 hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
            }`}
          >
            <XCircle size={16} />
            رفض
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* اليمين: بيانات العميل والمشروع */}
        <div className="space-y-6">
          {/* بيانات العميل */}
          <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <User size={20} className="text-cyan" />
              بيانات العميل
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-1">الاسم</p>
                <p className="text-white font-semibold">
                  {order.customer_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/50 mb-1">التليفون</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="text-white font-semibold flex items-center gap-2 hover:text-cyan transition-colors"
                  >
                    <Phone size={14} />
                    {order.customer_phone}
                  </a>
                  <a
                    href={getWhatsAppLink(
                      `مرحبًا ${order.customer_name}، بخصوص طلبك رقم ${order.order_number}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-1 rounded-full hover:bg-green-500/20 transition-all"
                  >
                    واتساب
                  </a>
                </div>
              </div>

              {order.customer_email && (
                <div>
                  <p className="text-xs text-white/50 mb-1">الإيميل</p>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="text-white flex items-center gap-2 hover:text-cyan transition-colors text-sm"
                  >
                    <Mail size={14} />
                    {order.customer_email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* تفاصيل المشروع */}
          <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <FileText size={20} className="text-cyan" />
              تفاصيل المشروع
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-white/50 mb-1">الخدمة</p>
                <p className="text-white font-semibold">
                  {order.service_title}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/50 mb-1">الوصف</p>
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {order.project_details}
                </p>
              </div>

              {order.budget && (
                <div>
                  <p className="text-xs text-white/50 mb-1">الميزانية</p>
                  <p className="text-white text-sm">{order.budget}</p>
                </div>
              )}

              {order.deadline && (
                <div>
                  <p className="text-xs text-white/50 mb-1">
                    الموعد المتوقع
                  </p>
                  <p className="text-white text-sm flex items-center gap-2">
                    <Calendar size={14} />
                    {order.deadline}
                  </p>
                </div>
              )}

              {order.reference_link && (
                <div>
                  <p className="text-xs text-white/50 mb-1">رابط مرجعي</p>
                  <a
                    href={order.reference_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:underline text-sm flex items-center gap-2 break-all"
                  >
                    <LinkIcon size={14} className="flex-shrink-0" />
                    {order.reference_link}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* الشمال: الدفع + الملاحظات */}
        <div className="space-y-6">
          {/* الدفع */}
          <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <DollarSign size={20} className="text-cyan" />
              الدفع
            </h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/60 text-sm">المبلغ</span>
                <span className="font-bold text-xl bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                  {formatPrice(order.payment_amount)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white/60 text-sm">الوسيلة</span>
                <span className="text-white text-sm font-semibold">
                  {order.payment_method === "cash"
                    ? "كاش (تحويل)"
                    : order.payment_method}
                </span>
              </div>
            </div>

            {/* اسكرين التحويل */}
            <div>
              <p className="text-xs text-white/50 mb-3">
                📸 اسكرين التحويل
              </p>
              <button
                onClick={() => setShowScreenshot(true)}
                className="w-full rounded-xl overflow-hidden border border-white/10 hover:border-cyan/50 transition-all group"
              >
                <img
                  src={order.payment_screenshot_url}
                  alt="اسكرين التحويل"
                  className="w-full h-auto object-contain max-h-80 group-hover:scale-105 transition-transform"
                />
              </button>
              <a
                href={order.payment_screenshot_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-cyan text-xs mt-2 hover:underline"
              >
                فتح الصورة بحجم كامل ↗
              </a>
            </div>
          </div>

          {/* الملاحظات */}
          <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <MessageCircle size={20} className="text-cyan" />
              ملاحظات الأدمن
            </h2>

            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="اكتب ملاحظة للعميل (ستظهر في صفحة تتبع الطلب)..."
              rows={4}
              className="input-field resize-none mb-3"
            />

            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save size={18} />
                  حفظ الملاحظات
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal عرض الاسكرين */}
      {showScreenshot && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowScreenshot(false)}
        >
          <button
            onClick={() => setShowScreenshot(false)}
            className="absolute top-4 left-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="إغلاق"
          >
            <XCircle size={24} />
          </button>
          <img
            src={order.payment_screenshot_url}
            alt="اسكرين التحويل"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}