"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
} from "lucide-react";
import { SITE_CONFIG, getWhatsAppLink } from "@/lib/config";
import { isValidEgyptianPhone } from "@/lib/utils";

// ==================== أيقونات السوشيال ====================
const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z" />
  </svg>
);

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
  </svg>
);

const YoutubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
);

const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (formData.name.trim().length < 3) {
      setError("الاسم يجب أن يكون 3 أحرف على الأقل");
      return;
    }

    if (!isValidEgyptianPhone(formData.phone)) {
      setError("رقم التليفون غير صحيح (مثال: 01012345678)");
      return;
    }

    if (formData.message.trim().length < 20) {
      setError("الرسالة يجب أن تكون 20 حرفًا على الأقل");
      return;
    }

    setSubmitting(true);

    const whatsappMessage = `مرحبًا، أنا ${formData.name}%0A%0A${formData.message}%0A%0Aرقم تليفوني: ${formData.phone}`;
    window.open(
      `https://wa.me/2${SITE_CONFIG.contact.whatsapp}?text=${whatsappMessage}`,
      "_blank"
    );

    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setFormData({ name: "", phone: "", message: "" });
    }, 500);
  };

  const socialLinks = [
    {
      name: "Facebook",
      href: SITE_CONFIG.social.facebook,
      icon: FacebookIcon,
      color: "hover:text-blue-500 hover:border-blue-500/50",
    },
    {
      name: "TikTok",
      href: SITE_CONFIG.social.tiktok,
      icon: TikTokIcon,
      color: "hover:text-pink-400 hover:border-pink-400/50",
    },
    {
      name: "YouTube",
      href: SITE_CONFIG.social.youtube,
      icon: YoutubeIcon,
      color: "hover:text-red-500 hover:border-red-500/50",
    },
    {
      name: "Instagram",
      href: SITE_CONFIG.social.instagram,
      icon: InstagramIcon,
      color: "hover:text-pink-500 hover:border-pink-500/50",
    },
    {
      name: "WhatsApp",
      href: SITE_CONFIG.social.whatsappChannel,
      icon: ({ size = 24 }: { size?: number }) => (
        <MessageCircle size={size} />
      ),
      color: "hover:text-green-400 hover:border-green-400/50",
    },
  ];

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
              <MessageCircle size={16} className="text-cyan" />
              <span className="text-sm font-semibold text-cyan">
                تواصل معنا
              </span>
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              خلينا{" "}
              <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                نتكلم
              </span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              عندك فكرة، استفسار، أو عايز تبدأ مشروع؟ فريقنا جاهز يسمعك ويساعدك.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== المحتوى ==================== */}
      <section className="container mx-auto px-4 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ==================== معلومات التواصل ==================== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* واتساب */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6 transition-all hover:border-green-500/50 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex-shrink-0">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">
                    أسرع طريقة للتواصل
                  </p>
                  <h3 className="text-white font-bold mb-1">واتساب</h3>
                  <p className="text-green-400 text-sm font-semibold">
                    {SITE_CONFIG.contact.whatsapp}
                  </p>
                  <p className="text-xs text-cyan mt-2 group-hover:underline">
                    اضغط للمحادثة →
                  </p>
                </div>
              </div>
            </a>

            {/* تليفون */}
            <a
              href={`tel:${SITE_CONFIG.contact.phone}`}
              className="block rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6 transition-all hover:border-cyan/50 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-blue-500 flex-shrink-0">
                  <Phone size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">اتصل بنا</p>
                  <h3 className="text-white font-bold mb-1">تليفون</h3>
                  <p className="text-cyan text-sm font-semibold">
                    {SITE_CONFIG.contact.phone}
                  </p>
                </div>
              </div>
            </a>

            {/* إيميل */}
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="block rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6 transition-all hover:border-purple/50 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-pink-500 flex-shrink-0">
                  <Mail size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">
                    للاستفسارات
                  </p>
                  <h3 className="text-white font-bold mb-1">إيميل</h3>
                  <p className="text-purple-400 text-sm font-semibold break-all">
                    {SITE_CONFIG.contact.email}
                  </p>
                </div>
              </div>
            </a>

            {/* ساعات العمل - دائماً */}
            <div className="rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex-shrink-0">
                  <Clock size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">متاحين</p>
                  <h3 className="text-white font-bold mb-1">ساعات العمل</h3>
                  <p className="text-white/70 text-sm">
                 دائماً في خدمتك
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    بنرد على واتساب في أي وقت
                  </p>
                </div>
              </div>
            </div>

            {/* سوشيال ميديا */}
            <div className="rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6">
              <p className="text-sm text-white/60 mb-4">
                تابعنا على منصات التواصل
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all hover:scale-110 hover:bg-white/10 ${social.color}`}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ==================== النموذج ==================== */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-purple">
                  <Send size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    ابعتلنا رسالة
                  </h2>
                  <p className="text-white/50 text-sm">
                    هنرد عليك في أقرب وقت
                  </p>
                </div>
              </div>

              {success && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/50 bg-green-500/10 p-4">
                  <CheckCircle2
                    size={20}
                    className="text-green-400 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-green-400 font-semibold text-sm">
                      تم فتح واتساب بنجاح
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      لو مفتحش، اضغط على زر الواتساب في المعلومات الجانبية
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
                  <AlertCircle
                    size={20}
                    className="text-red-400 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label-field">
                    الاسم <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="اسمك الكامل"
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
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label-field">
                    رسالتك <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="اكتب رسالتك أو استفسارك..."
                    rows={6}
                    className="input-field resize-none"
                    required
                  />
                  <p className="text-xs text-white/40 mt-1">
                    {formData.message.length} / 20 حرف على الأقل
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-4 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      إرسال عبر واتساب
                    </>
                  )}
                </button>

                <p className="text-xs text-white/40 text-center">
                  💡 الرسالة هتفتح في واتساب مع كل التفاصيل جاهزة
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="container mx-auto px-4 lg:px-8 pb-16">
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
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              جاهز تبدأ مشروعك؟
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              متستناش — ابدأ دلوقتي واختار الخدمة اللي تناسبك من المتجر.
            </p>

            <a
              href="/store"
              className="btn-primary inline-flex text-base px-8 py-4"
            >
              تصفح المتجر
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}