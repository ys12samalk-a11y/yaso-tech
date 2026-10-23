import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("⚠️ JWT_SECRET غير محدد في .env.local");
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

const COOKIE_NAME = "yaso_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 أيام

// ==================== إنشاء Session ====================
export async function createSession(email: string) {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secretKey);

  return { token, cookieName: COOKIE_NAME, maxAge: SESSION_DURATION };
}

// ==================== التحقق من Session ====================
export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

// ==================== اسم الـ Cookie ====================
export const SESSION_COOKIE = COOKIE_NAME;