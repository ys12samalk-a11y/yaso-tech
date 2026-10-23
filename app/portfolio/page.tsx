"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Play, ExternalLink, Eye, ArrowLeft } from "lucide-react";
import { PortfolioDB } from "@/lib/services-db";

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "ai-video", label: "فيديو AI" },
  { id: "design", label: "تصميم" },
  { id: "web", label: "تطوير ويب" },
  { id: "social", label: "سوشيال ميديا" },
] as const;

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<PortfolioDB | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light/50 to-navy" />
          <motion.div
            className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 mb-6">
              <Sparkles size={16} className="text-cyan" />
              <span className="text-sm font-semibold text-cyan">
                معرض الأعمال
              </span>
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              بعض من{" "}
              <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                أعمالنا
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              مجموعة مختارة من المشاريع والأعمال المنفذة في مختلف المجالات
            </p>
          </motion.div>
        </div>
      </section>

      {/* الفلاتر */}
      <section className="container mx-auto px-4 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {FILTERS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                activeFilter === cat.id
                  ? "bg-gradient-to-r from-cyan to-purple text-navy shadow-lg shadow-cyan/30"
                  : "border border-white/10 bg-white/5 text-white/70 hover:border-cyan/50 hover:text-cyan"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>
      </section>

      {/* الأعمال */}
      <section className="container mx-auto px-4 lg:px-8 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 size={40} className="text-cyan animate-spin mx-auto mb-4" />
            <p className="text-white/60">جاري تحميل الأعمال...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">لا توجد أعمال في هذا القسم حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer rounded-2xl border border-white/10 bg-navy-light/50 overflow-hidden hover:border-cyan/50 transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full bg-cyan/20 text-cyan flex items-center justify-center border border-cyan/50">
                      <Eye size={24} />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-navy/80 backdrop-blur-sm border border-white/20 text-xs font-bold text-white px-3 py-1 rounded-full">
                      {project.category_label}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-white/60 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox / تفاصيل المشروع */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-navy-light border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-all"
              >
                ✕
              </button>
              
              <div className="relative aspect-video w-full bg-black">
                {selectedProject.video_url ? (
                  <video src={selectedProject.video_url} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={selectedProject.cover_image_url} alt={selectedProject.title} className="w-full h-full object-contain" />
                )}
              </div>
              
              <div className="p-6 md:p-8">
                <span className="text-cyan text-sm font-bold">{selectedProject.category_label}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">
                  {selectedProject.title}
                </h2>
                <p className="text-white/80 leading-relaxed mb-6 whitespace-pre-wrap">
                  {selectedProject.description}
                </p>
                {selectedProject.project_url && (
                  <a
                    href={selectedProject.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex"
                  >
                    زيارة المشروع
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}