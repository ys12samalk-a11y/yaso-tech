"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, AlertCircle, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("الإيميل والباسورد مطلوبين");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <motion.div
          className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-cyan/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-purple/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan to-purple shadow-2xl mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            لوحة التحكم
          </h1>
          <p className="text-white/60 text-sm">
            YASO TECH — Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-navy-light/50 backdrop-blur-lg p-6 md:p-8 space-y-5"
        >
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
              <AlertCircle
                size={20}
                className="text-red-400 flex-shrink-0 mt-0.5"
              />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="label-field">الإيميل</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input-field pr-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="label-field">الباسورد</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pr-10"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                <Lock size={20} />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          🔒 هذا القسم محمي بكلمة مرور
        </p>
      </motion.div>
    </div>
  );
}