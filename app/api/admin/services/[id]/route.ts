import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ==================== جلب خدمة واحدة ====================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      console.error("GET Error: Supabase Admin not initialized");
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const { id } = await params;
    console.log("🔍 [GET] Fetching service with ID:", id);
    console.log("🔍 [GET] ID length:", id?.length);

    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("❌ [GET] Supabase error:", error);
      return NextResponse.json(
        { error: "خطأ في قاعدة البيانات", details: error.message },
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
  } catch (error: any) {
    console.error("❌ [GET] Catch error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر", details: error?.message || "Unknown error" },
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

    // 🔍 تشخيص
    console.log("🔍 [PATCH] ========== START ==========");
    console.log("🔍 [PATCH] ID from URL:", id);
    console.log("🔍 [PATCH] ID length:", id?.length);
    console.log("🔍 [PATCH] ID type:", typeof id);
    console.log("🔍 [PATCH] Body keys:", Object.keys(body));

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

    // 🔍 التحقق من وجود الخدمة قبل التحديث
    console.log("🔍 [PATCH] Checking if service exists...");
    const { data: checkData, error: checkError } = await supabaseAdmin
      .from("services")
      .select("id, title_ar")
      .eq("id", id)
      .maybeSingle();

    console.log("🔍 [PATCH] Check result:", checkData);
    console.log("🔍 [PATCH] Check error:", checkError);

    if (checkError) {
      console.error("❌ [PATCH] Check error:", checkError);
      return NextResponse.json(
        { error: "خطأ في قاعدة البيانات", details: checkError.message },
        { status: 500 }
      );
    }

    if (!checkData) {
      console.log("❌ [PATCH] Service NOT found with ID:", id);
      console.log("❌ [PATCH] ID length was:", id?.length);
      return NextResponse.json(
        {
          error: "لم يتم العثور على الخدمة لتحديثها",
          details: `ID: ${id} (length: ${id?.length})`,
        },
        { status: 404 }
      );
    }

    console.log("✅ [PATCH] Service found:", checkData.title_ar);
    console.log("🔍 [PATCH] Updating now...");

    // ⚠️ التحديث
    const { data, error } = await supabaseAdmin
      .from("services")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("❌ [PATCH] Update error:", error);
      return NextResponse.json(
        { error: "خطأ في قاعدة البيانات", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      console.log("❌ [PATCH] Update returned null (no data)");
      return NextResponse.json(
        { error: "فشل تحديث الخدمة (لم يتم إرجاع بيانات)" },
        { status: 500 }
      );
    }

    console.log("✅ [PATCH] Update SUCCESS:", data.id);
    console.log("🔍 [PATCH] ========== END ==========");
    return NextResponse.json({ success: true, service: data });
  } catch (error: any) {
    console.error("❌ [PATCH] Catch error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر", details: error?.message || "Unknown error" },
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
    console.log("🔍 [DELETE] ID:", id);

    const { error } = await supabaseAdmin
      .from("services")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ [DELETE] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}