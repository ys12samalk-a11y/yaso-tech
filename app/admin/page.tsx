"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Stats = {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  total_revenue: number;
};

type RecentOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  service_title: string;
  payment_amount: number;
  status: string;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "تحت المراجعة", color: "text-yellow-400 bg-yellow-500/10" },
  confirmed: { label: "مؤكد", color: "text-green-400 bg-green-500/10" },
  in_progress: { label: "قيد التنفيذ", color: "text-cyan bg-cyan/10" },
  completed: { label: "تم التسليم", color: "text-green-400 bg-green-500/10" },
  rejected: { label: "مرفوض", color: "text-red-400 bg-red-500/10" },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "فشل جلب البيانات");
        }

        setStats(data.stats);
        setRecentOrders(data.recent_orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={40} className="text-cyan animate-spin mx-auto mb-4" />
          <p className="text-white/60">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-10">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "إجمالي الطلبات",
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
      color: "from-cyan to-blue-500",
    },
    {
      label: "تحت المراجعة",
      value: stats?.pending_orders || 0,
      icon: Clock,
      color: "from-yellow-400 to-orange-500",
    },
    {
      label: "مؤكدة",
      value: stats?.confirmed_orders || 0,
      icon: CheckCircle2,
      color: "from-green-400 to-emerald-500",
    },
    {
      label: "إجمالي الإيرادات",
      value: formatPrice(stats?.total_revenue || 0),
      icon: DollarSign,
      color: "from-purple to-pink-500",
    },
  ];

  return (
    <div className="p-6 lg:p-10">
      {/* العنوان */}
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          نظرة عامة
        </h1>
        <p className="text-white/60">
          ملخص سريع لأداء المتجر والطلبات
        </p>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-navy-light/50 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <TrendingUp size={18} className="text-white/20" />
              </div>
              <p className="text-white/50 text-sm mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* أحدث الطلبات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/10 bg-navy-light/50"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">أحدث الطلبات</h2>
          <Link
            href="/admin/orders"
            className="text-cyan text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            عرض الكل
            <ArrowLeft size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingBag
              size={40}
              className="text-white/20 mx-auto mb-3"
            />
            <p className="text-white/50">لا توجد طلبات حتى الآن</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentOrders.map((order) => {
              const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.order_number}`}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-cyan text-sm">
                      #{order.order_number}
                    </p>
                    <p className="text-white font-semibold truncate">
                      {order.customer_name}
                    </p>
                    <p className="text-white/50 text-xs truncate">
                      {order.service_title}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent mb-1">
                      {formatPrice(order.payment_amount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}