import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const threeMonthsStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const [byCat, byStatus, ownersByStatus, ownersDown, ownersByCat, payByStatus, orders] = await Promise.all([
    prisma.inquiry.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.inquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.owner.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.owner.count({ where: { webStatus: "down" } }),
    prisma.owner.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.payment.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: threeMonthsStart } }, select: { commission: true, createdAt: true } }),
  ]);

  const inquiriesByCategory = byCat.map((c) => ({ category: c.category, count: c._count._all })).sort((a, b) => b.count - a.count);

  const funnelMap: Record<string, number> = { new: 0, contacted: 0, onboarded: 0 };
  for (const s of byStatus) funnelMap[s.status] = s._count._all;
  const funnelTotal = funnelMap.new + funnelMap.contacted + funnelMap.onboarded;

  const ownerStatusMap: Record<string, number> = {};
  for (const s of ownersByStatus) ownerStatusMap[s.status] = s._count._all;

  // revenue by month (last 3 months)
  const months: { key: string; label: string; commission: number }[] = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: `Th${d.getMonth() + 1}/${d.getFullYear()}`, commission: 0 });
  }
  for (const o of orders) {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const m = months.find((x) => x.key === key);
    if (m) m.commission += o.commission;
  }

  const payMap: Record<string, number> = {};
  for (const p of payByStatus) payMap[p.status] = p._count._all;

  return NextResponse.json({
    inquiriesByCategory,
    top3: inquiriesByCategory.slice(0, 3),
    funnel: {
      new: funnelMap.new, contacted: funnelMap.contacted, onboarded: funnelMap.onboarded, total: funnelTotal,
      contactedRate: funnelTotal ? Math.round((funnelMap.contacted + funnelMap.onboarded) / funnelTotal * 100) : 0,
      onboardedRate: funnelTotal ? Math.round(funnelMap.onboarded / funnelTotal * 100) : 0,
    },
    owners: {
      active: ownerStatusMap.active || 0,
      pending: ownerStatusMap.pending || 0,
      suspended: ownerStatusMap.suspended || 0,
      downtime: ownersDown,
      byCategory: ownersByCat.map((c) => ({ category: c.category, count: c._count._all })).sort((a, b) => b.count - a.count),
    },
    revenue: {
      months,
      paymentsPaid: payMap.paid || 0,
      paymentsPending: payMap.pending || 0,
      paymentsOverdue: payMap.overdue || 0,
    },
  });
}
