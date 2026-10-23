import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 ميجا
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "السيرفر غير مهيأ" },
        { status: 500 }
      );
    }

    // استقبال الملف
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم إرسال أي ملف" },
        { status: 400 }
      );
    }

    // التحقق من النوع
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم. يُسمح بـ JPG أو PNG أو WebP" },
        { status: 400 }
      );
    }

    // التحقق من الحجم
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "حجم الملف كبير جدًا. الحد الأقصى 5 ميجا" },
        { status: 400 }
      );
    }

    // تحويل لـ Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // اسم فريد للملف
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `screenshot_${timestamp}_${random}.${ext}`;

    // الرفع لـ Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("payment-screenshots")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "فشل رفع الصورة" },
        { status: 500 }
      );
    }

    // الرابط العام
    const { data: urlData } = supabaseAdmin.storage
      .from("payment-screenshots")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}