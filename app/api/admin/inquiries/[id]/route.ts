import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

const STATUSES = ["new", "contacted", "onboarded"];

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const inquiryId = Number(id);
  if (!inquiryId) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const body = await req.json();
  const status = String(body.status || "");
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "status không hợp lệ" }, { status: 400 });
  }

  try {
    const inquiry = await prisma.inquiry.update({ where: { id: inquiryId }, data: { status } });
    return NextResponse.json({ ok: true, inquiry });
  } catch {
    return NextResponse.json({ error: "Inquiry không tồn tại" }, { status: 404 });
  }
}
