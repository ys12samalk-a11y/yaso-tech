import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateOrderNumber, isValidEgyptianPhone } from "@/lib/utils";

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
      service_id,
      service_slug,
      service_title,
      customer_name,
      customer_phone,
      customer_email,
      project_details,
      budget,
      deadline,
      reference_link,
      payment_method,
      payment_amount,
      payment_screenshot_url,
    } = body;

    // ==================== التحقق من البيانات ====================

    if (!customer_name || customer_name.trim().length < 3) {
      return NextResponse.json(
        { error: "الاسم يجب أن يكون 3 أحرف على الأقل" },
        { status: 400 }
      );
    }

    if (!customer_phone || !isValidEgyptianPhone(customer_phone)) {
      return NextResponse.json(
        { error: "رقم التليفون غير صحيح (مثال: 01012345678)" },
        { status: 400 }
      );
    }

    if (!project_details || project_details.trim().length < 20) {
      return NextResponse.json(
        { error: "وصف المشروع يجب أن يكون 20 حرفًا على الأقل" },
        { status: 400 }
      );
    }

    if (!payment_screenshot_url) {
      return NextResponse.json(
        { error: "يجب رفع اسكرين التحويل" },
        { status: 400 }
      );
    }

    if (!service_slug || !service_title || !payment_amount) {
      return NextResponse.json(
        { error: "بيانات الخدمة ناقصة" },
        { status: 400 }
      );
    }

    // ==================== إنشاء رقم طلب فريد ====================

    let orderNumber = generateOrderNumber();
    let attempts = 0;

    // التأكد إن الرقم مش مستخدم
    while (attempts < 5) {
      const { data: existing } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    // ==================== حفظ الطلب ====================

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        service_id,
        service_slug,
        service_title,
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        customer_email: customer_email?.trim() || null,
        project_details: project_details.trim(),
        budget: budget?.trim() || null,
        deadline: deadline?.trim() || null,
        reference_link: reference_link?.trim() || null,
        payment_method: payment_method || "cash",
        payment_amount,
        payment_screenshot_url,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "فشل حفظ الطلب. حاول مرة تانية." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: data.id,
        order_number: data.order_number,
        status: data.status,
        created_at: data.created_at,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}