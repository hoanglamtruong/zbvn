"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";
import { catMeta } from "@/lib/adminCats";

type Owner = { id: number; name: string; category: string; status: string; webStatus: string; paymentStatus: string };
type Payment = { id: number; ownerId: number; dueDate: string; paidAt: string | null; status: string };

const DAY = 86400000;
const dmy = (s: string) => new Date(s).toLocaleDateString("vi-VN");

export default function DowntimePage() {
  const router = useRouter();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "down" | "soon">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [oRes, pRes] = await Promise.all([adminFetch("/api/admin/owners"), adminFetch("/api/admin/payments")]);
      setOwners((await oRes.json()).owners);
      setPayments((await pRes.json()).payments);
    } catch {
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }, [router]);
  useEffect(() => { load(); }, [load]);

  async function setWeb(id: number, webStatus: "up" | "down") {
    try {
      await adminFetch(`/api/admin/owners/${id}`, { method: "PUT", body: JSON.stringify({ webStatus }) });
      load();
    } catch {
      router.replace("/admin");
    }
  }

  // earliest unpaid payment per owner → due date + overdue days
  function dueInfo(ownerId: number) {
    const unpaid = payments.filter((p) => p.ownerId === ownerId && !p.paidAt && p.status !== "paid");
    if (unpaid.length === 0) return null;
    const earliest = unpaid.reduce((a, b) => (new Date(a.dueDate) < new Date(b.dueDate) ? a : b));
    const due = new Date(earliest.dueDate);
    const overdue = Math.floor((Date.now() - due.getTime()) / DAY);
    return { due, overdue };
  }

  const rows = owners.map((o) => ({ owner: o, due: dueInfo(o.id) }));
  const filtered = rows.filter(({ owner, due }) =>
    filter === "all" ? true : filter === "down" ? owner.webStatus === "down" : (due ? due.overdue > 5 : false)
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-[var(--ink)]">Downtime control</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {([["all", "Tất cả"], ["down", "Đang downtime"], ["soon", "Sắp downtime (>5 ngày)"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === k ? "bg-[var(--stem-green)] text-white" : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"}`}>{label}</button>
        ))}
      </div>

      {loading ? <p className="text-gray-500">Đang tải…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Ngành</th>
                <th className="px-4 py-3">Web</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Hạn / Overdue</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ owner: o, due }) => {
                const c = catMeta(o.category);
                return (
                  <tr key={o.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{o.name}</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-xs">{c.emoji} {c.label}</span></td>
                    <td className="px-4 py-3"><WebBadge value={o.webStatus} /></td>
                    <td className="px-4 py-3"><PayBadge value={o.paymentStatus} /></td>
                    <td className="px-4 py-3 text-xs">
                      {due ? (
                        <span className={due.overdue > 0 ? "font-semibold text-red-600" : "text-gray-500"}>
                          {dmy(due.due.toISOString())}{due.overdue > 0 ? ` · quá ${due.overdue} ngày` : ` · còn ${-due.overdue} ngày`}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {o.webStatus !== "up" && <button onClick={() => setWeb(o.id, "up")} className="rounded-full bg-[var(--stem-green)] px-3 py-1 text-xs font-medium text-white hover:brightness-110">Bật web</button>}
                        {o.webStatus !== "down" && <button onClick={() => setWeb(o.id, "down")} className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:brightness-110">Tắt web</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Không có Owner nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WebBadge({ value }: { value: string }) {
  const up = value === "up";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{up ? "Đang chạy" : "Đã tắt"}</span>;
}
function PayBadge({ value }: { value: string }) {
  const map: Record<string, string> = { ok: "bg-green-100 text-green-700", overdue: "bg-red-100 text-red-700", pending: "bg-yellow-100 text-yellow-700" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[value] || "bg-gray-100 text-gray-600"}`}>{value}</span>;
}
