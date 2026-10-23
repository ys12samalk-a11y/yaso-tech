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

    if (error) {
      console.error("GET service error:", error);
      return NextResponse.json(
        { error: "خطأ في قاعدة البيانات" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "الخدمة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service: data });
  } catch (error) {
    console.error("GET service catch:", error);
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

    // تحضير البيانات
    const updates: any = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }
    if (updates.media_files !== undefined && !Array.isArray(updates.media_files)) {
      updates.media_files = [];
    }
    if (updates.features !== undefined && !Array.isArray(updates.features)) {
      updates.features = [];
    }

    // التحقق من وجود الخدمة
    const { data: checkData, error: checkError } = await supabaseAdmin
      .from("services")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("PATCH check error:", checkError);
      return NextResponse.json(
        { error: "خطأ في قاعدة البيانات" },
        { status: 500 }
      );
    }

    if (!checkData) {
      return NextResponse.json(
        { error: "لم يتم العثور على الخدمة لتحديثها" },
        { status: 404 }
      );
    }

    // التحديث
    const { error: updateError } = await supabaseAdmin
      .from("services")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      console.error("PATCH update error:", updateError);
      return NextResponse.json(
        { error: "خطأ في تحديث البيانات" },
        { status: 500 }
      );
    }

    // جلب البيانات المحدثة
    const { data: freshData, error: fetchError } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("PATCH fetch error:", fetchError);
      return NextResponse.json(
        { error: "تم التحديث لكن فشل جلب البيانات" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, service: freshData });
  } catch (error) {
    console.error("PATCH catch error:", error);
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
    console.log("🗑️ DELETE request for ID:", id);

    // 1. نتأكد إن الخدمة موجودة
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("services")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("DELETE check error:", checkError);
      return NextResponse.json(
        { error: "خطأ في قاعدة البيانات", details: checkError.message },
        { status: 500 }
      );
    }

    if (!existing) {
      console.log("❌ Service not found:", id);
      return NextResponse.json(
        { error: "الخدمة غير موجودة" },
        { status: 404 }
      );
    }

    // 2. نحذف
    const { error: deleteError, count } = await supabaseAdmin
      .from("services")
      .delete({ count: "exact" })
      .eq("id", id);

    if (deleteError) {
      console.error("DELETE error:", deleteError);
      return NextResponse.json(
        { error: "فشل حذف الخدمة", details: deleteError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Deleted ${count} row(s) for ID: ${id}`);

    // 3. نتأكد إن الحذف تم فعلاً
    if (count === 0) {
      return NextResponse.json(
        { error: "لم يتم حذف أي صف - قد تكون السياسات تمنع الحذف" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deleted: count });
  } catch (error: any) {
    console.error("DELETE catch error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}