import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const category = String(body.category || "").trim();
    const note = String(body.note || "").trim() || null;

    if (!name || !phone || !category) {
      return NextResponse.json({ error: "Thiếu tên cơ sở, số điện thoại hoặc ngành" }, { status: 400 });
    }

    await prisma.inquiry.create({ data: { name, phone, category, note } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inquiry] failed:", err);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
