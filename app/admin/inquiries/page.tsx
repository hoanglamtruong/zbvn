"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";
import { ADMIN_CATS, catMeta } from "@/lib/adminCats";

type Inquiry = { id: number; name: string; phone: string; category: string; note: string | null; status: string; createdAt: string };

const STATUS_LABEL: Record<string, string> = { new: "Mới", contacted: "Đã liên hệ", onboarded: "Đã onboard" };
const STATUS_STYLE: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  onboarded: "bg-green-100 text-green-700",
};
const dt = (s: string) => new Date(s).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function InquiriesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/inquiries?category=${category}&status=${status}`);
      const data = await res.json();
      setItems(data.inquiries);
    } catch {
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }, [router, category, status]);
  useEffect(() => { load(); }, [load]);

  async function setStatusFor(id: number, next: string) {
    try {
      await adminFetch(`/api/admin/inquiries/${id}`, { method: "PUT", body: JSON.stringify({ status: next }) });
      load();
    } catch {
      router.replace("/admin");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-[var(--ink)]">Inquiries ({items.length})</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--stem-green)]">
          <option value="all">Tất cả ngành</option>
          {ADMIN_CATS.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--stem-green)]">
          <option value="all">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="contacted">Đã liên hệ</option>
          <option value="onboarded">Đã onboard</option>
        </select>
      </div>

      {loading ? <p className="text-gray-500">Đang tải…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Tên cơ sở</th>
                <th className="px-4 py-3">SĐT</th>
                <th className="px-4 py-3">Ngành</th>
                <th className="px-4 py-3">Ghi chú</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((q, i) => {
                const c = catMeta(q.category);
                return (
                  <tr key={q.id} className="border-t border-gray-100 align-top">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{q.name}</td>
                    <td className="px-4 py-3">{q.phone}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white" style={{ backgroundColor: c.color }}>{c.emoji} {c.label}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[260px] text-xs text-gray-500">{q.note || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">{dt(q.createdAt)}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[q.status] || "bg-gray-100 text-gray-600"}`}>{STATUS_LABEL[q.status] || q.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {q.status === "new" && <Btn onClick={() => setStatusFor(q.id, "contacted")} color="orange">Đánh dấu đã liên hệ</Btn>}
                        {q.status === "contacted" && <Btn onClick={() => setStatusFor(q.id, "onboarded")} color="green">Đánh dấu onboard</Btn>}
                        {q.status === "onboarded" && <span className="text-xs text-gray-400">✓ Hoàn tất</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Không có inquiry nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Btn({ children, onClick, color }: { children: React.ReactNode; onClick: () => void; color: "green" | "orange" }) {
  const c = color === "green" ? "bg-[var(--stem-green)]" : "bg-[var(--orange-dark)]";
  return <button onClick={onClick} className={`rounded-full px-3 py-1 text-xs font-medium text-white hover:brightness-110 ${c}`}>{children}</button>;
}
