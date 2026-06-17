"use client";

import Link from "next/link";

export default function ServicesPage() {
  return <ComingSoon emoji="🔧" name="Dịch vụ tại nhà" />;
}

function ComingSoon({ emoji, name }: { emoji: string; name: string }) {
  return (
    <main style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 24px", background: "#FAFAFA", fontFamily: "var(--font-montserrat), sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#4B6F44", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>Z</div>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>ZB<span style={{ color: "#C05000" }}>VN</span></span>
      </div>
      <div style={{ fontSize: 56 }}>{emoji}</div>
      <h1 style={{ marginTop: 16, fontSize: 28, fontWeight: 800, color: "#4B6F44" }}>{name}</h1>
      <p style={{ marginTop: 10, fontSize: 16, fontWeight: 600, color: "#4B6F44" }}>Đang xây dựng · Sắp ra mắt</p>
      <p style={{ marginTop: 8, maxWidth: 380, color: "#6B7280", lineHeight: 1.6 }}>
        ZBVN đang hoàn thiện trang cho ngành này. Quay lại sớm bạn nhé!
      </p>
      <Link href="/" style={{ marginTop: 28, display: "inline-block", borderRadius: 999, border: "1px solid #4B6F44", color: "#4B6F44", padding: "11px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
        ← Về trang chủ zeebee.vn
      </Link>
    </main>
  );
}
