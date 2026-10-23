"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Upload,
  X,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Smartphone,
  Wallet,
  CreditCard,
} from "lucide-react";
import { ServiceDB, fetchServiceBySlugPublic } from "@/lib/services-db";
import { formatPrice, isValidEgyptianPhone } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config";

type FormData = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  project_details: string;
  budget: string;
  deadline: string;
  reference_link: string;
};

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [service, setService] = useState<ServiceDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    project_details: "",
    budget: "",
    deadline: "",
    reference_link: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // جلب الخدمة
  useEffect(() => {
    async function fetchService() {
      try {
        const data = await fetchServiceBySlugPublic(slug);

        if (!data) {
          setServiceError("الخدمة غير موجودة");
          return;
        }

        setService(data);
      } catch (err) {
        setServiceError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [slug]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(SITE_CONFIG.payment.cashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("يُسمح فقط بـ JPG أو PNG أو WebP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("حجم الصورة يجب أن يكون أقل من 5 ميجا");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل رفع الصورة");
      }

      setScreenshotUrl(data.url);
      setScreenshotName(file.name);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotUrl(null);
    setScreenshotName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): string | null => {
    if (formData.customer_name.trim().length < 3) {
      return "الاسم يجب أن يكون 3 أحرف على الأقل";
    }
    if (!isValidEgyptianPhone(formData.customer_phone)) {
      return "رقم التليفون غير صحيح (مثال: 01012345678)";
    }
    if (formData.project_details.trim().length < 20) {
      return "وصف المشروع يجب أن يكون 20 حرفًا على الأقل";
    }
    if (!screenshotUrl) {
      return "يجب رفع اسكرين التحويل";
    }
    if (!agreedToTerms) {
      return "يجب الموافقة على الشروط";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setSubmitError("");

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: service.id,
          service_slug: service.slug,
          service_title: service.title_ar,
          ...formData,
          payment_method: paymentMethod,
          payment_amount: service.price,
          payment_screenshot_url: screenshotUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل إرسال الطلب");
      }

      router.push(`/order/${data.order.order_number}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "فشل إرسال الطلب");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

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
  if (serviceError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
            <p className="text-red-400 mb-4">
              {serviceError || "الخدمة غير موجودة"}
            </p>
            <Link href="/store" className="btn-primary inline-flex">
              العودة للمتجر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <Link
          href={`/store/${service.slug}`}
          className="inline-flex items-center gap-2 text-white/60 hover:text-cyan transition-colors text-sm mb-6"
        >
          <ArrowRight size={16} />
          رجوع للخدمة
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
        >
          إتمام الطلب
        </motion.h1>
        <p className="text-white/60 mb-8">املأ البيانات وأكد طلبك في دقائق</p>

        {submitError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
            <AlertCircle
              className="text-red-400 flex-shrink-0 mt-0.5"
              size={20}
            />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ملخص الطلب */}
          <div className="rounded-2xl border border-cyan/20 bg-navy-light/50 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              📦 ملخص الطلب
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {service.cover_image_url ? (
                  <img
                    src={service.cover_image_url}
                    alt={service.title_ar}
                    className="w-16 h-16 rounded-lg object-cover border border-white/10"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${service.cover_gradient} flex items-center justify-center text-3xl`}
                  >
                    {service.icon}
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{service.title_ar}</p>
                  <p className="text-xs text-cyan mt-1">{service.title_en}</p>
                </div>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                {formatPrice(service.price)}
              </p>
            </div>
          </div>

          {/* بيانات العميل */}
          <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
            <h2 className="text-lg font-bold text-white mb-4">👤 بياناتك</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label-field">
                  الاسم الكامل <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => updateField("customer_name", e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label-field">
                  رقم التليفون <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => updateField("customer_phone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label-field">الإيميل (اختياري)</label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => updateField("customer_email", e.target.value)}
                  placeholder="example@email.com"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* تفاصيل المشروع */}
          <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              📝 تفاصيل المشروع
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">
                  وصف الفكرة أو المشروع <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.project_details}
                  onChange={(e) =>
                    updateField("project_details", e.target.value)
                  }
                  placeholder="اشرح فكرتك بالتفصيل..."
                  rows={4}
                  className="input-field resize-none"
                  required
                />
                <p className="text-xs text-white/40 mt-1">
                  {formData.project_details.length} / 20 حرف على الأقل
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">
                    الميزانية التقريبية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                    placeholder="مثال: 500 - 1000 جنيه"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">
                    الموعد المتوقع (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => updateField("deadline", e.target.value)}
                    placeholder="مثال: خلال أسبوع"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="label-field">رابط مرجعي (اختياري)</label>
                <input
                  type="url"
                  value={formData.reference_link}
                  onChange={(e) =>
                    updateField("reference_link", e.target.value)
                  }
                  placeholder="https://..."
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* وسيلة الدفع */}
          <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
            <h2 className="text-lg font-bold text-white mb-4">💳 وسيلة الدفع</h2>
            <div className="space-y-3">
              {SITE_CONFIG.payment.methods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                    !method.enabled
                      ? "opacity-40 cursor-not-allowed"
                      : paymentMethod === method.id
                      ? "border-cyan bg-cyan/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() =>
                      method.enabled && setPaymentMethod(method.id)
                    }
                    disabled={!method.enabled}
                    className="accent-cyan w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">
                      {method.label}
                    </p>
                    {!method.enabled && (
                      <p className="text-xs text-white/40 mt-0.5">قريبًا</p>
                    )}
                  </div>
                  {method.id === "cash" && (
                    <Smartphone size={20} className="text-cyan" />
                  )}
                  {method.id === "wallet" && (
                    <Wallet size={20} className="text-white/40" />
                  )}
                  {method.id === "instapay" && (
                    <CreditCard size={20} className="text-white/40" />
                  )}
                </label>
              ))}
            </div>

            {paymentMethod === "cash" && (
              <div className="mt-5 rounded-xl border border-cyan/30 bg-cyan/5 p-5">
                <p className="text-sm text-white/80 mb-3">
                  حوّل مبلغ{" "}
                  <strong className="text-cyan text-base">
                    {formatPrice(service.price)}
                  </strong>{" "}
                  على الرقم التالي:
                </p>
                <div className="flex items-center gap-3 justify-between">
                  <p className="text-2xl font-bold text-white tracking-wider">
                    {SITE_CONFIG.payment.cashNumber}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
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
                        نسخ
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-white/50 mt-2">
                  باسم: {SITE_CONFIG.payment.cashName}
                </p>
              </div>
            )}
          </div>

          {/* رفع اسكرين التحويل */}
          {paymentMethod === "cash" && (
            <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
              <h2 className="text-lg font-bold text-white mb-2">
                📸 اسكرين التحويل <span className="text-red-400">*</span>
              </h2>
              <p className="text-sm text-white/60 mb-4">
                ارفع صورة التحويل (JPG / PNG / WebP - 5 ميجا كحد أقصى)
              </p>

              {!screenshotUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all ${
                    uploading
                      ? "border-cyan/50 bg-cyan/5"
                      : uploadError
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-white/20 bg-white/5 hover:border-cyan/50 hover:bg-cyan/5"
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={32} className="text-cyan animate-spin" />
                      <p className="text-cyan font-semibold">
                        جاري رفع الصورة...
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className="text-cyan" />
                      <p className="text-white font-semibold">
                        اضغط لاختيار صورة
                      </p>
                      <p className="text-xs text-white/40">
                        أو اسحبها وأفلتها هنا
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2
                        size={18}
                        className="text-green-400 flex-shrink-0"
                      />
                      <p className="text-sm font-semibold text-green-400">
                        تم رفع الصورة بنجاح
                      </p>
                    </div>
                    <p className="text-xs text-white/50 truncate">
                      {screenshotName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="flex-shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {uploadError && (
                <p className="text-red-400 text-sm mt-3">{uploadError}</p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* الشروط */}
          <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="accent-cyan w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-white/80 leading-relaxed">
                أوافق على{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-cyan hover:underline"
                >
                  الشروط والأحكام
                </Link>{" "}
                و{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-cyan hover:underline"
                >
                  سياسة الخصوصية
                </Link>
              </span>
            </label>
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={submitting || uploading}
            className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                جاري إرسال الطلب...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                تأكيد الطلب
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}