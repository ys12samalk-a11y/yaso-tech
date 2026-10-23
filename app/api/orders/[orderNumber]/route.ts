import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

    if (!orderNumber) {
      return NextResponse.json(
        { error: "رقم الطلب مطلوب" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_number, service_title, service_slug, customer_name, payment_amount, payment_method, status, created_at, confirmed_at"
      )
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json(
        { error: "فشل جلب الطلب" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}