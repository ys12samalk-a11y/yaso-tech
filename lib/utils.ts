import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// دمج الـ classes بذكاء
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// تنسيق السعر بالجنيه المصري
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

// توليد رقم طلب فريد
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `YASO-${year}-${random}`;
}

// التحقق من رقم التليفون المصري
export function isValidEgyptianPhone(phone: string): boolean {
  return /^01[0-2,5]\d{8}$/.test(phone);
}