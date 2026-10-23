"use client";

import { usePathname } from "next/navigation";

export default function BodyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main className={isAdmin ? "min-h-screen" : "pt-24 min-h-screen"}>
      {children}
    </main>
  );
}