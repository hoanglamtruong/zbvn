import { type NextRequest, NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = String(body.user ?? body.username ?? "");
    const pass = String(body.pass ?? body.password ?? "");

    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    if (!ADMIN_USER || !ADMIN_PASS) {
      return NextResponse.json({ error: "Server chưa cấu hình admin" }, { status: 500 });
    }
    if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
      return NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });
    }

    const token = signAdminToken(user);
    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("[auth] failed:", err);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
