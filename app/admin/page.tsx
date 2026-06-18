"use client";

import { useCallback, useEffect, useState } from "react";
import { getToken, setToken, clearToken, adminFetch } from "@/lib/adminClient";
import { catMeta } from "@/lib/adminCats";

const vnd = (n: number) => (n || 0).toLocaleString("vi-VN") + "đ";
const dt = (s: string) => new Date(s).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function AdminHome() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => { setAuthed(!!getToken()); }, []);
  if (authed === null) return null; // avoid flash / hydration mismatch
  return authed ? <Dashboard /> : <LoginForm />;
}

function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError("");
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
      window.location.href = "/admin"; // full reload so layout shows nav + dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-2xl font-bold text-[var(--stem-green)]">ZBVN Admin</h1>
        <p className="mb-6 text-sm text-gray-500">Đăng nhập Bridge</p>
        <div className="space-y-4">
          <input name="user" placeholder="Tài khoản" required className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-[var(--stem-green)]" />
          <input name="pass" type="password" placeholder="Mật khẩu" required className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-[var(--stem-green)]" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[var(--stem-green)] py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </div>
      </form>
    </div>
  );
}

type Dash = {
  stats: {
    owners: { total: number; active: number; pending: number };
    orders: { total: number; thisMonth: number };
    payments: { total: number; pending: number };
    inquiries: { total: number; last7d: number };
  };
  recent: {
    orders: { id: number; buyerName: string; amount: number; createdAt: string; owner: { name: string } | null }[];
    inquiries: { id: number; name: string; category: string; createdAt: string }[];
    payments: { id: number; amount: number; createdAt: string; owner: { name: string } | null }[];
  };
};

function Dashboard() {
  const [data, setData] = useState<Dash | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/dashboard");
      setData(await res.json());
    } catch {
      clearToken();
      window.location.href = "/admin";
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="text-gray-500">Đang tải…</p>;
  if (!data) return null;
  const s = data.stats;

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-[var(--ink)]">Tổng quan</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Owners" value={s.owners.total} sub={`${s.owners.active} active · ${s.owners.pending} pending`} accent="#4B6F44" />
        <StatCard title="Đơn hàng" value={s.orders.total} sub={`${s.orders.thisMonth} tháng này`} accent="#1D4ED8" />
        <StatCard title="Thanh toán" value={s.payments.total} sub={`${s.payments.pending} đang chờ`} accent="#C05000" />
        <StatCard title="Inquiries" value={s.inquiries.total} sub={`${s.inquiries.last7d} trong 7 ngày`} accent="#B8860B" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Đơn hàng mới nhất">
          {data.recent.orders.length === 0 ? <Empty /> : data.recent.orders.map((o) => (
            <Row key={o.id} main={o.owner?.name || "—"} sub={`${o.buyerName} · ${vnd(o.amount)}`} time={dt(o.createdAt)} />
          ))}
        </Panel>
        <Panel title="Inquiry mới nhất">
          {data.recent.inquiries.length === 0 ? <Empty /> : data.recent.inquiries.map((q) => {
            const c = catMeta(q.category);
            return <Row key={q.id} main={q.name} sub={`${c.emoji} ${c.label}`} time={dt(q.createdAt)} />;
          })}
        </Panel>
        <Panel title="Thanh toán đang chờ">
          {data.recent.payments.length === 0 ? <Empty /> : data.recent.payments.map((p) => (
            <Row key={p.id} main={p.owner?.name || "—"} sub={vnd(p.amount)} time={dt(p.createdAt)} />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, accent }: { title: string; value: number; sub: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="mt-1 text-3xl font-extrabold" style={{ color: accent }}>{value}</div>
      <div className="mt-1 text-xs text-gray-400">{sub}</div>
    </div>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-bold text-[var(--ink)]">{title}</div>
      <div className="flex flex-col divide-y divide-gray-50">{children}</div>
    </div>
  );
}
function Row({ main, sub, time }: { main: string; sub: string; time: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-[var(--ink)]">{main}</div>
        <div className="truncate text-xs text-gray-500">{sub}</div>
      </div>
      <span className="shrink-0 text-xs text-gray-400">{time}</span>
    </div>
  );
}
function Empty() {
  return <p className="py-6 text-center text-sm text-gray-400">Chưa có dữ liệu</p>;
}
