"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Users,
  Rocket,
  Brain,
  Palette,
  Code2,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { SITE_CONFIG, getWhatsAppLink } from "@/lib/config";

const VALUES = [
  {
    icon: Sparkles,
    title: "إبداع بلا حدود",
    description:
      "كل مشروع بنبدأه من الصفر — بأفكار مبتكرة مصممة خصيصًا ليك، مش قوالب جاهزة.",
  },
  {
    icon: Target,
    title: "التركيز على النتائج",
    description:
      "هدفنا إن شغلك يوصل للعميل الصح ويحقق النتيجة اللي عايزها. الجودة قبل الكمية.",
  },
  {
    icon: Users,
    title: "شراكة حقيقية",
    description:
      "مش بس بننفذ، إحنا بنشتغل معاك خطوة بخطوة عشان نضمن إن النتيجة هي اللي إنت عايزها.",
  },
  {
    icon: Rocket,
    title: "سرعة والتزام",
    description:
      "بنحترم وقتك. كل مشروع ليه موعد تسليم واضح، وبنلتزم بيه.",
  },
];

const SERVICES_SUMMARY = [
  {
    icon: Brain,
    title: "الذكاء الاصطناعي",
    description: "فيديوهات AI احترافية بأحدث الأدوات",
  },
  {
    icon: Palette,
    title: "التصميم والهوية",
    description: "شعارات وهويات بصرية متكاملة",
  },
  {
    icon: Code2,
    title: "تطوير الويب",
    description: "مواقع ومتاجر إلكترونية احترافية",
  },
  {
    icon: Sparkles,
    title: "السوشيال ميديا",
    description: "محتوى وإعلانات جذابة",
  },
];

const STATS = [
  { value: "13+", label: "خدمة متاحة" },
  { value: "4", label: "مجالات إبداعية" },
  { value: "24/7", label: "دعم فني" },
  { value: "100%", label: "التزام بالجودة" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ==================== Hero ==================== */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* خلفية */}
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

        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 mb-6">
              <Sparkles size={16} className="text-cyan" />
              <span className="text-sm font-semibold text-cyan">
                من نحن
              </span>
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              براند{" "}
              <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                إبداعي وتقني
              </span>{" "}
              يجمع بين الفن والتقنية
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              {SITE_CONFIG.brand.name} براند يقدم خدمات رقمية تجمع بين الذكاء
              الاصطناعي والتصميم والهوية البصرية وتطوير الويب. نعمل على تحويل
              الأفكار إلى محتوى بصري وحلول رقمية تساعد الأفراد والمشروعات على
              تقديم خدماتهم بصورة عصرية واحترافية.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== Stats ==================== */}
      <section className="container mx-auto px-4 lg:px-8 -mt-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent mb-1">
                {stat.value}
              </p>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ==================== Story ==================== */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-bold text-cyan tracking-widest">
              قصتنا
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-6">
              وراء كل مشروع ناجح...
            </h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                {SITE_CONFIG.brand.name} بدأ بفكرة بسيطة — إن الأفكار الكبيرة
                مش لازم تحتاج فريق ضخم. بمزيج من الشغف بالتقنية والإبداع،
                بدأنا نقدم خدمات رقمية متكاملة لأصحاب المشاريع والبراندات اللي
                عايزة تظهر بصورة احترافية.
              </p>
              <p>
                يقف وراء البراند{" "}
                <span className="text-cyan font-semibold">
                  {SITE_CONFIG.brand.owner}
                </span>
                ، مع اهتمام بالتقنية والإبداع والتصميم وتوظيف أدوات الذكاء
                الاصطناعي في تنفيذ الأفكار.
              </p>
              <p>
                النهارده، نقدم 13+ خدمة تغطي كل احتياجات براندك الرقمية — من
                الفيديوهات الإعلانية للتصميم للمواقع للمحتوى.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {SERVICES_SUMMARY.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-purple flex-shrink-0">
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">
                      {service.title}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ==================== Values ==================== */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy via-navy-light/30 to-navy" />

        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-bold text-cyan tracking-widest">
              قيمنا
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
              المبادئ اللي بنشتغل بيها
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              مش بس خدمات — إحنا شركاء في نجاح براندك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-sm p-6 transition-all hover:border-cyan/50 hover:-translate-y-1"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/5 text-cyan transition-all group-hover:bg-cyan group-hover:text-navy group-hover:scale-110">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              جاهز تبدأ مشروعك؟
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              تواصل معنا الآن وناقشنا في فكرتك. فريق {SITE_CONFIG.brand.name}{" "}
              جاهز يحوّل رؤيتك إلى واقع رقمي احترافي.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/store"
                className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
              >
                <CheckCircle2 size={20} />
                تصفح خدماتنا
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
              >
                <MessageCircle size={20} />
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}