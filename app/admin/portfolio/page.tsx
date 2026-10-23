"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { PortfolioDB } from "@/lib/services-db";

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/portfolio?includeInactive=true");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل جلب المشاريع");
      }

      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل الحذف");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (project: PortfolioDB) => {
    try {
      const res = await fetch(`/api/admin/portfolio/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !project.is_active }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل التحديث");
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? data.project : p))
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
          <p className="text-white/60">جاري تحميل الأعمال...</p>
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
            معرض الأعمال
          </h1>
          <p className="text-white/60">{projects.length} مشروع</p>
        </div>

        <Link href="/admin/portfolio/new" className="btn-primary py-3 px-6">
          <Plus size={20} />
          إضافة مشروع
        </Link>
      </div>

      {/* الخطأ */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* القائمة */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-16 text-center">
          <ImageIcon size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg mb-6">لا توجد مشاريع بعد</p>
          <Link
            href="/admin/portfolio/new"
            className="btn-primary inline-flex"
          >
            <Plus size={20} />
            إضافة أول مشروع
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`rounded-2xl border bg-navy-light/50 overflow-hidden transition-all ${
                project.is_active
                  ? "border-white/10"
                  : "border-red-500/30 opacity-70"
              }`}
            >
              {/* الغلاف */}
              <div className="relative aspect-video bg-black">
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                {project.is_featured && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-navy">
                      <Star size={10} fill="currentColor" />
                      مميز
                    </span>
                  </div>
                )}

                {!project.is_active && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="rounded-full bg-red-500/90 px-2 py-1 text-xs font-bold text-white">
                      معطل
                    </span>
                  </div>
                )}

                {project.video_url && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <span className="rounded-full bg-cyan/90 px-2 py-1 text-xs font-bold text-navy">
                      🎬 فيديو
                    </span>
                  </div>
                )}
              </div>

              {/* المحتوى */}
              <div className="p-4">
                <p className="text-xs font-bold text-cyan mb-1">
                  {project.category_label}
                </p>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* الأزرار */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/portfolio/${project.id}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-cyan/10 border border-cyan/30 py-2 text-cyan text-sm font-semibold hover:bg-cyan/20 transition-all"
                  >
                    <Edit size={14} />
                    تعديل
                  </Link>

                  <button
                    onClick={() => handleToggleActive(project)}
                    className={`p-2 rounded-lg border transition-all ${
                      project.is_active
                        ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                        : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                    }`}
                    title={project.is_active ? "تعطيل" : "تفعيل"}
                  >
                    {project.is_active ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={deletingId === project.id}
                    className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    title="حذف"
                  >
                    {deletingId === project.id ? (
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