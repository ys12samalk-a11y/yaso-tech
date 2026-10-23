"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  MessageCircle,
  HelpCircle,
  ShoppingBag,
  Palette,
  Code2,
  CreditCard,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/config";

type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: "general" | "services" | "payment" | "delivery";
};

const FAQS: FAQ[] = [
  // ==================== عام ====================
  {
    id: 1,
    question: "ما الخدمات التي يقدمها YASO TECH؟",
    answer:
      "YASO TECH يقدم 4 مجالات رئيسية: (1) إنتاج فيديوهات الذكاء الاصطناعي — فيديوهات إعلانية، دعوات مناسبات، فيديوهات ترويجية. (2) التصميم والهوية البصرية — شعارات، هوية متكاملة، إعلانات سوشيال ميديا. (3) تطوير الويب — مواقع شركات، متاجر إلكترونية، صفحات هبوط. (4) محتوى السوشيال ميديا — منشورات، فيديوهات قصيرة، باقات محتوى.",
    category: "general",
  },
  {
    id: 2,
    question: "كيف يمكن طلب خدمة؟",
    answer:
      "سهل جدًا: (1) ادخل على صفحة المتجر /store. (2) اختر الخدمة اللي تناسبك. (3) اضغط 'اشترِ الآن'. (4) املأ بياناتك. (5) حوّل المبلغ على الرقم اللي هيظهرلك. (6) ارفع صورة التحويل. (7) اضغط 'تأكيد الطلب'. هتستلم رقم طلب تقدر تتابع بيه حالة طلبك في أي وقت.",
    category: "general",
  },
  {
    id: 3,
    question: "هل يمكن تنفيذ فكرة خاصة بي؟",
    answer:
      "طبعًا! كل مشاريعنا مخصصة حسب احتياجات العميل. عند تقديم الطلب، اكتب تفاصيل فكرتك بالكامل في خانة 'وصف المشروع'. فريقنا هيتواصل معاك لمناقشة التفاصيل واقتراح أفضل حل.",
    category: "general",
  },

  // ==================== خدمات ====================
  {
    id: 4,
    question: "ما المعلومات المطلوبة لتنفيذ فيديو إعلاني؟",
    answer:
      "عشان ننفذ فيديو احترافي، محتاجين: (1) اسم البراند/المشروع. (2) وصف المنتج أو الخدمة. (3) الجمهور المستهدف. (4) اللوجو (لو موجود). (5) أي صور أو فيديوهات للمنتج. (6) الألوان المفضلة أو هوية البراند. (7) الأسلوب اللي تفضله (عصري، كلاسيكي، مرح...). (8) موسيقى مفضلة أو نوعها. (9) روابط لفيديوهات مشابهة بتحبها. (10) أي تفاصيل إضافية.",
    category: "services",
  },
  {
    id: 5,
    question: "هل يمكن تصميم موقع متوافق مع الهاتف؟",
    answer:
      "أكيد! كل المواقع اللي بنعملها متجاوبة 100% مع كل الأجهزة — موبايل، تابلت، كمبيوتر. بنختبر الموقع على أحجام شاشات مختلفة قبل التسليم عشان نضمن تجربة ممتازة على كل الأجهزة.",
    category: "services",
  },
  {
    id: 6,
    question: "هل يمكن مشاهدة نماذج الأعمال؟",
    answer:
      "أكيد! عند كل خدمة في المتجر، هتلاقي صور الغلاف وفيديوهات (لو متاحة) بتوضح الشغل السابق. كمان ممكن تتواصل معانا على واتساب عشان نبعتلك أعمال مشابهة لمشروعك.",
    category: "services",
  },

  // ==================== الدفع ====================
  {
    id: 7,
    question: "كيف يتم الاتفاق على السعر وموعد التسليم؟",
    answer:
      "كل خدمة في المتجر ليها سعر ثابت ومدة تنفيذ واضحة. لو عايز تخصيص (إضافات، تعديلات، حجم أكبر)، بنتفق على السعر النهائي في المحادثة على واتساب قبل البدء. موعد التسليم بيحدد حسب حجم المشروع.",
    category: "payment",
  },
  {
    id: 8,
    question: "ما وسائل الدفع المتاحة؟",
    answer:
      "حاليًا بنقبل الدفع كاش (تحويل على الرقم). قريبًا هنضيف محفظة إلكترونية وانستاباي. بعد ما تحوّل المبلغ، بترفع صورة التحويل في الفورم، وفريقنا بيراجعها ويأكد الطلب.",
    category: "payment",
  },
  {
    id: 9,
    question: "متى يتم تأكيد الطلب بعد الدفع؟",
    answer:
      "بعد ما ترفع صورة التحويل وتضغط 'تأكيد الطلب'، طلبك بيروح لفريق المراجعة. عادة بنراجع الطلبات خلال 24 ساعة كحد أقصى. بمجرد ما نتأكد من الدفع، بنبدأ التنفيذ فورًا وهنبلغك على واتساب.",
    category: "payment",
  },

  // ==================== التسليم ====================
  {
    id: 10,
    question: "هل يمكن تعديل العمل بعد التسليم؟",
    answer:
      "أكيد! معظم الخدمات بتشمل تعديلات مجانية (×2 عادةً). بعد التسليم الأول، بتشوف العمل وبتقولنا التعديلات اللي عايزها. بنعدل لحد ما توصل للنتيجة اللي بتتمناها. التعديلات الإضافية ممكن تكون ليها تكلفة بسيطة حسب حجم التعديل.",
    category: "delivery",
  },
  {
    id: 11,
    question: "كيف أتابع حالة طلبي؟",
    answer:
      "بعد تأكيد الطلب، هتستلم رقم طلب فريد (زي: YASO-2026-1234). تقدر تدخل على صفحة 'تتبع الطلب' /track-order، وتدخل رقم الطلب + رقم تليفونك اللي سجلت بيه، وهتشوف حالة طلبك: تحت المراجعة ← تم التأكيد ← قيد التنفيذ ← تم التسليم.",
    category: "delivery",
  },
  {
    id: 12,
    question: "كم مدة تنفيذ المشروع؟",
    answer:
      "كل خدمة ليها مدة تنفيذ محددة بتظهر في صفحتها. المدة بتختلف حسب نوع الخدمة: (1) فيديو عيد ميلاد — 1-3 أيام. (2) فيديو إعلاني — 3-5 أيام. (3) شعار — 3-5 أيام. (4) موقع شركة — 10-15 يوم. (5) متجر إلكتروني — 15-25 يوم. المدد دي تقريبية، وممكن تختلف حسب حجم المشروع.",
    category: "delivery",
  },
];

