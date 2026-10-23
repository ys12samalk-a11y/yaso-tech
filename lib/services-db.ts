import { supabaseAdmin } from "@/lib/supabase";

// ==================== Type ====================
export type ServiceDB = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  category: "ai-video" | "design" | "web" | "social";
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
  created_at: string;
  updated_at: string;
};

// ==================== جلب كل الخدمات (Admin - يشمل غير النشطة) ====================
export async function fetchAllServices(
  includeInactive = false
): Promise<ServiceDB[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Fetch services error:", error);
    return [];
  }

  return data || [];
}

// ==================== جلب خدمة واحدة ====================
export async function fetchServiceBySlug(
  slug: string
): Promise<ServiceDB | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Fetch service error:", error);
    return null;
  }

  return data;
}

// ==================== جلب خدمة حسب الـ ID ====================
export async function fetchServiceById(
  id: string
): Promise<ServiceDB | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Fetch service error:", error);
    return null;
  }

  return data;
}
// ==================== جلب خدمة واحدة من الـ anon (client) ====================
export async function fetchServiceBySlugPublic(
  slug: string
): Promise<ServiceDB | null> {
  try {
    const res = await fetch(`/api/services/${slug}`);
    
    if (!res.ok) return null;

    const data = await res.json();
    return data.service || null;
  } catch {
    return null;
  }
}

// ==================== جلب كل الخدمات (client) ====================
export async function fetchAllServicesPublic(
  category?: string
): Promise<ServiceDB[]> {
  try {
    const url = category && category !== "all"
      ? `/api/services?category=${category}`
      : "/api/services";

    const res = await fetch(url);

    if (!res.ok) return [];

    const data = await res.json();
    return data.services || [];
  } catch {
    return [];
  }
}
// ==================== Portfolio Type ====================
export type PortfolioDB = {
  id: string;
  title: string;
  description: string;
  category: "ai-video" | "design" | "web" | "social";
  category_label: string;
  cover_image_url: string;
  video_url: string | null;
  project_url: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ==================== جلب الأعمال (Public) ====================
export async function fetchAllPortfolioPublic(): Promise<PortfolioDB[]> {
  try {
    const res = await fetch("/api/portfolio");
    if (!res.ok) return [];
    const data = await res.json();
    return data.projects || [];
  } catch {
    return [];
  }
}