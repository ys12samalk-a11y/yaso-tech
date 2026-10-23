import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    // جلب كل الطلبات
    const { data: allOrders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    const orders = allOrders || [];

    // الإحصائيات
    const stats = {
      total_orders: orders.length,
      pending_orders: orders.filter((o) => o.status === "pending").length,
      confirmed_orders: orders.filter((o) => o.status === "confirmed").length,
      total_revenue: orders
        .filter((o) => ["confirmed", "in_progress", "completed"].includes(o.status))
        .reduce((sum, o) => sum + Number(o.payment_amount), 0),
    };

    // أحدث 5 طلبات
    const recent_orders = orders.slice(0, 5).map((o) => ({
      id: o.id,
      order_number: o.order_number,
      customer_name: o.customer_name,
      service_title: o.service_title,
      payment_amount: o.payment_amount,
      status: o.status,
      created_at: o.created_at,
    }));

    return NextResponse.json({ stats, recent_orders });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}