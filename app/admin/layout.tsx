"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "@/lib/adminClient";

const NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/owners", label: "Owners" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/payments", label: "Thanh toán" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/downtime", label: "Downtime" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Re-check auth on every route change (layout persists across admin routes).
  useEffect(() => {
    setMounted(true);
    setAuthed(!!getToken());
  }, [pathname]);

  function logout() {
    clearToken();
    router.replace("/admin");
    setAuthed(false);
  }

  const showNav = mounted && authed;

  return (
    <div className="min-h-screen bg-gray-50">
      {showNav && (
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-200 bg-[var(--stem-green)] px-5 py-3 text-white">
          <div className="flex min-w-0 items-center gap-4">
            <span className="shrink-0 font-bold">ZBVN Admin</span>
            <nav className="flex gap-1 overflow-x-auto">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${active ? "bg-white/25 font-semibold" : "hover:bg-white/15"}`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button onClick={logout} className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25">
            Đăng xuất
          </button>
        </header>
      )}
      <div className="mx-auto max-w-6xl px-5 py-6">{children}</div>
    </div>
  );
}
