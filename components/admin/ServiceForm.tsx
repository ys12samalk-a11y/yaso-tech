"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  Save,
} from "lucide-react";
import { ServiceDB } from "@/lib/services-db";
import MediaUploader from "./MediaUploader";

type ServiceCategory = "ai-video" | "design" | "web" | "social";

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: "ai-video", label: "فيديو AI" },
  { id: "design", label: "تصميم" },
  { id: "web", label: "تطوير ويب" },
  { id: "social", label: "سوشيال ميديا" },
];

const GRADIENTS = [
  { value: "from-cyan to-blue-500", label: "سماوي → أزرق" },
  { value: "from-purple to-pink-500", label: "بنفسجي → وردي" },
  { value: "from-cyan to-purple", label: "سماوي → بنفسجي" },
  { value: "from-purple to-cyan", label: "بنفسجي → سماوي" },
  { value: "from-pink-500 to-purple", label: "وردي → بنفسجي" },
  { value: "from-orange-500 to-red-500", label: "برتقالي → أحمر" },
  { value: "from-yellow-400 to-orange-500", label: "أصفر → برتقالي" },
  { value: "from-pink-400 to-rose-500", label: "وردي → روز" },
  { value: "from-blue-500 to-cyan", label: "أزرق → سماوي" },
  { value: "from-purple to-indigo-500", label: "بنفسجي → نيلي" },
];

const ICONS = [
  "🎬",
  "🎨",
  "💻",
  "📱",
  "✨",
  "🚀",
  "🎯",
  "💍",
  "🎂",
  "🍽️",
  "📦",
  "🌐",
  "🛒",
  "📊",
  "🎥",
];

type FormData = {
  slug: string;
  title_ar: string;
  title_en: string;
  category: ServiceCategory;
  category_label: string;
  short_description: string;
  full_description: string;
  price: number;
  delivery_time: string;
  features: string[];
  cover_gradient: string;
  cover_image_url: string | null;
  video_url: string | null;
  media_files: { name: string; url: string; type: string }[];
  icon: string;
  featured: boolean;
  is_active: boolean;
  display_order: number;
};

