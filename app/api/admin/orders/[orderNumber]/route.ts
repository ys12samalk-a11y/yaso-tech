import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ==================== جلب طلب واحد ====================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const { orderNumber } = await params;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}

// ==================== تحديث الطلب ====================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const { orderNumber } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    // التحقق من الحالة
    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "rejected",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "حالة غير صحيحة" },
        { status: 400 }
      );
    }

    // بناء البيانات المحدثة
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updates.status = status;
      if (status === "confirmed") {
        updates.confirmed_at = new Date().toISOString();
      }
    }

    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes;
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("order_number", orderNumber)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}