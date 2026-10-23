"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "نظرة عامة",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/orders",
    label: "الطلبات",
    icon: ShoppingBag,
  },
  {
    href: "/admin/services",
    label: "الخدمات",
    icon: Package,
  },
  {
    href: "/admin/portfolio",
    label: "معرض الأعمال",
    icon: ImageIcon,
  },
  {
    href: "/admin/settings",
    label: "الإعدادات",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const closeMobile = () => setIsMobileOpen(false);

  // ==================== محتوى السايدبار ====================
  const SidebarContent = () => (
    <>
      {/* الشعار */}
      <div className="p-6 border-b border-white/10">
        <Link
          href="/admin"
          className="flex items-center gap-2"
          onClick={closeMobile}
        >
          <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
            YASO
          </span>
          <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-2 py-1 rounded">
            ADMIN
          </span>
        </Link>
        <p className="text-white/40 text-xs mt-2">لوحة التحكم</p>
      </div>

      {/* الروابط */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan to-purple text-navy shadow-lg shadow-cyan/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* الجزء السفلي */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all"
        >
          <ExternalLink size={20} />
          عرض الموقع
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar للديسكتوب */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy-light border-l border-white/10 min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* زر الموبايل */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 p-3 rounded-xl bg-navy-light border border-white/10 text-white shadow-lg"
        aria-label="فتح القائمة"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar للموبايل */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/70 z-40"
            onClick={closeMobile}
          />

          {/* Sidebar */}
          <aside className="lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-navy-light border-l border-white/10 z-50 flex flex-col">
            <button
              onClick={closeMobile}
              className="absolute top-4 left-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X size={20} className="text-white" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}