import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const VALID = ["new", "confirmed", "done", "cancelled"];

/** Receives order status updates from zbvn-bot. */
export async function POST(req: NextRequest) {
  // Optional shared-secret check (skipped if TELEGRAM_BOT_TOKEN is not configured).
  const secret = process.env.TELEGRAM_BOT_TOKEN;
  if (secret) {
    const provided = req.headers.get("x-webhook-token");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const orderId = Number(body.orderId ?? body.order_id);
    const status = String(body.status || "");
    if (!orderId || !VALID.includes(status)) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    try {
      const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
      return NextResponse.json({ ok: true, order });
    } catch {
      return NextResponse.json({ error: "Order không tồn tại" }, { status: 404 });
    }
  } catch (err) {
    console.error("[webhook/order-notify] failed:", err);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