export default function ServiceForm({
  initialData,
  mode = "create",
  id,
}: {
  initialData?: ServiceDB | null;
  mode?: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    slug: initialData?.slug || "",
    title_ar: initialData?.title_ar || "",
    title_en: initialData?.title_en || "",
    category: (initialData?.category as ServiceCategory) || "ai-video",
    category_label:
      initialData?.category_label ||
      CATEGORIES.find((c) => c.id === "ai-video")?.label ||
      "فيديو AI",
    short_description: initialData?.short_description || "",
    full_description: initialData?.full_description || "",
    price: initialData?.price || 0,
    delivery_time: initialData?.delivery_time || "",
    features: initialData?.features || [],
    cover_gradient: initialData?.cover_gradient || "from-cyan to-blue-500",
    cover_image_url: initialData?.cover_image_url || null,
    video_url: initialData?.video_url || null,
    media_files: initialData?.media_files || [],
    icon: initialData?.icon || "🎬",
    featured: initialData?.featured || false,
    is_active: initialData?.is_active ?? true,
    display_order: initialData?.display_order || 0,
  });

  const [newFeature, setNewFeature] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: ServiceCategory) => {
    const label = CATEGORIES.find((c) => c.id === category)?.label || "";
    setForm((prev) => ({ ...prev, category, category_label: label }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !form.features.includes(newFeature.trim())) {
      setForm((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.slug.trim() || !form.title_ar.trim() || !form.title_en.trim()) {
      setError("الحقول الأساسية مطلوبة");
      return;
    }

    if (form.price <= 0) {
      setError("السعر يجب أن يكون أكبر من صفر");
      return;
    }

    if (form.features.length === 0) {
      setError("أضف ميزة واحدة على الأقل");
      return;
    }

    setSubmitting(true);

    // ✅ استخدام id الـ prop أولاً، ثم initialData.id
    const targetId = id || initialData?.id;

    try {
      const url =
        mode === "create"
          ? "/api/admin/services"
          : `/api/admin/services/${targetId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل الحفظ");
      }

      setSuccess(
        mode === "create"
          ? "تم إضافة الخدمة بنجاح ✅"
          : "تم تحديث الخدمة بنجاح ✅"
      );

      setTimeout(() => {
        router.push("/admin/services");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* رسائل */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <AlertCircle
            size={20}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-500/50 bg-green-500/10 p-4">
          <CheckCircle2
            size={20}
            className="text-green-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      {/* المعلومات الأساسية */}
      <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          المعلومات الأساسية
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-field">
              الـ Slug (بالإنجليزي - بدون مسافات) *
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                updateField(
                  "slug",
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                )
              }
              placeholder="مثال: ai-ad-video"
              className="input-field font-mono"
              required
            />
            <p className="text-xs text-white/40 mt-1">
              أحرف إنجليزية صغيرة، أرقام، وشرطات فقط
            </p>
          </div>

          <div>
            <label className="label-field">الاسم بالعربي *</label>
            <input
              type="text"
              value={form.title_ar}
              onChange={(e) => updateField("title_ar", e.target.value)}
              placeholder="مثال: فيديو إعلاني احترافي"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-field">الاسم بالإنجليزي *</label>
            <input
              type="text"
              value={form.title_en}
              onChange={(e) => updateField("title_en", e.target.value)}
              placeholder="AI Ad Video"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-field">التصنيف *</label>
            <select
              value={form.category}
              onChange={(e) =>
                handleCategoryChange(e.target.value as ServiceCategory)
              }
              className="input-field"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">السعر (جنيه) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
              placeholder="800"
              min="0"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-field">مدة التنفيذ *</label>
            <input
              type="text"
              value={form.delivery_time}
              onChange={(e) => updateField("delivery_time", e.target.value)}
              placeholder="مثال: 3-5 أيام"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-field">ترتيب العرض</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) =>
                updateField("display_order", Number(e.target.value))
              }
              placeholder="0"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* الوسائط */}
      <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          🖼️ الوسائط
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MediaUploader
            label="صورة الغلاف (Cover Image)"
            hint="JPG / PNG / WebP / GIF — 50 ميجا كحد أقصى"
            accept="image/*"
            type="image"
            value={form.cover_image_url}
            onChange={(url) => updateField("cover_image_url", url)}
          />

          <MediaUploader
            label="فيديو (اختياري)"
            hint="MP4 / WebM — 50 ميجا كحد أقصى"
            accept="video/mp4,video/webm"
            type="video"
            value={form.video_url}
            onChange={(url) => updateField("video_url", url)}
          />
        </div>

        <p className="text-xs text-white/40 mt-4">
          💡 لو مضفتش صورة، هيتعرض الإيموجي والتدرج اللوني
        </p>
      </div>

      {/* الأوصاف */}
      <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
        <h2 className="text-lg font-bold text-white mb-4">الأوصاف</h2>

        <div className="space-y-4">
          <div>
            <label className="label-field">
              الوصف القصير (يظهر في البطاقة) *
            </label>
            <textarea
              value={form.short_description}
              onChange={(e) => updateField("short_description", e.target.value)}
              placeholder="وصف مختصر..."
              rows={2}
              className="input-field resize-none"
              required
            />
          </div>

          <div>
            <label className="label-field">
              الوصف الكامل (يظهر في صفحة التفاصيل) *
            </label>
            <textarea
              value={form.full_description}
              onChange={(e) => updateField("full_description", e.target.value)}
              placeholder="الوصف التفصيلي الكامل..."
              rows={5}
              className="input-field resize-none"
              required
            />
          </div>
        </div>
      </div>

      {/* المميزات */}
      <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          المميزات ({form.features.length})
        </h2>

        <div className="space-y-3 mb-4">
          {form.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-navy p-3"
            >
              <CheckCircle2 size={16} className="text-cyan flex-shrink-0" />
              <p className="flex-1 text-white text-sm">{feature}</p>
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFeature();
              }
            }}
            placeholder="أضف ميزة واضغط Enter..."
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="rounded-xl bg-cyan/20 border border-cyan/50 px-4 text-cyan hover:bg-cyan/30 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* المظهر */}
      <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
        <h2 className="text-lg font-bold text-white mb-4">المظهر</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label-field">التدرج اللوني</label>
            <select
              value={form.cover_gradient}
              onChange={(e) => updateField("cover_gradient", e.target.value)}
              className="input-field"
            >
              {GRADIENTS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">الأيقونة (Emoji)</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => updateField("icon", icon)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-all ${
                    form.icon === icon
                      ? "border-cyan bg-cyan/20"
                      : "border-white/10 bg-navy hover:border-cyan/50"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* معاينة */}
        <div
          className={`relative aspect-video w-full rounded-xl bg-gradient-to-br ${form.cover_gradient} overflow-hidden mb-4`}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(#ffffff30 1px, transparent 1px),
                                linear-gradient(90deg, #ffffff30 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl drop-shadow-2xl">{form.icon}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="accent-cyan w-5 h-5"
            />
            <span className="text-white/80 text-sm">خدمة مميزة (Featured)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => updateField("is_active", e.target.checked)}
              className="accent-cyan w-5 h-5"
            />
            <span className="text-white/80 text-sm">نشطة (ظاهرة في المتجر)</span>
          </label>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex-1 py-4 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save size={20} />
              {mode === "create" ? "إضافة الخدمة" : "حفظ التعديلات"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="btn-secondary px-6"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}