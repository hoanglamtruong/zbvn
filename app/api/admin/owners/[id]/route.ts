import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

const STATUS = ["pending", "active", "suspended"];
const WEB_STATUS = ["up", "down"];

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const ownerId = Number(id);
  if (!ownerId) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const body = await req.json();
  const data: { status?: string; webStatus?: string } = {};

  if (body.status !== undefined) {
    if (!STATUS.includes(body.status)) {
      return NextResponse.json({ error: "status không hợp lệ" }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.webStatus !== undefined || body.web_status !== undefined) {
    const ws = body.webStatus ?? body.web_status;
    if (!WEB_STATUS.includes(ws)) {
      return NextResponse.json({ error: "web_status không hợp lệ" }, { status: 400 });
    }
    data.webStatus = ws;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Không có gì để cập nhật" }, { status: 400 });
  }

  try {
    const owner = await prisma.owner.update({ where: { id: ownerId }, data });
    return NextResponse.json({ ok: true, owner });
  } catch {
    return NextResponse.json({ error: "Owner không tồn tại" }, { status: 404 });
  }
}
