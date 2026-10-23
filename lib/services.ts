// lib/services.ts
// ⚠️ تم تنظيف الملف — البيانات بقت في Supabase (services table)
// استخدم lib/services-db.ts للعمليات على الخدمات

// ==================== التصنيفات ====================
export const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "ai-video", label: "فيديو AI" },
  { id: "design", label: "تصميم" },
  { id: "web", label: "تطوير ويب" },
  { id: "social", label: "سوشيال ميديا" },
] as const;

// ==================== Service Type (Legacy - للتوافق مع الكود القديم) ====================
export type Service = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  category: "ai-video" | "design" | "web" | "social";
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  deliveryTime: string;
  features: string[];
  coverGradient: string;
  icon: string;
  featured?: boolean;
};