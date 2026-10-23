"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Target,
  Smartphone,
  MessageSquare,
  Layers,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "حلول إبداعية مخصصة",
    description:
      "كل مشروع بنصممه حسب احتياجات العميل، مش قوالب جاهزة. أفكار مبتكرة تناسب براندك.",
  },
  {
    icon: Brain,
    title: "دمج الذكاء الاصطناعي",
    description:
      "نستخدم أحدث أدوات AI في الإنتاج والتصميم والتطوير عشان نقدملك نتائج احترافية بسرعة.",
  },
  {
    icon: Target,
    title: "اهتمام بالتفاصيل",
    description:
      "من أصغر تفصيلة في التصميم لأكبر عنصر في الموقع، كل حاجة بتتنفذ بعناية وجودة.",
  },
  {
    icon: Smartphone,
    title: "تصميمات متجاوبة",
    description:
      "موقعك أو تصميمك هيبان مثالي على الموبايل والتابلت والكمبيوتر، بكل المقاسات.",
  },
  {
    icon: MessageSquare,
    title: "تواصل واضح ومتابعة",
    description:
      "من أول ما تطلب لحد ما نسلّم الشغل، بتفضل على تواصل مستمر معانا خطوة بخطوة.",
  },
  {
    icon: Layers,
    title: "تنوع الخدمات",
    description:
      "كل اللي براندك محتاجه في مكان واحد — من الفيديوهات للتصميم للمواقع للسوشيال ميديا.",
  },
];

export default function WhyUs() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* خلفية */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light/40 to-navy" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

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
            لماذا نحن
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            لماذا تختار{" "}
            <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              YASO TECH؟
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            مميزات بتخلينا الخيار الأمثل لتطوير براندك رقميًا
          </p>
        </motion.div>

        {/* الشبكة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl border border-white/10 bg-navy-light/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan/10"
              >
                {/* الأيقونة */}
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/5 text-cyan transition-all group-hover:bg-cyan group-hover:text-navy group-hover:scale-110">
                  <Icon size={22} />
                </div>

                {/* العنوان */}
                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>

                {/* الوصف */}
                <p className="text-sm text-white/60 leading-relaxed">
                  {feature.description}
                </p>

                {/* خط توهج */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}