"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/adminClient";

const NAV = [
  { href: "/admin/owners", label: "Owners" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/payments", label: "Thanh toán" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin";

  function logout() {
    clearToken();
    router.replace("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLogin && (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-[var(--stem-green)] px-5 py-3 text-white">
          <div className="flex items-center gap-4">
            <span className="font-bold">ZBVN Admin</span>
            <nav className="flex gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    pathname === n.href ? "bg-white/25 font-semibold" : "hover:bg-white/15"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <button onClick={logout} className="rounded-full bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25">
            Đăng xuất
          </button>
        </header>
      )}
      <div className="mx-auto max-w-6xl px-5 py-6">{children}</div>
    </div>
  );
}
