"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Phone,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  service_title: string;
  payment_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  pending: {
    label: "تحت المراجعة",
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  confirmed: {
    label: "مؤكد",
    color: "text-green-400 bg-green-500/10 border-green-500/30",
    dot: "bg-green-400",
  },
  in_progress: {
    label: "قيد التنفيذ",
    color: "text-cyan bg-cyan/10 border-cyan/30",
    dot: "bg-cyan",
  },
  completed: {
    label: "تم التسليم",
    color: "text-green-400 bg-green-500/10 border-green-500/30",
    dot: "bg-green-400",
  },
  rejected: {
    label: "مرفوض",
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    dot: "bg-red-400",
  },
};

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "pending", label: "تحت المراجعة" },
  { id: "confirmed", label: "مؤكد" },
  { id: "in_progress", label: "قيد التنفيذ" },
  { id: "completed", label: "تم التسليم" },
  { id: "rejected", label: "مرفوض" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "فشل جلب الطلبات");
        }

        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (activeFilter !== "all") {
      result = result.filter((o) => o.status === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(term) ||
          o.customer_name.toLowerCase().includes(term) ||
          o.customer_phone.includes(term)
      );
    }

    setFilteredOrders(result);
  }, [activeFilter, searchTerm, orders]);

  const getCount = (filterId: string) => {
    if (filterId === "all") return orders.length;
    return orders.filter((o) => o.status === filterId).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={40} className="text-cyan animate-spin mx-auto mb-4" />
          <p className="text-white/60">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      {/* العنوان */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          الطلبات
        </h1>
        <p className="text-white/60">{orders.length} طلب إجمالي</p>
      </div>

      {/* البحث */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث برقم الطلب، الاسم، أو التليفون..."
            className="input-field pr-10"
          />
        </div>
      </div>

      {/* الفلاتر */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((filter) => {
          const count = getCount(filter.id);
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-cyan to-purple text-navy shadow-lg shadow-cyan/30"
                  : "border border-white/10 bg-white/5 text-white/70 hover:border-cyan/50 hover:text-cyan"
              }`}
            >
              {filter.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? "bg-navy/30 text-navy" : "bg-white/10 text-white/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* الخطأ */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
          <AlertCircle
            size={20}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* القائمة */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-navy-light/30 p-16 text-center">
          <ShoppingBag size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg">
            {searchTerm || activeFilter !== "all"
              ? "لا توجد طلبات مطابقة"
              : "لا توجد طلبات حتى الآن"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, index) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/admin/orders/${order.order_number}`}
                  className="block rounded-2xl border border-white/10 bg-navy-light/50 p-5 hover:border-cyan/50 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* رقم الطلب */}
                    <div className="min-w-[140px]">
                      <p className="text-xs text-white/50 mb-1">رقم الطلب</p>
                      <p className="font-mono text-cyan font-bold">
                        #{order.order_number}
                      </p>
                    </div>

                    {/* العميل */}
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-xs text-white/50 mb-1">العميل</p>
                      <p className="text-white font-semibold">
                        {order.customer_name}
                      </p>
                      <p className="text-white/50 text-xs flex items-center gap-1 mt-1">
                        <Phone size={12} />
                        {order.customer_phone}
                      </p>
                    </div>

                    {/* الخدمة */}
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-xs text-white/50 mb-1">الخدمة</p>
                      <p className="text-white text-sm">
                        {order.service_title}
                      </p>
                    </div>

                    {/* المبلغ */}
                    <div className="min-w-[100px]">
                      <p className="text-xs text-white/50 mb-1">المبلغ</p>
                      <p className="font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
                        {formatPrice(order.payment_amount)}
                      </p>
                    </div>

                    {/* التاريخ */}
                    <div className="min-w-[110px]">
                      <p className="text-xs text-white/50 mb-1">التاريخ</p>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(order.created_at).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* الحالة */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${config.color}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                        />
                        {config.label}
                      </span>
                    </div>

                    {/* سهم */}
                    <ArrowLeft
                      size={18}
                      className="text-white/30 group-hover:text-cyan transition-all group-hover:-translate-x-1"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}