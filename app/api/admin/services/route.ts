import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 🛑 منع Next.js من عمل كاش لهذا الـ Route نهائيًا
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ==================== جلب كل الخدمات ====================
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeInactive = searchParams.get("includeInactive") === "true";

    let query = supabaseAdmin
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;

    // إرجاع البيانات مع منع الكاش
    return NextResponse.json(
      { success: true, services: data || [] },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}

// ==================== إضافة خدمة جديدة ====================
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      slug,
      title_ar,
      title_en,
      category,
      category_label,
      short_description,
      full_description,
      price,
      delivery_time,
      features,
      cover_gradient,
      cover_image_url,
      video_url,
      media_files,
      icon,
      featured,
      display_order,
    } = body;

    if (!slug || !title_ar || !title_en || !category || !price) {
      return NextResponse.json(
        { error: "الحقول الأساسية ناقصة" },
        { status: 400 }
      );
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          error:
            "الـ slug يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط",
        },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from("services")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "هذا الـ slug مستخدم بالفعل" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("services")
      .insert({
        slug,
        title_ar,
        title_en,
        category,
        category_label,
        short_description,
        full_description,
        price: Number(price),
        delivery_time,
        features: features || [],
        cover_gradient: cover_gradient || "from-cyan to-blue-500",
        cover_image_url: cover_image_url || null,
        video_url: video_url || null,
        media_files: media_files || [],
        icon: icon || "🎬",
        featured: featured || false,
        display_order: display_order || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, service: data });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}