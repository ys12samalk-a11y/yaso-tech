import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidEgyptianPhone } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { order_number, customer_phone } = body;

    // التحقق من المدخلات
    if (!order_number || !customer_phone) {
      return NextResponse.json(
        { error: "رقم الطلب ورقم التليفون مطلوبين" },
        { status: 400 }
      );
    }

    if (!isValidEgyptianPhone(customer_phone)) {
      return NextResponse.json(
        { error: "رقم التليفون غير صحيح" },
        { status: 400 }
      );
    }

    // البحث عن الطلب
    // ⚠️ لازم الاتنين يتطابقوا (order_number + customer_phone)
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_number, service_title, service_slug, customer_name, payment_amount, payment_method, status, created_at, confirmed_at, admin_notes"
      )
      .eq("order_number", order_number.trim())
      .eq("customer_phone", customer_phone.trim())
      .maybeSingle();

    if (error) {
      console.error("Track error:", error);
      return NextResponse.json(
        { error: "حدث خطأ في البحث" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "لم نجد طلب بهذه البيانات. تأكد من رقم الطلب ورقم التليفون.",
        },
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