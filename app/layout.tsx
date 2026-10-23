import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YASO TECH — AI • DESIGN • BRANDING • WEB",
  description:
    "نقدم حلولًا إبداعية وتقنية تشمل إنتاج فيديوهات الذكاء الاصطناعي، والتصميم والهوية البصرية، والإعلانات الرقمية، وتصميم المواقع والمتاجر الإلكترونية.",
  keywords: [
    "YASO TECH",
    "AI Video",
    "تصميم",
    "هوية بصرية",
    "تصميم مواقع",
    "سوشيال ميديا",
  ],
  openGraph: {
    title: "YASO TECH",
    description: "AI • DESIGN • BRANDING • WEB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${inter.variable} font-cairo bg-navy text-white antialiased`}
      >
        <Navbar />
        <main className="pt-24 min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}