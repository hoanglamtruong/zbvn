import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

const SECRET = process.env.ADMIN_JWT_SECRET || "dev-insecure-secret";

export type AdminToken = { sub: string; role: "admin" };

export function signAdminToken(username: string): string {
  return jwt.sign({ sub: username, role: "admin" } satisfies AdminToken, SECRET, {
    expiresIn: "24h",
  });
}

export function verifyAdminToken(token: string): AdminToken | null {
  try {
    return jwt.verify(token, SECRET) as AdminToken;
  } catch {
    return null;
  }
}

/** Extract + verify the bearer token from a request. Returns the payload or null. */
export function getAdminFromRequest(req: NextRequest): AdminToken | null {
  const header = req.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
  const token = bearer || req.cookies.get("zbvn_admin")?.value || null;
  return token ? verifyAdminToken(token) : null;
}