const CATEGORIES = [
  { id: "all", label: "الكل", icon: HelpCircle },
  { id: "general", label: "عام", icon: Sparkles },
  { id: "services", label: "الخدمات", icon: Palette },
  { id: "payment", label: "الدفع", icon: CreditCard },
  { id: "delivery", label: "التسليم", icon: Truck },
] as const;

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs =
    activeCategory === "all"
      ? FAQS
      : FAQS.filter((faq) => faq.category === activeCategory);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

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
              <HelpCircle size={16} className="text-cyan" />
              <span className="text-sm font-semibold text-cyan">
                الأسئلة الشائعة
              </span>
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              عندك{" "}
              <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                سؤال؟
              </span>{" "}
              لاقي الإجابة هنا
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              جمعنا لك أشهر الأسئلة اللي بتيجي من عملائنا، عشان تلاقي إجابات
              سريعة وواضحة
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== الفلاتر ==================== */}
      <section className="container mx-auto px-4 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-cyan to-purple text-navy shadow-lg shadow-cyan/30"
                    : "border border-white/10 bg-white/5 text-white/70 hover:border-cyan/50 hover:text-cyan"
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* ==================== FAQ List ==================== */}
      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto space-y-3">
          <AnimatePresence mode="wait">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "border-cyan/50 bg-navy-light/70"
                      : "border-white/10 bg-navy-light/30 hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-right"
                  >
                    <span
                      className={`text-base md:text-lg font-bold transition-colors ${
                        isOpen ? "text-cyan" : "text-white"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={22}
                      className={`flex-shrink-0 transition-all ${
                        isOpen
                          ? "rotate-180 text-cyan"
                          : "text-white/40"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="pt-4 border-t border-white/10">
                            <p className="text-white/70 leading-relaxed text-sm md:text-base whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <HelpCircle
                size={48}
                className="text-white/20 mx-auto mb-4"
              />
              <p className="text-white/50">
                لا توجد أسئلة في هذا القسم
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto rounded-3xl border border-cyan/30 bg-gradient-to-br from-navy-light to-navy p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple/10 blur-3xl" />

          <div className="relative">
            <MessageCircle
              size={48}
              className="text-cyan mx-auto mb-4"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              لسه عندك سؤال؟
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              فريقنا جاهز يجاوب على كل استفساراتك. تواصل معانا على واتساب
              وهنرد عليك في أقرب وقت.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getWhatsAppLink(
                  "مرحبًا، عندي استفسار عن خدمات YASO TECH"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
              >
                <MessageCircle size={20} />
                تواصل عبر واتساب
              </a>
              <Link
                href="/store"
                className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
              >
                <ShoppingBag size={20} />
                تصفح المتجر
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}