import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // التحقق من المدخلات
    if (!email || !password) {
      return NextResponse.json(
        { error: "الإيميل والباسورد مطلوبين" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      return NextResponse.json(
        { error: "إعدادات الأدمن غير مكتملة" },
        { status: 500 }
      );
    }

    // التحقق من الإيميل
    if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
      // تأخير لمنع الـ brute force
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json(
        { error: "الإيميل أو الباسورد غلط" },
        { status: 401 }
      );
    }

    // التحقق من الباسورد
    const isValid = await bcrypt.compare(password, adminPasswordHash);

    if (!isValid) {
      // تأخير لمنع الـ brute force
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json(
        { error: "الإيميل أو الباسورد غلط" },
        { status: 401 }
      );
    }

    // إنشاء الجلسة
    const { token, maxAge } = await createSession(email);

    // إعداد الـ response مع Cookie
    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}