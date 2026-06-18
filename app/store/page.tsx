"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

const SANS = "var(--font-inter), sans-serif";
const SHIP = 35000;

const CATS = [
  { label: "Tất cả", icon: "🛍️" },
  { label: "Hải sản khô", icon: "🦐" },
  { label: "Đồ uống", icon: "🍶" },
  { label: "Bánh kẹo", icon: "🍪" },
  { label: "Gia vị", icon: "🧂" },
  { label: "Quà tặng", icon: "🎁" },
];

type Product = { id: string; name: string; cat: string; origin: string; price: number; featured?: boolean; badge?: "specialty" | "new" | "best"; emoji: string; g: [string, string] };
const PRODUCTS: Product[] = [
  { id: "muckho", name: "Mực một nắng", cat: "Hải sản khô", origin: "Long Hải", price: 420000, featured: true, badge: "specialty", emoji: "🦑", g: ["#FCEFE6", "#F5D8C4"] },
  { id: "tomkho", name: "Tôm khô loại 1", cat: "Hải sản khô", origin: "Phước Tỉnh", price: 580000, badge: "best", emoji: "🦐", g: ["#FDEBE9", "#F6CEC9"] },
  { id: "cakho", name: "Cá đù một nắng", cat: "Hải sản khô", origin: "Vũng Tàu", price: 280000, emoji: "🐟", g: ["#EAF1F6", "#C9DCEA"] },
  { id: "ruou", name: "Rượu sim rừng", cat: "Đồ uống", origin: "Bà Rịa", price: 180000, badge: "specialty", emoji: "🍷", g: ["#F3EAF4", "#DCC4E0"] },
  { id: "nuocmam", name: "Nước mắm nhỉ", cat: "Gia vị", origin: "Phước Hải", price: 120000, badge: "best", emoji: "🍶", g: ["#FBF3DC", "#EFD9A0"] },
  { id: "muoiot", name: "Muối ớt xanh", cat: "Gia vị", origin: "BR-VT", price: 45000, badge: "new", emoji: "🧂", g: ["#EAF3E9", "#C8E0C4"] },
  { id: "banhbong", name: "Bánh bông lan trứng muối", cat: "Bánh kẹo", origin: "Vũng Tàu", price: 95000, badge: "new", emoji: "🧁", g: ["#FCEFD9", "#F2D9A6"] },
  { id: "keodua", name: "Kẹo dừa nướng", cat: "Bánh kẹo", origin: "Bến Tre", price: 60000, emoji: "🍬", g: ["#FBEEE6", "#F0D4BE"] },
  { id: "hatdieu", name: "Hạt điều rang muối", cat: "Bánh kẹo", origin: "Bình Phước", price: 165000, badge: "best", emoji: "🥜", g: ["#F5EFE3", "#E2D2B4"] },
  { id: "tradao", name: "Trà đậu biếc", cat: "Đồ uống", origin: "Đà Lạt", price: 85000, emoji: "🫖", g: ["#EAEEF6", "#C6D2EC"] },
  { id: "gioqua", name: "Giỏ quà đặc sản", cat: "Quà tặng", origin: "BR-VT", price: 650000, badge: "specialty", emoji: "🎁", g: ["#FBEAEA", "#F2CECE"] },
  { id: "comchay", name: "Cơm cháy chà bông", cat: "Bánh kẹo", origin: "Ninh Bình", price: 55000, emoji: "🍘", g: ["#FAF1DD", "#EDD9A8"] },
];
const TRUST = [{ icon: "✅", label: "Chính hãng 100%" }, { icon: "🔄", label: "Đổi trả 7 ngày" }, { icon: "🚚", label: "Giao toàn quốc" }];

