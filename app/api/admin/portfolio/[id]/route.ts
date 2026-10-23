import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ==================== GET — مشروع واحد ====================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "السيرفر غير مهيأ" }, { status: 500 });
    }

    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "المشروع غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error) {
    console.error("Fetch portfolio error:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}

// ==================== PATCH — تعديل ====================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "السيرفر غير مهيأ" }, { status: 500 });
    }

    const { id } = await params;
    const body = await request.json();

    const updates = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, project: data });
  } catch (error) {
    console.error("Update portfolio error:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}

// ==================== DELETE — حذف ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "السيرفر غير مهيأ" }, { status: 500 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("portfolio")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete portfolio error:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}