import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ==================== جلب خدمة واحدة ====================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "الخدمة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service: data });
  } catch (error) {
    console.error("Fetch service error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}

// ==================== تعديل خدمة ====================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // التحقق من الـ slug لو اتغير
    if (body.slug) {
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(body.slug)) {
        return NextResponse.json(
          { error: "الـ slug غير صحيح" },
          { status: 400 }
        );
      }

      const { data: existing } = await supabaseAdmin
        .from("services")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "هذا الـ slug مستخدم بالفعل" },
          { status: 400 }
        );
      }
    }

    // تحديث
    const updates: any = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    // تأكد إن السعر رقم
    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    // تأكد إن media_files array
    if (updates.media_files !== undefined && !Array.isArray(updates.media_files)) {
      updates.media_files = [];
    }

    // تأكد إن features array
    if (updates.features !== undefined && !Array.isArray(updates.features)) {
      updates.features = [];
    }

    // ⚠️ استخدام maybeSingle بدل single لتجنب خطأ PGRST116
    const { data, error } = await supabaseAdmin
      .from("services")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "لم يتم العثور على الخدمة لتحديثها" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service: data });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}

// ==================== حذف خدمة ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("services")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}