const prod = (id: string) => PRODUCTS.find((p) => p.id === id)!;
const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";
function badgeChip(b?: string): { text: string; style: CSSProperties } | null {
  if (b === "specialty") return { text: "Đặc sản", style: { position: "absolute", top: 9, left: 9, background: "#4B6F44", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "4px 9px", borderRadius: 6 } };
  if (b === "new") return { text: "Hàng mới", style: { position: "absolute", top: 9, left: 9, background: "#111827", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "4px 9px", borderRadius: 6 } };
  if (b === "best") return { text: "Bán chạy", style: { position: "absolute", top: 9, left: 9, background: "#C05000", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "4px 9px", borderRadius: 6 } };
  return null;
}
function imgBox(p: Product, size: number): CSSProperties {
  return { width: size, height: size, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.46, background: `linear-gradient(145deg, ${p.g[0]}, ${p.g[1]})` };
}

export default function StorePage() {
  const [screen, setScreen] = useState<"store" | "checkout" | "success">("store");
  const [cat, setCat] = useState("Tất cả");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const add = (id: string) => setCart((s) => ({ ...s, [id]: (s[id] || 0) + 1 }));
  const dec = (id: string) => setCart((s) => { const c = { ...s }; const v = (c[id] || 0) - 1; if (v <= 0) delete c[id]; else c[id] = v; return c; });
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((s, [id, q]) => s + prod(id).price * q, 0);
  const isDelivery = method === "delivery";
  const ship = isDelivery ? SHIP : 0;
  const list = PRODUCTS.filter((p) => cat === "Tất cả" || p.cat === cat);
  const bp = PRODUCTS.find((p) => p.featured)!;
  const cartItems = Object.entries(cart).map(([id, q]) => ({ ...prod(id), qty: q }));
  const canConfirm = !!(cartCount > 0 && form.name.trim() && form.phone.trim() && (!isDelivery || form.address.trim()));
  const methodLabel = isDelivery ? "Giao tận nơi" : "Lấy tại cửa hàng";

  async function confirm() {
    if (!canConfirm || submitting) return;
    setSubmitting(true); setError("");
    const note = ["[Đơn Showroom Đặc Sản BR-VT]", cartItems.map((it) => `${it.name} x${it.qty}`).join(", "), `Tổng: ${fmt(subtotal + ship)}`, methodLabel, isDelivery && form.address ? `Địa chỉ: ${form.address}` : "", form.note ? `Ghi chú: ${form.note}` : ""].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note, category: "store" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");
      setOrderCode("SR" + Math.floor(100000 + Math.random() * 900000));
      setScreen("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Lỗi"); } finally { setSubmitting(false); }
  }
  function home() { setScreen("store"); setCat("Tất cả"); setCart({}); setForm({ name: "", phone: "", address: "", note: "" }); }

  const meStyle = (sel: boolean): CSSProperties => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderRadius: 12, padding: "14px 8px", cursor: "pointer", border: sel ? "2px solid #111827" : "1px solid #E5E7EB", background: "#fff", color: sel ? "#111827" : "#9CA3AF", fontFamily: SANS });
  const inputStyle: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid #E5E7EB", background: "#fff", borderRadius: 10, padding: "12px 13px", fontSize: 14, color: "#111827", fontFamily: SANS };

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#F9FAFB", fontFamily: SANS, color: "#111827", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* STORE */}
          {screen === "store" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ background: "#fff", padding: "52px 20px 14px", borderBottom: "1px solid #EBEDF0" }}>
                <div style={{ display: "flex", gap: 12, minWidth: 0 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 11, background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🏬</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Showroom Đặc Sản BR-VT</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>📍 142 Lê Lợi · TP. Vũng Tàu</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 11 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(75,111,68,0.1)", borderRadius: 7, padding: "4px 9px", fontSize: 11, fontWeight: 700, color: "#3A5635" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4B6F44", animation: "dcPulse 2s ease-in-out infinite" }} />Đang mở</span>
                  <span style={{ fontSize: 11.5, color: "#9CA3AF", fontWeight: 500 }}>🕐 7:30 – 21:00 hằng ngày</span>
                </div>
              </div>

              <div style={{ background: "#fff", padding: "0 20px 14px", borderBottom: "1px solid #EBEDF0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#F3F4F6", border: "1px solid #EBEDF0", borderRadius: 10, padding: "11px 13px" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" /></svg>
                  <span style={{ fontSize: 13.5, color: "#9CA3AF", fontWeight: 500 }}>Tìm đặc sản, thương hiệu…</span>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96 }} className="dc-noscroll">
                <div style={{ padding: "16px 20px 0" }}>
                  <div onClick={() => add(bp.id)} style={{ cursor: "pointer", borderRadius: 16, overflow: "hidden", position: "relative", background: "linear-gradient(120deg,#1F2937,#111827)" }}>
                    <div style={{ position: "relative", padding: "20px 18px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "inline-block", background: "#4B6F44", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Đặc sản</span>
                        <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginTop: 11, letterSpacing: "-0.01em" }}>{bp.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 5, fontWeight: 500 }}>📍 {bp.origin} · hàng tuyển chọn</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{fmt(bp.price)}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", color: "#111827", fontSize: 12.5, fontWeight: 700, padding: "8px 14px", borderRadius: 8 }}>Thêm vào giỏ</span>
                        </div>
                      </div>
                      <div style={{ width: 96, height: 96, borderRadius: 12, background: "linear-gradient(145deg,#3A4150,#222834)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, flexShrink: 0 }}>{bp.emoji}</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "18px 0 0" }}>
                  <div style={{ display: "flex", gap: 9, overflowX: "auto", padding: "0 20px 4px" }} className="dc-noscroll">
                    {CATS.map((c) => { const active = cat === c.label; return <button key={c.label} onClick={() => setCat(c.label)} style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, border: active ? "none" : "1px solid #E5E7EB", background: active ? "#111827" : "#fff", color: active ? "#fff" : "#6B7280", borderRadius: 9, padding: "9px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: SANS }}><span style={{ fontSize: 15 }}>{c.icon}</span>{c.label}</button>; })}
                  </div>
                </div>

                <div style={{ padding: "16px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
                  {list.map((p) => {
                    const qty = cart[p.id] || 0; const bc = badgeChip(p.badge);
                    return (
                      <div key={p.id} style={{ background: "#fff", border: "1px solid #EBEDF0", borderRadius: 13, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        <div style={{ position: "relative", height: 104, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(145deg, ${p.g[0]}, ${p.g[1]})` }}>
                          <span style={{ fontSize: 46, filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.08))" }}>{p.emoji}</span>
                          {bc && <div style={bc.style}>{bc.text}</div>}
                        </div>
                        <div style={{ padding: "11px 12px 12px", display: "flex", flexDirection: "column", flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.01em" }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4, fontWeight: 500 }}>📍 {p.origin}</div>
                          <div style={{ marginTop: "auto", paddingTop: 11, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 15.5, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em" }}>{fmt(p.price)}</span>
                            {qty > 0 ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 1, border: "1px solid #111827", borderRadius: 8 }}>
                                <button onClick={() => dec(p.id)} style={{ width: 26, height: 28, border: "none", background: "transparent", fontSize: 16, cursor: "pointer", color: "#111827" }}>−</button>
                                <span style={{ minWidth: 16, textAlign: "center", fontSize: 13, fontWeight: 700 }}>{qty}</span>
                                <button onClick={() => add(p.id)} style={{ width: 26, height: 28, border: "none", background: "transparent", fontSize: 16, cursor: "pointer", color: "#111827" }}>+</button>
                              </div>
                            ) : (
                              <button onClick={() => add(p.id)} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "#111827", color: "#fff", fontSize: 19, lineHeight: 1, cursor: "pointer", flexShrink: 0 }}>+</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: "22px 20px 0" }}>
                  <div style={{ display: "flex", gap: 9 }}>
                    {TRUST.map((t, i) => (
                      <div key={i} style={{ flex: 1, background: "#fff", border: "1px solid #EBEDF0", borderRadius: 12, padding: "13px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 20 }}>{t.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, marginTop: 7, lineHeight: 1.3, color: "#374151" }}>{t.label}</div>
                      </div>
                    ))}
                  </div>
                  <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 20, fontSize: 12.5, color: "#9CA3AF", fontWeight: 600 }}>← Về trang chủ zeebee.vn</Link>
                </div>
              </div>

              {cartCount > 0 && (
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#F9FAFB 72%,rgba(249,250,251,0))", zIndex: 40 }}>
                  <button onClick={() => setScreen("checkout")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#111827", border: "none", borderRadius: 13, padding: "11px 16px 11px 13px", cursor: "pointer", boxShadow: "0 8px 24px rgba(17,24,39,0.22)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
                      <span style={{ position: "relative", display: "inline-flex", width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛍️<span style={{ position: "absolute", top: -5, right: -5, minWidth: 19, height: 19, padding: "0 4px", borderRadius: 10, background: "#4B6F44", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #111827" }}>{cartCount}</span></span>
                      <span style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.2 }}><span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{cartCount} sản phẩm</span><span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{fmt(subtotal)}</span></span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 700, color: "#fff" }}>Đặt hàng<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CHECKOUT */}
          {screen === "checkout" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#fff", padding: "52px 20px 13px", display: "flex", alignItems: "center", gap: 13, borderBottom: "1px solid #EBEDF0" }}>
                <button onClick={() => setScreen("store")} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em" }}>Đặt hàng</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 110px" }} className="dc-noscroll">
                <div style={ulabel}>Sản phẩm đã chọn</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cartItems.map((it) => (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #EBEDF0", borderRadius: 12, padding: 11 }}>
                      <div style={imgBox(it, 50)}>{it.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.25 }}>{it.name}</div>
                        <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 3, fontWeight: 500 }}>{fmt(it.price)}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800 }}>{fmt(it.price * it.qty)}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 1, background: "#F3F4F6", borderRadius: 7 }}>
                          <button onClick={() => dec(it.id)} style={{ width: 26, height: 26, border: "none", background: "transparent", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#374151" }}>−</button>
                          <span style={{ minWidth: 17, textAlign: "center", fontSize: 12.5, fontWeight: 700 }}>{it.qty}</span>
                          <button onClick={() => add(it.id)} style={{ width: 26, height: 26, border: "none", background: "transparent", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#374151" }}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ ...ulabel, margin: "22px 0 10px" }}>Hình thức nhận hàng</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setMethod("delivery")} style={meStyle(isDelivery)}><span style={{ fontSize: 20 }}>🚚</span><span style={{ fontSize: 13, fontWeight: 700 }}>Giao tận nơi</span><span style={{ fontSize: 10.5, opacity: 0.7 }}>Toàn quốc</span></button>
                  <button onClick={() => setMethod("pickup")} style={meStyle(!isDelivery)}><span style={{ fontSize: 20 }}>🏬</span><span style={{ fontSize: 13, fontWeight: 700 }}>Lấy tại cửa hàng</span><span style={{ fontSize: 10.5, opacity: 0.7 }}>142 Lê Lợi</span></button>
                </div>

                <div style={{ ...ulabel, margin: "22px 0 11px" }}>Thông tin nhận hàng</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <div><label style={fl}>Họ và tên</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="VD: Trần Thị Mai" style={inputStyle} /></div>
                  <div><label style={fl}>Số điện thoại</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} inputMode="numeric" placeholder="VD: 0912 345 678" style={inputStyle} /></div>
                  {isDelivery && <div><label style={fl}>Địa chỉ giao hàng</label><input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Số nhà, đường, phường, tỉnh…" style={inputStyle} /></div>}
                  <div><label style={fl}>Ghi chú <span style={{ color: "#9CA3AF" }}>(không bắt buộc)</span></label><textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} placeholder="VD: gói quà tặng · giao giờ hành chính…" style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} /></div>
                </div>

                <div style={{ marginTop: 20, background: "#fff", border: "1px solid #EBEDF0", borderRadius: 13, padding: "15px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280", fontWeight: 500, marginBottom: 8 }}><span>Tạm tính</span><span style={{ color: "#111827", fontWeight: 700 }}>{fmt(subtotal)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280", fontWeight: 500, paddingBottom: 11, borderBottom: "1px solid #F0F1F3" }}><span>Phí giao hàng</span><span style={{ color: "#111827", fontWeight: 700 }}>{ship > 0 ? fmt(ship) : "Miễn phí"}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 11 }}><span style={{ fontSize: 14, fontWeight: 700 }}>Tổng cộng</span><span style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-0.01em" }}>{fmt(subtotal + ship)}</span></div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#F9FAFB 74%,rgba(249,250,251,0))", zIndex: 40 }}>
                {error && <div style={{ textAlign: "center", color: "#B91C1C", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{error}</div>}
                <button onClick={confirm} disabled={!canConfirm || submitting} style={{ width: "100%", height: 54, border: "none", borderRadius: 13, fontSize: 16, fontWeight: 700, cursor: canConfirm && !submitting ? "pointer" : "not-allowed", color: "#fff", background: canConfirm ? "#111827" : "#C7CBD1", boxShadow: canConfirm ? "0 8px 24px rgba(17,24,39,0.22)" : "none", fontFamily: SANS }}>{submitting ? "Đang gửi…" : canConfirm ? "Xác nhận đặt hàng" : "Vui lòng điền thông tin"}</button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {screen === "success" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 28px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#4B6F44", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 32px rgba(75,111,68,0.3)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 25, fontWeight: 800, marginTop: 24, lineHeight: 1.15, letterSpacing: "-0.02em", animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Đơn hàng đã ghi nhận</div>
              <div style={{ fontSize: 14, color: "#6B7280", marginTop: 9, lineHeight: 1.6, maxWidth: 290, fontWeight: 500, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Cửa hàng sẽ xác nhận đơn của bạn trong thời gian sớm nhất. Cảm ơn bạn đã mua sắm! 🏬</div>
              <div style={{ marginTop: 26, width: "100%", background: "#fff", border: "1px solid #EBEDF0", borderRadius: 13, padding: 18, textAlign: "left", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#9CA3AF", marginBottom: 11, fontWeight: 500 }}><span>Mã đơn</span><span style={{ fontWeight: 700, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{orderCode}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#9CA3AF", marginBottom: 11, fontWeight: 500 }}><span>Số sản phẩm</span><span style={{ fontWeight: 700, color: "#111827" }}>{cartCount} sản phẩm</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#9CA3AF", marginBottom: 11, fontWeight: 500 }}><span>Hình thức</span><span style={{ fontWeight: 700, color: "#111827" }}>{methodLabel}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "1px solid #F0F1F3" }}><span style={{ fontSize: 13, fontWeight: 700 }}>Tổng cộng</span><span style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.01em" }}>{fmt(subtotal + ship)}</span></div>
              </div>
              <button onClick={home} style={{ marginTop: 24, width: "100%", height: 52, background: "#111827", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 22px rgba(17,24,39,0.22)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both", fontFamily: SANS }}>Tiếp tục mua sắm</button>
              <Link href="/" style={{ marginTop: 16, fontSize: 12.5, color: "#9CA3AF", fontFamily: SANS }}>← Về trang chủ zeebee.vn</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#F9FAFB", boxShadow: "0 20px 60px rgba(17,24,39,0.18)" };
const ulabel: CSSProperties = { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "#9CA3AF", marginBottom: 11 };
const fl: CSSProperties = { fontSize: 12, color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 5 };

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
@keyframes dcPulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
