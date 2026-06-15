"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";

type Order = {
  id: number;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  commission: number;
  status: string;
  createdAt: string;
  owner: { name: string; slug: string };
};

const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders);
    } catch {
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-gray-500">Đang tải…</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-[var(--ink)]">Đơn hàng ({orders.length})</h1>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Khách</th>
              <th className="px-4 py-3">Giá trị</th>
              <th className="px-4 py-3">Hoa hồng</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{o.id}</td>
                <td className="px-4 py-3 font-medium">{o.owner?.name}</td>
                <td className="px-4 py-3">
                  {o.buyerName}
                  <span className="block text-xs text-gray-400">{o.buyerPhone}</span>
                </td>
                <td className="px-4 py-3">{vnd(o.amount)}</td>
                <td className="px-4 py-3 text-[var(--stem-green)]">{vnd(o.commission)}</td>
                <td className="px-4 py-3">{o.status}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Chưa có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
