import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyBridge } from "@/lib/telegram";
import { slugify } from "@/lib/slug";
import { CATEGORY_SLUGS } from "@/lib/categories";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const category = String(body.category || "").trim();
    const telegramId = String(body.telegramId || "").trim() || null;

    if (!name || !phone || !category) {
      return NextResponse.json({ error: "Thiếu tên, số điện thoại hoặc ngành" }, { status: 400 });
    }
    if (!CATEGORY_SLUGS.includes(category)) {
      return NextResponse.json({ error: "Ngành không hợp lệ" }, { status: 400 });
    }

    // Ensure unique slug.
    const base = slugify(name) || "owner";
    let slug = base;
    for (let i = 2; await prisma.owner.findUnique({ where: { slug } }); i++) {
      slug = `${base}-${i}`;
    }

    const owner = await prisma.owner.create({
      data: { name, slug, category, phone, telegramId, status: "pending" },
    });

    await notifyBridge(
      `🆕 <b>Owner mới đăng ký</b>\nTên: ${name}\nSĐT: ${phone}\nNgành: ${category}\nTelegram: ${telegramId || "—"}`
    );

    return NextResponse.json({ ok: true, id: owner.id, slug: owner.slug }, { status: 201 });
  } catch (err) {
    console.error("[register] failed:", err);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
