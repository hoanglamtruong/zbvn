"use client";

import { useMemo, useState, type CSSProperties } from "react";

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  orig?: number;
  cat: string;
  emoji: string;
  g: [string, string];
  tag?: "new" | "sale";
  soldOut?: boolean;
};

const CATS = ["Tất cả", "Thực phẩm", "Gia dụng", "Đồ uống"];

const CATALOG: Product[] = [
  { id: "gao", name: "Gạo thơm ST25", unit: "Túi 5kg", price: 145000, cat: "Thực phẩm", emoji: "🍚", g: ["#E9F0E3", "#CFE0C4"] },
  { id: "trung", name: "Trứng gà ta", unit: "Vỉ 10 quả", price: 35000, cat: "Thực phẩm", emoji: "🥚", g: ["#FBF0DA", "#F3DCAE"], tag: "new" },
  { id: "mi", name: "Mì Hảo Hảo", unit: "Thùng 30 gói", price: 95000, orig: 119000, cat: "Thực phẩm", emoji: "🍜", g: ["#FBE3D6", "#F4C3A6"], tag: "sale" },
  { id: "mam", name: "Nước mắm nhỉ", unit: "Chai 500ml", price: 42000, cat: "Thực phẩm", emoji: "🐟", g: ["#E3EFF3", "#C2DCE6"] },
  { id: "chen", name: "Nước rửa chén", unit: "Chai 750ml", price: 28000, cat: "Gia dụng", emoji: "🧼", g: ["#E2F1EE", "#BFE0D6"], tag: "new" },
  { id: "giat", name: "Bột giặt Omo", unit: "Túi 3kg", price: 110000, cat: "Gia dụng", emoji: "🧺", g: ["#E5EAF5", "#C4D2EE"] },
  { id: "khan", name: "Khăn giấy", unit: "Lốc 10 cuộn", price: 55000, cat: "Gia dụng", emoji: "🧻", g: ["#F1EBE2", "#DDD0BF"], soldOut: true },
  { id: "ban", name: "Bàn chải răng", unit: "Vỉ 4 cây", price: 25000, cat: "Gia dụng", emoji: "🪥", g: ["#EDE6F3", "#D4C2E6"] },
  { id: "coca", name: "Coca-Cola", unit: "Lốc 6 lon", price: 60000, cat: "Đồ uống", emoji: "🥤", g: ["#F6DEDB", "#EBB6B0"] },
  { id: "tra", name: "Trà xanh 0 độ", unit: "Chai 455ml", price: 12000, cat: "Đồ uống", emoji: "🍵", g: ["#E5F1DE", "#C6E2B6"], tag: "new" },
  { id: "caphe", name: "Cà phê sữa", unit: "Lon 180ml", price: 10000, cat: "Đồ uống", emoji: "☕", g: ["#EBE0D6", "#D2BBA4"] },
  { id: "suoi", name: "Nước suối", unit: "Thùng 24 chai", price: 48000, orig: 60000, cat: "Đồ uống", emoji: "💧", g: ["#E0EEF4", "#B9DCEA"], tag: "sale" },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

const HAIRLINE = "rgba(74,67,58,0.09)";

export default function ShopPage() {
  const [screen, setScreen] = useState<"shop" | "order" | "success">("shop");
  const [cat, setCat] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const q = (c[id] || 0) - 1;
      const next = { ...c };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const subtotal = useMemo(() => CATALOG.reduce((s, p) => s + (cart[p.id] || 0) * p.price, 0), [cart]);
  const isDelivery = method === "delivery";
  const fee = isDelivery && cartCount > 0 ? 15000 : 0;
  const grandTotal = subtotal + fee;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CATALOG.filter(
      (p) => (cat === "Tất cả" || p.cat === cat) && (q === "" || p.name.toLowerCase().includes(q))
    );
  }, [cat, search]);

  const cartItems = CATALOG.filter((p) => cart[p.id]);
  const canConfirm = !!(form.name.trim() && form.phone.trim() && (!isDelivery || form.address.trim()));
  const methodLabel = isDelivery ? "Giao tận nơi" : "Lấy tại cửa hàng";

  async function handleConfirm() {
    if (!canConfirm || submitting) return;
    setSubmitting(true);
    setError("");
    const note = [
      `[${methodLabel}]`,
      cartItems.map((p) => `${p.name} x${cart[p.id]}`).join(", "),
      `Tổng: ${fmt(grandTotal)}`,
      isDelivery && form.address ? `Địa chỉ: ${form.address}` : "",
      form.note ? `Ghi chú: ${form.note}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note, category: "retail" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi đơn thất bại");
      setOrderCode("CB" + Math.floor(100000 + Math.random() * 900000));
      setScreen("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  }

  function newOrder() {
    setCart({});
    setForm({ name: "", phone: "", address: "", note: "" });
    setMethod("delivery");
    setScreen("shop");
  }

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#FAF8F5", fontFamily: "var(--font-nunito), sans-serif", color: "#2A2520", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* ══════════ SHOP ══════════ */}
          {screen === "shop" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* header */}
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#FAF8F5", padding: "54px 18px 12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#4B6F44,#3A5635)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, boxShadow: "0 4px 12px rgba(75,111,68,0.28)" }}>🏪</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1.15 }}>Tạp hóa Cô Ba</div>
                    <div style={{ fontSize: 12.5, color: "#8A8178", fontWeight: 500, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                      <span>📍</span><span>32 Trần Phú · Long Hải</span>
                    </div>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(75,111,68,0.12)", border: "0.5px solid rgba(75,111,68,0.3)", borderRadius: 100, padding: "5px 11px", flexShrink: 0, marginTop: 3 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4B6F44", animation: "dcPulse 2s ease-in-out infinite" }} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#3A5635" }}>Đang mở</span>
                  </div>
                </div>

                {/* search */}
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 9, background: "#FFFFFF", border: "1px solid rgba(74,67,58,0.1)", borderRadius: 14, padding: "11px 14px" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="7" stroke="#8A8178" strokeWidth="2" /><path d="M20 20l-3.2-3.2" stroke="#8A8178" strokeWidth="2" strokeLinecap="round" /></svg>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm sản phẩm trong cửa hàng…" style={{ border: "none", background: "transparent", flex: 1, fontSize: 14, fontWeight: 500, color: "#2A2520", minWidth: 0 }} />
                </div>

                {/* category tabs */}
                <div style={{ marginTop: 13, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }} className="dc-noscroll">
                  {CATS.map((label) => {
                    const active = label === cat;
                    return (
                      <button key={label} onClick={() => setCat(label)} style={{ flexShrink: 0, border: active ? "none" : "1px solid rgba(74,67,58,0.13)", background: active ? "#4B6F44" : "#fff", color: active ? "#fff" : "#6B6258", borderRadius: 100, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", boxShadow: active ? "0 3px 10px rgba(75,111,68,0.28)" : "none" }}>{label}</button>
                    );
                  })}
                </div>
              </div>

              {/* product grid */}
              <div style={{ flex: 1, overflowY: "auto", padding: "6px 18px 120px" }} className="dc-noscroll">
                {filtered.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
                    {filtered.map((p) => {
                      const qty = cart[p.id] || 0;
                      return (
                        <div key={p.id} style={{ background: "#FFFFFF", border: `1px solid ${HAIRLINE}`, borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                          <div style={{ position: "relative", height: 104, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(140deg, ${p.g[0]}, ${p.g[1]})` }}>
                            <span style={{ fontSize: 46, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}>{p.emoji}</span>
                            {p.tag === "new" && <div style={{ position: "absolute", top: 9, left: 9, background: "#4B6F44", color: "#fff", fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 100, letterSpacing: "0.01em" }}>Mới</div>}
                            {p.tag === "sale" && <div style={{ position: "absolute", top: 9, left: 9, background: "#C05000", color: "#fff", fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 100, letterSpacing: "0.01em" }}>Sale -20%</div>}
                            {p.soldOut && (
                              <div style={{ position: "absolute", inset: 0, background: "rgba(42,37,32,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ background: "rgba(42,37,32,0.85)", color: "#fff", fontSize: 12, fontWeight: 800, padding: "5px 13px", borderRadius: 100 }}>Hết hàng</span>
                              </div>
                            )}
                          </div>
                          <div style={{ padding: "11px 12px 12px", display: "flex", flexDirection: "column", flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.01em" }}>{p.name}</div>
                            <div style={{ fontSize: 11.5, color: "#8A8178", fontWeight: 600, marginTop: 3 }}>{p.unit}</div>
                            <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 6 }}>
                              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                                {p.orig && <span style={{ fontSize: 11, color: "#B3AAA0", fontWeight: 600, textDecoration: "line-through" }}>{fmt(p.orig)}</span>}
                                <span style={{ fontSize: 15.5, fontWeight: 900, color: "#C05000", letterSpacing: "-0.02em" }}>{fmt(p.price)}</span>
                              </div>
                              {p.soldOut ? (
                                <button disabled style={{ width: 34, height: 34, borderRadius: 11, border: "1px solid rgba(74,67,58,0.12)", background: "#F3EFE9", color: "#C9C0B6", fontSize: 22, fontWeight: 600, lineHeight: 1, flexShrink: 0 }}>+</button>
                              ) : qty === 0 ? (
                                <button onClick={() => add(p.id)} style={{ width: 34, height: 34, borderRadius: 11, border: "none", background: "#4B6F44", color: "#fff", fontSize: 22, fontWeight: 600, lineHeight: 1, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(75,111,68,0.3)" }}>+</button>
                              ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: 2, background: "#4B6F44", borderRadius: 11, padding: "0 2px", flexShrink: 0, boxShadow: "0 3px 8px rgba(75,111,68,0.3)" }}>
                                  <button onClick={() => dec(p.id)} style={{ width: 30, height: 34, border: "none", background: "transparent", color: "#fff", fontSize: 20, fontWeight: 600, cursor: "pointer", lineHeight: 1 }}>−</button>
                                  <span style={{ minWidth: 16, textAlign: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>{qty}</span>
                                  <button onClick={() => add(p.id)} style={{ width: 30, height: 34, border: "none", background: "transparent", color: "#fff", fontSize: 20, fontWeight: 600, cursor: "pointer", lineHeight: 1 }}>+</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#8A8178" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Không tìm thấy sản phẩm nào</div>
                  </div>
                )}
              </div>

              {/* cart sticky bar */}
              {cartCount > 0 && (
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 18px 30px", background: "linear-gradient(to top,#FAF8F5 70%,rgba(250,248,245,0))", zIndex: 40 }}>
                  <button onClick={() => setScreen("order")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#4B6F44", border: "none", borderRadius: 16, padding: "13px 16px 13px 14px", cursor: "pointer", boxShadow: "0 8px 22px rgba(75,111,68,0.34)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ position: "relative", display: "inline-flex", width: 34, height: 34, borderRadius: 11, background: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🛒
                        <span style={{ position: "absolute", top: -5, right: -5, minWidth: 19, height: 19, padding: "0 4px", borderRadius: 10, background: "#C05000", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #4B6F44" }}>{cartCount}</span>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.15 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{cartCount} sản phẩm</span>
                        <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-0.01em" }}>{fmt(subtotal)}</span>
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 800, color: "#fff" }}>Đặt hàng
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══════════ ORDER ══════════ */}
          {screen === "order" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#FAF8F5", padding: "54px 18px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(74,67,58,0.07)" }}>
                <button onClick={() => setScreen("shop")} style={{ width: 38, height: 38, borderRadius: 12, border: "1px solid rgba(74,67,58,0.12)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#2A2520" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>Đặt hàng</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 120px" }} className="dc-noscroll">
                <div style={sectionLabel}>Sản phẩm đã chọn</div>
                <div style={{ background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 16, overflow: "hidden" }}>
                  {cartItems.map((p, i) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderBottom: i < cartItems.length - 1 ? "1px solid rgba(74,67,58,0.07)" : "none" }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, background: `linear-gradient(140deg, ${p.g[0]}, ${p.g[1]})` }}>{p.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>{p.name}</div>
                        <div style={{ fontSize: 11.5, color: "#8A8178", fontWeight: 600, marginTop: 2 }}>{fmt(p.price)} · {p.unit}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 900, color: "#2A2520" }}>{fmt(p.price * cart[p.id])}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 1, background: "#F3EFE9", borderRadius: 9 }}>
                          <button onClick={() => dec(p.id)} style={{ width: 26, height: 26, border: "none", background: "transparent", color: "#4B6F44", fontSize: 17, fontWeight: 700, cursor: "pointer", lineHeight: 1 }}>−</button>
                          <span style={{ minWidth: 18, textAlign: "center", fontSize: 13, fontWeight: 800 }}>{cart[p.id]}</span>
                          <button onClick={() => add(p.id)} style={{ width: 26, height: 26, border: "none", background: "transparent", color: "#4B6F44", fontSize: 17, fontWeight: 700, cursor: "pointer", lineHeight: 1 }}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ ...sectionLabel, margin: "20px 0 9px" }}>Phương thức nhận hàng</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setMethod("delivery")} style={methodStyle(isDelivery)}>
                    <span style={{ fontSize: 22 }}>🛵</span>
                    <span style={{ fontSize: 13.5, fontWeight: 800 }}>Giao tận nơi</span>
                    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>+15.000đ phí ship</span>
                  </button>
                  <button onClick={() => setMethod("pickup")} style={methodStyle(!isDelivery)}>
                    <span style={{ fontSize: 22 }}>🏪</span>
                    <span style={{ fontSize: 13.5, fontWeight: 800 }}>Lấy tại cửa hàng</span>
                    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>Miễn phí · sẵn sàng 30′</span>
                  </button>
                </div>

                <div style={{ ...sectionLabel, margin: "20px 0 9px" }}>Thông tin người nhận</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Field label="Họ và tên" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="VD: Nguyễn Văn A" />
                  <Field label="Số điện thoại" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="VD: 0901 234 567" inputMode="numeric" />
                  {isDelivery && (
                    <Field label="Địa chỉ giao hàng" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} placeholder="Số nhà, đường, khu phố…" />
                  )}
                  <div>
                    <label style={fieldLabel}>Ghi chú <span style={{ fontWeight: 600, color: "#B3AAA0" }}>(không bắt buộc)</span></label>
                    <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="VD: Giao trước 18h, gọi trước khi tới…" rows={2} style={{ ...inputStyle, resize: "none", fontFamily: "var(--font-nunito), sans-serif" }} />
                  </div>
                </div>

                <div style={{ marginTop: 18, background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 16, padding: "15px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600, color: "#6B6258", marginBottom: 8 }}>
                    <span>Tạm tính</span><span style={{ fontWeight: 700, color: "#2A2520" }}>{fmt(subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600, color: "#6B6258", paddingBottom: 11, borderBottom: `1px solid ${HAIRLINE}` }}>
                    <span>Phí giao hàng</span><span style={{ fontWeight: 700, color: "#2A2520" }}>{fee > 0 ? fmt(fee) : "Miễn phí"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 11 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 800 }}>Tổng cộng</span>
                    <span style={{ fontSize: 21, fontWeight: 900, color: "#C05000", letterSpacing: "-0.02em" }}>{fmt(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 18px 30px", background: "linear-gradient(to top,#FAF8F5 72%,rgba(250,248,245,0))", zIndex: 40 }}>
                {error && <div style={{ color: "#C0392B", fontSize: 12.5, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>{error}</div>}
                <button onClick={handleConfirm} disabled={!canConfirm || submitting} style={{ width: "100%", border: "none", borderRadius: 16, padding: 15, fontSize: 16, fontWeight: 800, cursor: canConfirm && !submitting ? "pointer" : "not-allowed", color: "#fff", background: canConfirm ? "#4B6F44" : "#C9C0B6", boxShadow: canConfirm ? "0 8px 22px rgba(75,111,68,0.34)" : "none", fontFamily: "var(--font-nunito), sans-serif" }}>
                  {submitting ? "Đang gửi…" : canConfirm ? "Xác nhận đặt hàng" : "Vui lòng điền thông tin"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════ SUCCESS ══════════ */}
          {screen === "success" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "54px 26px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#4B6F44,#3A5635)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(75,111,68,0.34)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="46" height="46" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 23, fontWeight: 900, marginTop: 24, letterSpacing: "-0.02em", animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Đơn hàng đã ghi nhận</div>
              <div style={{ fontSize: 14.5, color: "#8A8178", fontWeight: 600, marginTop: 8, lineHeight: 1.5, maxWidth: 280, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Cửa hàng sẽ xác nhận đơn của bạn sớm. Cảm ơn bạn đã mua sắm tại Tạp hóa Cô Ba! 🌊</div>

              <div style={{ marginTop: 24, width: "100%", background: "#fff", border: `1px solid ${HAIRLINE}`, borderRadius: 16, padding: 16, textAlign: "left", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                <SummaryRow label="Mã đơn" value={orderCode} mono />
                <SummaryRow label="Người nhận" value={form.name} />
                <SummaryRow label="Nhận hàng" value={methodLabel} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 11, borderTop: `1px solid ${HAIRLINE}` }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>Tổng cộng</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#C05000" }}>{fmt(grandTotal)}</span>
                </div>
              </div>

              <button onClick={newOrder} style={{ marginTop: 22, width: "100%", background: "#4B6F44", border: "none", borderRadius: 15, padding: 15, fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 8px 22px rgba(75,111,68,0.32)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both", fontFamily: "var(--font-nunito), sans-serif" }}>Tiếp tục mua sắm</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; inputMode?: "numeric" }) {
  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} inputMode={inputMode} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#8A8178", marginBottom: 10 }}>
      <span>{label}</span>
      <span style={{ fontWeight: mono ? 800 : 700, color: "#2A2520", fontVariantNumeric: mono ? "tabular-nums" : undefined }}>{value}</span>
    </div>
  );
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#FAF8F5", boxShadow: "0 20px 60px rgba(17,24,39,0.18)" };
const sectionLabel: CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8A8178", marginBottom: 9 };
const fieldLabel: CSSProperties = { fontSize: 12, fontWeight: 700, color: "#6B6258", display: "block", marginBottom: 5 };
const inputStyle: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(74,67,58,0.13)", background: "#fff", borderRadius: 12, padding: "12px 14px", fontSize: 14, fontWeight: 600, color: "#2A2520", fontFamily: "var(--font-nunito), sans-serif" };

function methodStyle(selected: boolean): CSSProperties {
  return {
    flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start",
    borderRadius: 14, padding: "13px 14px", cursor: "pointer", textAlign: "left",
    border: selected ? "2px solid #4B6F44" : "1px solid rgba(74,67,58,0.13)",
    background: selected ? "rgba(75,111,68,0.07)" : "#fff",
    color: selected ? "#3A5635" : "#6B6258",
    fontFamily: "var(--font-nunito), sans-serif",
  };
}

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(16px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.4); opacity:0 } 60% { transform: scale(1.08) } 100% { transform: scale(1); opacity:1 } }
@keyframes dcPulse { 0%,100% { opacity:1 } 50% { opacity:0.45 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
