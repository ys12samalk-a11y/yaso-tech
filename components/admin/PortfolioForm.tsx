"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Save } from "lucide-react";
import { PortfolioDB } from "@/lib/services-db";
import MediaUploader from "./MediaUploader";

const CATEGORIES = [
  { id: "ai-video", label: "فيديو AI" },
  { id: "design", label: "تصميم" },
  { id: "web", label: "تطوير ويب" },
  { id: "social", label: "سوشيال ميديا" },
];

type FormData = {
  title: string;
  description: string;
  category: string;
  category_label: string;
  cover_image_url: string;
  video_url: string | null;
  project_url: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
};

export default function PortfolioForm({
  initialData,
  mode = "create",
}: {
  initialData?: PortfolioDB | null;
  mode?: "create" | "edit";
}) {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "ai-video",
    category_label: initialData?.category_label || "فيديو AI",
    cover_image_url: initialData?.cover_image_url || "",
    video_url: initialData?.video_url || null,
    project_url: initialData?.project_url || null,
    display_order: initialData?.display_order || 0,
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("اسم المشروع مطلوب");
      return;
    }

    if (!form.description.trim()) {
      setError("الوصف مطلوب");
      return;
    }

    if (!form.cover_image_url) {
      setError("صورة الغلاف مطلوبة");
      return;
    }

    setSubmitting(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/portfolio"
          : `/api/admin/portfolio/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل الحفظ");
      }

      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <AlertCircle
            size={20}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* المعلومات الأساسية */}
      <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">المعلومات الأساسية</h2>

        <div>
          <label className="label-field">
            اسم المشروع <span className="text-red-400">*</span>
          </label>
          <input
            required
            type="text"
            placeholder="مثال: فيديو إعلاني لمطعم"
            className="input-field"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div>
          <label className="label-field">
            الوصف <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="وصف تفصيلي للمشروع..."
            className="input-field resize-none"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">التصنيف</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => {
                const cat = CATEGORIES.find((c) => c.id === e.target.value);
                setForm((p) => ({
                  ...p,
                  category: e.target.value,
                  category_label: cat?.label || "",
                }));
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">ترتيب العرض</label>
            <input
              type="number"
              className="input-field"
              value={form.display_order}
              onChange={(e) =>
                updateField("display_order", parseInt(e.target.value) || 0)
              }
            />
            <p className="text-xs text-white/40 mt-1">
              الأرقام الأصغر تظهر أولاً
            </p>
          </div>
        </div>
      </div>

      {/* الوسائط */}
      <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">🖼️ الوسائط والروابط</h2>

        <MediaUploader
          label="صورة الغلاف *"
          hint="JPG / PNG / WebP — 50 ميجا كحد أقصى"
          type="image"
          value={form.cover_image_url || null}
          onChange={(url) => updateField("cover_image_url", url || "")}
        />

        <MediaUploader
          label="فيديو (اختياري)"
          hint="MP4 / WebM — 50 ميجا كحد أقصى"
          type="video"
          value={form.video_url}
          onChange={(url) => updateField("video_url", url)}
        />

        <div>
          <label className="label-field">
            رابط المشروع (اختياري)
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            className="input-field"
            value={form.project_url || ""}
            onChange={(e) =>
              updateField("project_url", e.target.value || null)
            }
          />
          <p className="text-xs text-white/40 mt-1">
            لو المشروع موقع أو متجر — حط الرابط هنا
          </p>
        </div>
      </div>

      {/* الإعدادات */}
      <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-6">
        <h2 className="text-lg font-bold text-white mb-4">الإعدادات</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => updateField("is_featured", e.target.checked)}
              className="accent-cyan w-5 h-5"
            />
            <span className="text-white/80 text-sm">
              مشروع مميز (يظهر أولاً)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => updateField("is_active", e.target.checked)}
              className="accent-cyan w-5 h-5"
            />
            <span className="text-white/80 text-sm">
              نشط (ظاهر في الموقع)
            </span>
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
              {mode === "create" ? "إضافة المشروع" : "حفظ التعديلات"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/portfolio")}
          className="btn-secondary px-6"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}