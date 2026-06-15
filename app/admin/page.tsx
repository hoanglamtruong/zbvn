"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, setToken } from "@/lib/adminClient";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin/owners");
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: form.get("user"), pass: form.get("pass") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");
      setToken(data.token);
      router.replace("/admin/owners");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-2xl font-bold text-[var(--stem-green)]">ZBVN Admin</h1>
        <p className="mb-6 text-sm text-gray-500">Đăng nhập Bridge</p>
        <div className="space-y-4">
          <input
            name="user"
            placeholder="Tài khoản"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-[var(--stem-green)]"
          />
          <input
            name="pass"
            type="password"
            placeholder="Mật khẩu"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-[var(--stem-green)]"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--stem-green)] py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </div>
      </form>
    </div>
  );
}
