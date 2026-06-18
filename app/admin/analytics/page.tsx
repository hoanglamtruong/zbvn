"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";
import { catMeta } from "@/lib/adminCats";

const vnd = (n: number) => (n || 0).toLocaleString("vi-VN") + "đ";

type Analytics = {
  inquiriesByCategory: { category: string; count: number }[];
  top3: { category: string; count: number }[];
  funnel: { new: number; contacted: number; onboarded: number; total: number; contactedRate: number; onboardedRate: number };
  owners: { active: number; pending: number; suspended: number; downtime: number; byCategory: { category: string; count: number }[] };
  revenue: { months: { label: string; commission: number }[]; paymentsPaid: number; paymentsPending: number; paymentsOverdue: number };
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [d, setD] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setD(await (await adminFetch("/api/admin/analytics")).json()); }
      catch { router.replace("/admin"); }
      finally { setLoading(false); }
    })();
  }, [router]);

  if (loading) return <p className="text-gray-500">Đang tải…</p>;
  if (!d) return null;

  const maxCat = Math.max(1, ...d.inquiriesByCategory.map((c) => c.count));
  const maxRev = Math.max(1, ...d.revenue.months.map((m) => m.commission));
  const ownerTotal = d.owners.active + d.owners.pending + d.owners.suspended || 1;
  const ownerCatMax = Math.max(1, ...d.owners.byCategory.map((c) => c.count));

  return (
    <div className="space-y-7">
      <h1 className="text-2xl font-bold text-[var(--ink)]">Analytics</h1>

      {/* Section 1 · Inquiry funnel */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-[var(--ink)]">Inquiry theo ngành</h2>
        <div className="space-y-2.5">
          {d.inquiriesByCategory.length === 0 ? <Empty /> : d.inquiriesByCategory.map((c) => {
            const m = catMeta(c.category);
            return (
              <div key={c.category} className="flex items-center gap-3">
                <div className="w-40 shrink-0 truncate text-xs font-medium text-gray-600">{m.emoji} {m.label}</div>
                <div className="h-5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: `${(c.count / maxCat) * 100}%`, backgroundColor: m.color, minWidth: c.count ? 8 : 0 }} />
                </div>
                <div className="w-8 shrink-0 text-right text-sm font-bold text-[var(--ink)]">{c.count}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <FunnelCell label="Inquiry" value={d.funnel.total} sub="Tổng" />
          <FunnelCell label="Đã liên hệ" value={d.funnel.contacted + d.funnel.onboarded} sub={`${d.funnel.contactedRate}% chuyển đổi`} />
          <FunnelCell label="Đã onboard" value={d.funnel.onboarded} sub={`${d.funnel.onboardedRate}% chuyển đổi`} />
        </div>

        <div className="mt-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Top 3 ngành nhiều inquiry</div>
          <div className="flex flex-wrap gap-2">
            {d.top3.map((t, i) => { const m = catMeta(t.category); return (
              <span key={t.category} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm">
                <span className="font-bold text-gray-400">#{i + 1}</span><span>{m.emoji} {m.label}</span><span className="font-bold" style={{ color: m.color }}>{t.count}</span>
              </span>
            ); })}
            {d.top3.length === 0 && <Empty />}
          </div>
        </div>
      </section>

      {/* Section 2 · Owner stats */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-[var(--ink)]">Owners theo trạng thái</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Active" value={d.owners.active} color="#4B6F44" />
          <StatPill label="Pending" value={d.owners.pending} color="#B8860B" />
          <StatPill label="Suspended" value={d.owners.suspended} color="#9CA3AF" />
          <StatPill label="Downtime (web)" value={d.owners.downtime} color="#DC2626" />
        </div>
        {/* status share bar */}
        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          <div style={{ width: `${(d.owners.active / ownerTotal) * 100}%`, background: "#4B6F44" }} />
          <div style={{ width: `${(d.owners.pending / ownerTotal) * 100}%`, background: "#B8860B" }} />
          <div style={{ width: `${(d.owners.suspended / ownerTotal) * 100}%`, background: "#9CA3AF" }} />
        </div>

        <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-gray-400">Owners theo ngành</h3>
        <div className="space-y-2.5">
          {d.owners.byCategory.length === 0 ? <Empty /> : d.owners.byCategory.map((c) => {
            const m = catMeta(c.category);
            return (
              <div key={c.category} className="flex items-center gap-3">
                <div className="w-40 shrink-0 truncate text-xs font-medium text-gray-600">{m.emoji} {m.label}</div>
                <div className="h-5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: `${(c.count / ownerCatMax) * 100}%`, backgroundColor: m.color, minWidth: c.count ? 8 : 0 }} />
                </div>
                <div className="w-8 shrink-0 text-right text-sm font-bold text-[var(--ink)]">{c.count}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3 · Revenue */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-[var(--ink)]">Hoa hồng theo tháng (3 tháng gần nhất)</h2>
        <div className="flex items-end gap-4" style={{ height: 160 }}>
          {d.revenue.months.map((m) => (
            <div key={m.label} className="flex flex-1 flex-col items-center justify-end gap-2">
              <div className="text-xs font-bold text-[var(--stem-green)]">{vnd(m.commission)}</div>
              <div className="w-full rounded-t-lg bg-[var(--stem-green)]" style={{ height: `${(m.commission / maxRev) * 120}px`, minHeight: 4 }} />
              <div className="text-xs text-gray-500">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatPill label="TT đã thu" value={d.revenue.paymentsPaid} color="#4B6F44" />
          <StatPill label="TT đang chờ" value={d.revenue.paymentsPending} color="#C05000" />
          <StatPill label="TT quá hạn" value={d.revenue.paymentsOverdue} color="#DC2626" />
        </div>
      </section>
    </div>
  );
}

function FunnelCell({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 text-center">
      <div className="text-2xl font-extrabold text-[var(--ink)]">{value}</div>
      <div className="text-xs font-semibold text-gray-600">{label}</div>
      <div className="text-[11px] text-gray-400">{sub}</div>
    </div>
  );
}
function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-gray-100 p-3 text-center">
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="mt-0.5 text-xs text-gray-500">{label}</div>
    </div>
  );
}
function Empty() { return <p className="py-4 text-center text-sm text-gray-400">Chưa có dữ liệu</p>; }
