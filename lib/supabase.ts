import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// التحقق من المتغيرات
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "⚠️ متغيرات Supabase غير محددة. تأكد من ملف .env.local"
  );
}

// Client للاستخدام في الواجهة الأمامية
// (للإضافة + القراءة المحدودة)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Client للأدمن (للعمليات الحساسة)
// ⚠️ استخدمه فقط في Server Components أو API Routes
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;