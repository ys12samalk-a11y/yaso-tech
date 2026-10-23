import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ==================== GET — جلب كل الأعمال ====================
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "السيرفر غير مهيأ" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    let query = supabaseAdmin
      .from("portfolio")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, projects: data || [] });
  } catch (error) {
    console.error("Fetch portfolio error:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}

// ==================== POST — إضافة مشروع ====================
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "السيرفر غير مهيأ" }, { status: 500 });
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      category_label,
      cover_image_url,
      video_url,
      project_url,
      display_order,
      is_featured,
      is_active,
    } = body;

    if (!title || !description || !category || !cover_image_url) {
      return NextResponse.json(
        { error: "الحقول الأساسية ناقصة" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .insert({
        title,
        description,
        category,
        category_label,
        cover_image_url,
        video_url: video_url || null,
        project_url: project_url || null,
        display_order: display_order || 0,
        is_featured: is_featured || false,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, project: data });
  } catch (error) {
    console.error("Create portfolio error:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}