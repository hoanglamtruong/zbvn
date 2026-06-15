import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyBridge } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ownerId = Number(body.ownerId ?? body.owner_id);
    const buyerName = String(body.buyerName ?? body.buyer_name ?? "").trim();
    const buyerPhone = String(body.buyerPhone ?? body.buyer_phone ?? "").trim();
    const amount = Math.round(Number(body.amount));

    if (!ownerId || !buyerName || !buyerPhone || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Dữ liệu đơn hàng không hợp lệ" }, { status: 400 });
    }

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return NextResponse.json({ error: "Owner không tồn tại" }, { status: 404 });
    }

    const commission = Math.round((amount * owner.commissionRate) / 100);

    const order = await prisma.order.create({
      data: { ownerId, buyerName, buyerPhone, amount, commission, status: "new" },
    });

    await notifyBridge(
      `🛒 <b>Đơn hàng mới</b>\nOwner: ${owner.name}\nKhách: ${buyerName} (${buyerPhone})\nGiá trị: ${amount.toLocaleString("vi-VN")}đ\nHoa hồng: ${commission.toLocaleString("vi-VN")}đ`
    );

    return NextResponse.json(
      { ok: true, id: order.id, commission },
      { status: 201 }
    );
  } catch (err) {
    console.error("[orders] failed:", err);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
