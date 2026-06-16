import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Internal: set an owner's web_status (called by zbvn-bot). Auth via x-internal-secret. */
export async function POST(req: NextRequest) {
  const secret = process.env.INTERNAL_SECRET;
  if (!secret || req.headers.get("x-internal-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const ownerId = Number(body.ownerId);
    const webStatus = String(body.webStatus || "");
    if (!ownerId || !["up", "down"].includes(webStatus)) {
      return NextResponse.json({ error: "ownerId/webStatus không hợp lệ" }, { status: 400 });
    }
    const owner = await prisma.owner.update({ where: { id: ownerId }, data: { webStatus } });
    return NextResponse.json({ ok: true, id: owner.id, webStatus: owner.webStatus });
  } catch {
    return NextResponse.json({ error: "Owner không tồn tại hoặc lỗi" }, { status: 404 });
  }
}
