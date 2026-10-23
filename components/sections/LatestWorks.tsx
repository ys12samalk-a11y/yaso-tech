"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Image as ImageIcon, Globe } from "lucide-react";

// ⚠️ بيانات تجريبية — تُستبدل بأعمال حقيقية لاحقًا من لوحة التحكم
const PROJECTS = [
  {
    id: 1,
    title: "إعلان مطعم شهير",
    type: "فيديو AI",
    description:
      "فيديو إعلاني احترافي بالذكاء الاصطناعي لمطعم محلي مع موسيقى ومؤثرات بصرية.",
    typeColor: "from-cyan to-blue-500",
    placeholderColor: "from-cyan/30 to-blue-500/30",
    icon: Play,
  },
  {
    id: 2,
    title: "هوية بصرية لبراند ملابس",
    type: "تصميم وهوية",
    description:
      "تصميم هوية بصرية متكاملة تشمل الشعار والألوان والخطوط وكل العناصر البصرية.",
    typeColor: "from-purple to-pink-500",
    placeholderColor: "from-purple/30 to-pink-500/30",
    icon: ImageIcon,
  },
  {
    id: 3,
    title: "متجر إلكتروني للمنتجات",
    type: "تطوير مواقع",
    description:
      "متجر إلكتروني احترافي متجاوب مع كل الأجهزة، مع لوحة تحكم وسلة تسوق.",
    typeColor: "from-cyan to-purple",
    placeholderColor: "from-cyan/30 to-purple/30",
    icon: Globe,
  },
  {
    id: 4,
    title: "دعوة فرح مميزة",
    type: "فيديو AI",
    description:
      "فيديو دعوة فرح إبداعي بالذكاء الاصطناعي مع تصميم رومانسي وألوان أنيقة.",
    typeColor: "from-pink-500 to-purple",
    placeholderColor: "from-pink-500/30 to-purple/30",
    icon: Play,
  },
  {
    id: 5,
    title: "حملة إعلانية لبراند",
    type: "تصميم وهوية",
    description:
      "تصميمات إعلانية متكاملة لحملة تسويقية على السوشيال ميديا بكل المقاسات.",
    typeColor: "from-purple to-cyan",
    placeholderColor: "from-purple/30 to-cyan/30",
    icon: ImageIcon,
  },
  {
    id: 6,
    title: "موقع شركة عقارات",
    type: "تطوير مواقع",
    description:
      "موقع تعريفي احترافي لشركة عقارات مع عرض المشاريع ونموذج تواصل.",
    typeColor: "from-blue-500 to-cyan",
    placeholderColor: "from-blue-500/30 to-cyan/30",
    icon: Globe,
  },
];

export default function LatestWorks() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* خلفية */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy via-navy-light/30 to-navy" />

      <div className="container mx-auto px-4 lg:px-8">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-bold text-cyan tracking-widest mb-3">
            معرض الأعمال
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            أحدث{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              الأعمال
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            مجموعة مختارة من المشاريع والأعمال المنفذة
          </p>
        </motion.div>

        {/* الشبكة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan/20"
              >
                {/* صورة الغلاف (placeholder) */}
                <div
                  className={`relative aspect-video w-full bg-gradient-to-br ${project.placeholderColor} overflow-hidden`}
                >
                  {/* شبكة خفيفة */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(#ffffff20 1px, transparent 1px),
                                        linear-gradient(90deg, #ffffff20 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* أيقونة في المنتصف */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/80 backdrop-blur-sm border border-white/20 transition-transform group-hover:scale-110">
                      <Icon size={28} className="text-white" />
                    </div>
                  </div>

                  {/* شارة نوع الخدمة */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-block rounded-full bg-gradient-to-r ${project.typeColor} px-3 py-1 text-xs font-bold text-white shadow-lg`}
                    >
                      {project.type}
                    </span>
                  </div>
                </div>

                {/* التفاصيل */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-2 text-cyan font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>عرض التفاصيل</span>
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* زر عرض الكل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/portfolio" className="btn-secondary inline-flex">
            شاهد كل الأعمال
            <ArrowLeft size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}