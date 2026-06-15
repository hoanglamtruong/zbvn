"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";

type Payment = {
  id: number;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  proofImage: string | null;
  status: string;
  owner: { name: string; slug: string };
};

const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/payments");
      const data = await res.json();
      setPayments(data.payments);
    } catch {
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function verify(id: number) {
    try {
      await adminFetch("/api/admin/payments/verify", {
        method: "POST",
        body: JSON.stringify({ paymentId: id }),
      });
      load();
    } catch {
      router.replace("/admin");
    }
  }

  if (loading) return <p className="text-gray-500">Đang tải…</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-[var(--ink)]">Thanh toán ({payments.length})</h1>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Số tiền</th>
              <th className="px-4 py-3">Hạn</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3 font-medium">{p.owner?.name}</td>
                <td className="px-4 py-3">{vnd(p.amount)}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(p.dueDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : p.status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.status !== "paid" && (
                    <button
                      onClick={() => verify(p.id)}
                      className="rounded-full bg-[var(--stem-green)] px-3 py-1 text-xs font-medium text-white hover:brightness-110"
                    >
                      Duyệt TT · Bật web
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Chưa có thanh toán
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
