import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    ownersTotal, ownersActive, ownersPending,
    ordersTotal, ordersThisMonth,
    paymentsTotal, paymentsPending,
    inquiriesTotal, inquiries7d,
    recentOrders, recentInquiries, recentPayments,
  ] = await Promise.all([
    prisma.owner.count(),
    prisma.owner.count({ where: { status: "active" } }),
    prisma.owner.count({ where: { status: "pending" } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.payment.count(),
    prisma.payment.count({ where: { status: "pending" } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { owner: { select: { name: true } } } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.payment.findMany({ where: { status: "pending" }, orderBy: { createdAt: "desc" }, take: 5, include: { owner: { select: { name: true } } } }),
  ]);

  return NextResponse.json({
    stats: {
      owners: { total: ownersTotal, active: ownersActive, pending: ownersPending },
      orders: { total: ordersTotal, thisMonth: ordersThisMonth },
      payments: { total: paymentsTotal, pending: paymentsPending },
      inquiries: { total: inquiriesTotal, last7d: inquiries7d },
    },
    recent: { orders: recentOrders, inquiries: recentInquiries, payments: recentPayments },
  });
}
