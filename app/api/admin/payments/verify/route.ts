import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";
import { notifyPaymentVerified } from "@/lib/botNotify";

export const runtime = "nodejs";

/** Approve a payment proof → mark paid → restore the owner's web (webStatus=up). */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const paymentId = Number(body.paymentId ?? body.payment_id);
    if (!paymentId) {
      return NextResponse.json({ error: "Thiếu paymentId" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      return NextResponse.json({ error: "Payment không tồn tại" }, { status: 404 });
    }

    const [updated] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: { status: "paid", paidAt: new Date() },
      }),
      prisma.owner.update({
        where: { id: payment.ownerId },
        data: { paymentStatus: "ok", webStatus: "up" },
      }),
    ]);

    await notifyPaymentVerified({ ownerId: payment.ownerId, amount: payment.amount });

    return NextResponse.json({ ok: true, payment: updated });
  } catch (err) {
    console.error("[payments/verify] failed:", err);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
