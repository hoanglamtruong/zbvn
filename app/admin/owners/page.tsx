"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";

type Owner = {
  id: number;
  name: string;
  slug: string;
  category: string;
  phone: string | null;
  status: string;
  webStatus: string;
  commissionRate: number;
  paymentStatus: string;
  _count: { orders: number };
};

export default function OwnersPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/owners");
      const data = await res.json();
      setOwners(data.owners);
    } catch {
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function update(id: number, patch: { status?: string; webStatus?: string }) {
    try {
      await adminFetch(`/api/admin/owners/${id}`, { method: "PUT", body: JSON.stringify(patch) });
      load();
    } catch {
      router.replace("/admin");
    }
  }

  if (loading) return <p className="text-gray-500">Đang tải…</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-[var(--ink)]">Owners ({owners.length})</h1>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Ngành</th>
              <th className="px-4 py-3">SĐT</th>
              <th className="px-4 py-3">Đơn</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Web</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((o) => (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium">{o.name}</td>
                <td className="px-4 py-3">{o.category}</td>
                <td className="px-4 py-3">{o.phone || "—"}</td>
                <td className="px-4 py-3">{o._count.orders}</td>
                <td className="px-4 py-3">
                  <Badge value={o.status} />
                </td>
                <td className="px-4 py-3">
                  <Badge value={o.webStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {o.status !== "active" && (
                      <Btn onClick={() => update(o.id, { status: "active" })} color="green">
                        Duyệt
                      </Btn>
                    )}
                    {o.status !== "suspended" && (
                      <Btn onClick={() => update(o.id, { status: "suspended" })} color="red">
                        Khoá
                      </Btn>
                    )}
                    {o.webStatus === "up" ? (
                      <Btn onClick={() => update(o.id, { webStatus: "down" })} color="orange">
                        Tắt web
                      </Btn>
                    ) : (
                      <Btn onClick={() => update(o.id, { webStatus: "up" })} color="green">
                        Bật web
                      </Btn>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {owners.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Chưa có Owner nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    up: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    suspended: "bg-red-100 text-red-700",
    down: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[value] || "bg-gray-100 text-gray-600"}`}>
      {value}
    </span>
  );
}

function Btn({
  children,
  onClick,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: "green" | "red" | "orange";
}) {
  const colors = {
    green: "bg-[var(--stem-green)] hover:brightness-110",
    red: "bg-red-500 hover:brightness-110",
    orange: "bg-[var(--orange-dark)] hover:brightness-110",
  };
  return (
    <button onClick={onClick} className={`rounded-full px-3 py-1 text-xs font-medium text-white ${colors[color]}`}>
      {children}
    </button>
  );
}
