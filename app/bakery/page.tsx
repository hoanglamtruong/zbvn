"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

const SER = "var(--font-playfair), serif";
const SANS = "var(--font-dm-sans), sans-serif";
const SHIP = 25000;
const WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const CATS = ["Tất cả", "Bánh kem", "Bánh mì", "Bánh ngọt", "Theo mùa"];

type Cake = { id: string; name: string; cat: string; price: number; lead: number; tag?: "bestseller" | "new" | "season"; featured?: boolean; emoji: string; g: [string, string]; desc: string };

const CATALOG: Cake[] = [
  { id: "kemdau", name: "Bánh kem dâu tươi", cat: "Bánh kem", price: 320000, lead: 3, tag: "bestseller", featured: true, emoji: "🍰", g: ["#FDEEF0", "#F6D3DA"], desc: "Cốt bông lan mềm · kem tươi · dâu Đà Lạt mọng nước." },
  { id: "kemsoco", name: "Bánh kem socola", cat: "Bánh kem", price: 350000, lead: 3, emoji: "🎂", g: ["#F1E6DD", "#DEC4AE"], desc: "Socola Bỉ đậm vị · ít ngọt · phủ ganache." },
  { id: "kemdua", name: "Bánh kem cốt dừa", cat: "Bánh kem", price: 300000, lead: 3, emoji: "🍰", g: ["#EFF3E8", "#D2E0C2"], desc: "Vị dừa thanh nhẹ · hợp người ăn ít ngọt." },
  { id: "hoacuc", name: "Bánh mì hoa cúc", cat: "Bánh mì", price: 65000, lead: 2, emoji: "🍞", g: ["#FBF1DC", "#F0DCAC"], desc: "Thơm bơ sữa · sợi bánh xé tay · mềm xốp." },
  { id: "botoi", name: "Bánh mì bơ tỏi", cat: "Bánh mì", price: 45000, lead: 2, emoji: "🥖", g: ["#F7EEDB", "#E8D3A6"], desc: "Giòn rụm · bơ tỏi thơm · nướng trong ngày." },
  { id: "tart", name: "Tart trứng · hộp 6", cat: "Bánh ngọt", price: 90000, lead: 2, emoji: "🥧", g: ["#FCF3DD", "#F4DFA2"], desc: "Vỏ tart giòn tan · nhân trứng béo mịn." },
  { id: "crois", name: "Croissant bơ · hộp 4", cat: "Bánh ngọt", price: 80000, lead: 2, tag: "new", emoji: "🥐", g: ["#FBEFD6", "#EFD7A0"], desc: "Bơ Pháp · 64 lớp · giòn tan từng lớp." },
  { id: "cup", name: "Cupcake vani · hộp 6", cat: "Bánh ngọt", price: 120000, lead: 2, emoji: "🧁", g: ["#FCEAF2", "#F4CCDD"], desc: "Cốt vani · kem bơ Ý · trang trí pastel." },
  { id: "trungthu", name: "Trung thu thập cẩm", cat: "Theo mùa", price: 75000, lead: 3, tag: "season", emoji: "🥮", g: ["#F5ECD8", "#E4CB97"], desc: "Vỏ nướng truyền thống · nhân thập cẩm." },
  { id: "khuccay", name: "Bánh khúc cây", cat: "Theo mùa", price: 280000, lead: 3, tag: "season", emoji: "🎂", g: ["#EFE7DD", "#D5C0AC"], desc: "Khúc cây Giáng sinh · socola · trang trí mùa lễ." },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";
const prod = (id: string | null) => CATALOG.find((p) => p.id === id);
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const iso = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const dmy = (d: Date) => `${("0" + d.getDate()).slice(-2)}/${("0" + (d.getMonth() + 1)).slice(-2)}`;
function badge(p: Cake): { text: string; bg: string; col: string } | null {
  if (p.tag === "bestseller") return { text: "Bestseller", bg: "#C05000", col: "#fff" };
  if (p.tag === "new") return { text: "Mới", bg: "#4B6F44", col: "#fff" };
  if (p.tag === "season") return { text: "Theo mùa", bg: "rgba(255,255,255,0.92)", col: "#9A4A12" };
  return null;
}

export default function BakeryPage() {
  const [screen, setScreen] = useState<"catalog" | "order" | "success">("catalog");
  const [cat, setCat] = useState("Tất cả");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [selDate, setSelDate] = useState<string | null>(null);
  const [selTime, setSelTime] = useState<"morning" | "afternoon">("morning");
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function openOrder(id: string) {
    const p = prod(id)!;
    setOrderId(id); setQty(1); setNote(""); setSelDate(iso(addDays(today(), p.lead))); setSelTime("morning"); setMethod("pickup"); setScreen("order");
  }

  const list = CATALOG.filter((p) => cat === "Tất cả" || p.cat === cat);
  const featured = CATALOG.find((p) => p.featured)!;
  const p = prod(orderId);
  const isDelivery = method === "delivery";
  const ship = isDelivery ? SHIP : 0;
  const subtotal = p ? p.price * qty : 0;
  const canConfirm = !!(p && form.name.trim() && form.phone.trim() && selDate && (!isDelivery || form.address.trim()));

  let pickupSummary = "";
  if (selDate) { const [, m, d] = selDate.split("-"); pickupSummary = `${("0" + d).slice(-2)}/${("0" + m).slice(-2)} · ${selTime === "morning" ? "Sáng" : "Chiều"}`; }

  async function handleConfirm() {
    if (!canConfirm || submitting || !p) return;
    setSubmitting(true); setError("");
    const noteStr = [
      "[Đặt bánh trước · Tiệm bánh Mộc]",
      `${p.name} x${qty}`,
      `Ngày nhận: ${pickupSummary}`,
      isDelivery ? "Giao tận nơi" : "Đến lấy tại tiệm",
      `Tổng: ${fmt(subtotal + ship)}`,
      isDelivery && form.address ? `Địa chỉ: ${form.address}` : "",
      note ? `Ghi chú: ${note}` : "",
    ].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note: noteStr, category: "bakery" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi đơn thất bại");
      setOrderCode("MO" + Math.floor(100000 + Math.random() * 900000));
      setScreen("success");
    } catch (err) { setError(err instanceof Error ? err.message : "Có lỗi xảy ra"); } finally { setSubmitting(false); }
  }
  function newOrder() { setCat("Tất cả"); setForm({ name: "", phone: "", address: "" }); setScreen("catalog"); }

  // date strip (computed only when on order screen → client-side, no SSR mismatch)
  const dateStrip = p ? Array.from({ length: 14 }, (_, i) => {
    const d = addDays(today(), i);
    const disabled = i < p.lead;
    const selected = iso(d) === selDate;
    return { i, weekday: WD[d.getDay()], day: d.getDate(), disabled, selected, isod: iso(d) };
  }) : [];
  const earliest = p ? addDays(today(), p.lead) : null;

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#FFFBF5", fontFamily: SANS, color: "#332B23", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* CATALOG */}
          {screen === "catalog" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ background: "#FFFBF5", padding: "54px 20px 0" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#4B6F44,#3A5635)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 }}>🧁</div>
                      <div style={{ fontFamily: SER, fontSize: 27, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}>Tiệm bánh Mộc</div>
                    </div>
                    <div style={{ fontSize: 12.5, color: "#8C8175", marginTop: 7, fontStyle: "italic", fontFamily: SER }}>Bánh nhà làm · mỗi ngày một mẻ</div>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(75,111,68,0.1)", border: "0.5px solid rgba(75,111,68,0.28)", borderRadius: 100, padding: "6px 12px", flexShrink: 0, marginTop: 2 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4B6F44", animation: "dcPulse 2s ease-in-out infinite" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#3A5635", whiteSpace: "nowrap" }}>Nhận đặt trước</span>
                  </div>
                </div>
                <div style={{ marginTop: 15, display: "flex", alignItems: "center", gap: 9, background: "rgba(192,80,0,0.08)", border: "0.5px solid rgba(192,80,0,0.2)", borderRadius: 12, padding: "11px 14px" }}>
                  <span style={{ fontSize: 16 }}>⏰</span>
                  <span style={{ fontSize: 12.5, color: "#9A4A12", fontWeight: 500, lineHeight: 1.35 }}>Đặt trước tối thiểu <strong style={{ fontWeight: 700 }}>2 ngày</strong> · bánh được làm theo mẻ, tươi mới.</span>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 30px" }} className="dc-noscroll">
                {/* featured */}
                <div onClick={() => openOrder(featured.id)} style={{ cursor: "pointer", borderRadius: 18, overflow: "hidden", background: "#fff", border: "1px solid rgba(51,43,35,0.07)" }}>
                  <div style={{ position: "relative", height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(145deg, ${featured.g[0]}, ${featured.g[1]})` }}>
                    <span style={{ fontSize: 96, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))" }}>{featured.emoji}</span>
                    <div style={{ position: "absolute", top: 13, left: 13, background: "#C05000", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 11px", borderRadius: 100 }}>★ Bestseller</div>
                  </div>
                  <div style={{ padding: "15px 17px 17px" }}>
                    <div style={{ fontFamily: SER, fontSize: 23, fontWeight: 700, lineHeight: 1.15 }}>{featured.name}</div>
                    <div style={{ fontSize: 12.5, color: "#8C8175", marginTop: 5, lineHeight: 1.5 }}>{featured.desc}</div>
                    <div style={{ marginTop: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                        <span style={{ fontSize: 10.5, color: "#A89C8D", fontWeight: 500 }}>Từ</span>
                        <span style={{ fontFamily: SER, fontSize: 21, fontWeight: 700, color: "#C05000", marginTop: 3 }}>{fmt(featured.price)}</span>
                      </div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#4B6F44", color: "#fff", borderRadius: 100, padding: "11px 20px", fontSize: 13, fontWeight: 600 }}>Đặt trước
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* categories */}
                <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="dc-noscroll">
                  {CATS.map((label) => {
                    const active = cat === label;
                    return <button key={label} onClick={() => setCat(label)} style={{ flexShrink: 0, border: active ? "none" : "1px solid rgba(51,43,35,0.14)", background: active ? "#4B6F44" : "#fff", color: active ? "#fff" : "#7C7264", borderRadius: 100, padding: "8px 15px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", boxShadow: active ? "0 3px 9px rgba(75,111,68,0.25)" : "none", fontFamily: SANS }}>{label}</button>;
                  })}
                </div>

                {/* grid */}
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
                  {list.map((c) => {
                    const b = badge(c);
                    return (
                      <div key={c.id} style={{ background: "#fff", border: "1px solid rgba(51,43,35,0.07)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        <div style={{ position: "relative", height: 112, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(145deg, ${c.g[0]}, ${c.g[1]})` }}>
                          <span style={{ fontSize: 50, filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.08))" }}>{c.emoji}</span>
                          {b && <div style={{ position: "absolute", top: 9, left: 9, background: b.bg, color: b.col, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 100 }}>{b.text}</div>}
                        </div>
                        <div style={{ padding: "11px 12px 12px", display: "flex", flexDirection: "column", flex: 1 }}>
                          <div style={{ fontFamily: SER, fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "#9A8F80", marginTop: 4, lineHeight: 1.4, flex: 1 }}>{c.desc}</div>
                          <div style={{ marginTop: 10, fontFamily: SER, fontSize: 17, fontWeight: 700, color: "#C05000" }}>{fmt(c.price)}</div>
                          <button onClick={() => openOrder(c.id)} style={{ marginTop: 9, width: "100%", border: "1px solid #4B6F44", background: "transparent", color: "#3A5635", borderRadius: 10, padding: 9, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>Đặt trước</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PRE-ORDER */}
          {screen === "order" && p && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#FFFBF5", padding: "54px 20px 13px", display: "flex", alignItems: "center", gap: 13, borderBottom: "1px solid rgba(51,43,35,0.07)" }}>
                <button onClick={() => setScreen("catalog")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(51,43,35,0.12)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#332B23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ fontFamily: SER, fontSize: 24, fontWeight: 700 }}>Đặt trước</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 110px" }} className="dc-noscroll">
                <div style={{ display: "flex", gap: 13, background: "#fff", border: "1px solid rgba(51,43,35,0.07)", borderRadius: 14, padding: 13 }}>
                  <div style={{ width: 78, height: 78, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: `linear-gradient(145deg, ${p.g[0]}, ${p.g[1]})` }}>{p.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: SER, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: "#C05000", fontWeight: 600, marginTop: 3 }}>Cần đặt trước {p.lead} ngày</div>
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10 }}>
                      <span style={{ fontFamily: SER, fontSize: 18, fontWeight: 700, color: "#C05000" }}>{fmt(p.price)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid rgba(51,43,35,0.13)", borderRadius: 9 }}>
                        <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>−</button>
                        <span style={{ minWidth: 20, textAlign: "center", fontSize: 14, fontWeight: 700 }}>{qty}</span>
                        <button onClick={() => setQty((q) => q + 1)} style={qtyBtn}>+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ ...uplabel, margin: "22px 0 9px" }}>Ghi chú cho tiệm</div>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={'VD: ghi chữ "Chúc mừng sinh nhật" · ít ngọt · trang trí tông pastel…'} style={{ width: "100%", boxSizing: "border-box", border: "1px solid rgba(51,43,35,0.13)", background: "#fff", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#332B23", resize: "none", fontFamily: SANS, lineHeight: 1.5 }} />

                <div style={{ ...uplabel, margin: "22px 0 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Ngày nhận</span><span style={{ fontFamily: SER, fontSize: 14, letterSpacing: 0, textTransform: "none", fontWeight: 600, color: "#332B23" }}>Tháng {earliest && earliest.getMonth() + 1}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "#A89C8D", marginBottom: 11 }}>Sớm nhất: {earliest && `${WD[earliest.getDay()]} · ${dmy(earliest)}`} (do cần thời gian làm bánh)</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 5 }} className="dc-noscroll">
                  {dateStrip.map((d) => (
                    <button key={d.i} onClick={() => !d.disabled && setSelDate(d.isod)} disabled={d.disabled} style={{ flexShrink: 0, width: 52, height: 62, borderRadius: 12, cursor: d.disabled ? "default" : "pointer", padding: "8px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: d.selected ? "none" : "1px solid rgba(51,43,35,0.12)", background: d.selected ? "#4B6F44" : d.disabled ? "#F4EFE7" : "#fff", opacity: d.disabled ? 0.45 : 1, boxShadow: d.selected ? "0 4px 11px rgba(75,111,68,0.28)" : "none" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: d.selected ? "rgba(255,255,255,0.85)" : "#A89C8D" }}>{d.weekday}</span>
                      <span style={{ fontFamily: SER, fontSize: 19, fontWeight: 700, color: d.selected ? "#fff" : "#332B23", lineHeight: 1 }}>{d.day}</span>
                    </button>
                  ))}
                </div>

                <div style={{ ...uplabel, margin: "22px 0 10px" }}>Giờ nhận</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setSelTime("morning")} style={timeStyle(selTime === "morning")}>
                    <span style={{ fontSize: 18 }}>🌤️</span>
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}><span style={{ fontSize: 13.5, fontWeight: 700 }}>Buổi sáng</span><span style={{ fontSize: 11, opacity: 0.7 }}>8:00 – 11:00</span></span>
                  </button>
                  <button onClick={() => setSelTime("afternoon")} style={timeStyle(selTime === "afternoon")}>
                    <span style={{ fontSize: 18 }}>🌇</span>
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}><span style={{ fontSize: 13.5, fontWeight: 700 }}>Buổi chiều</span><span style={{ fontSize: 11, opacity: 0.7 }}>14:00 – 18:00</span></span>
                  </button>
                </div>

                <div style={{ ...uplabel, margin: "22px 0 10px" }}>Hình thức nhận</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setMethod("pickup")} style={methodStyle(!isDelivery)}>
                    <span style={{ fontSize: 20 }}>🏠</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Đến lấy tại tiệm</span>
                    <span style={{ fontSize: 10.5, opacity: 0.72 }}>Miễn phí</span>
                  </button>
                  <button onClick={() => setMethod("delivery")} style={methodStyle(isDelivery)}>
                    <span style={{ fontSize: 20 }}>🛵</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Giao tận nơi</span>
                    <span style={{ fontSize: 10.5, opacity: 0.72 }}>+25.000đ phí ship</span>
                  </button>
                </div>

                <div style={{ ...uplabel, margin: "22px 0 11px" }}>Thông tin người đặt</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <BField label="Họ và tên" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="VD: Lê Thu Hà" />
                  <BField label="Số điện thoại" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="VD: 0903 456 789" inputMode="numeric" />
                  {isDelivery && <BField label="Địa chỉ giao hàng" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} placeholder="Số nhà, đường, phường…" />}
                </div>

                <div style={{ marginTop: 20, background: "#fff", border: "1px solid rgba(51,43,35,0.07)", borderRadius: 14, padding: "15px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7C7264", marginBottom: 7 }}><span>{p.name} × {qty}</span><span style={{ color: "#332B23", fontWeight: 600 }}>{fmt(subtotal)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7C7264", paddingBottom: 11, borderBottom: "1px solid rgba(51,43,35,0.08)" }}><span>Phí giao hàng</span><span style={{ color: "#332B23", fontWeight: 600 }}>{ship > 0 ? fmt(ship) : "Miễn phí"}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 11 }}><span style={{ fontSize: 13.5, fontWeight: 700 }}>Tổng cộng</span><span style={{ fontFamily: SER, fontSize: 24, fontWeight: 700, color: "#C05000" }}>{fmt(subtotal + ship)}</span></div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#FFFBF5 74%,rgba(255,251,245,0))", zIndex: 40 }}>
                {error && <div style={{ textAlign: "center", color: "#C0392B", fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>{error}</div>}
                <button onClick={handleConfirm} disabled={!canConfirm || submitting} style={{ width: "100%", height: 52, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: canConfirm && !submitting ? "pointer" : "not-allowed", color: "#fff", background: canConfirm ? "#4B6F44" : "#C7BEB0", boxShadow: canConfirm ? "0 8px 20px rgba(75,111,68,0.3)" : "none", fontFamily: SANS }}>{submitting ? "Đang gửi…" : canConfirm ? "Xác nhận đặt trước" : "Vui lòng điền thông tin"}</button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {screen === "success" && p && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "54px 28px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#4B6F44,#3A5635)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 32px rgba(75,111,68,0.3)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontFamily: SER, fontSize: 29, fontWeight: 700, marginTop: 24, lineHeight: 1.15, animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Đã nhận đơn đặt trước</div>
              <div style={{ fontSize: 14, color: "#7C7264", marginTop: 9, lineHeight: 1.6, maxWidth: 290, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Tiệm bánh Mộc sẽ xác nhận đơn của bạn trong vòng <strong style={{ color: "#C05000" }}>2 giờ</strong>. Cảm ơn bạn đã tin tưởng đặt bánh! 🧁</div>
              <div style={{ marginTop: 26, width: "100%", border: "1px solid rgba(51,43,35,0.08)", borderRadius: 14, padding: 18, textAlign: "left", background: "#fff", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#9A8F80", marginBottom: 11 }}><span>Mã đơn</span><span style={{ fontWeight: 700, color: "#332B23", fontVariantNumeric: "tabular-nums" }}>{orderCode}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#9A8F80", marginBottom: 11 }}><span>Bánh</span><span style={{ fontWeight: 600, color: "#332B23", textAlign: "right", maxWidth: 200 }}>{p.name} × {qty}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#9A8F80", marginBottom: 11 }}><span>Ngày nhận</span><span style={{ fontWeight: 600, color: "#332B23" }}>{pickupSummary}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "1px solid rgba(51,43,35,0.08)" }}><span style={{ fontSize: 13, fontWeight: 700 }}>Tổng cộng</span><span style={{ fontFamily: SER, fontSize: 22, fontWeight: 700, color: "#C05000" }}>{fmt(subtotal + ship)}</span></div>
              </div>
              <button onClick={newOrder} style={{ marginTop: 24, width: "100%", height: 50, background: "#4B6F44", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(75,111,68,0.3)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both", fontFamily: SANS }}>Về trang chủ tiệm</button>
              <Link href="/" style={{ marginTop: 16, fontSize: 12.5, color: "#9A8F80", fontFamily: SANS }}>← Về trang chủ zeebee.vn</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BField({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; inputMode?: "numeric" }) {
  return (<div><label style={{ fontSize: 12, color: "#7C7264", fontWeight: 500, display: "block", marginBottom: 5 }}>{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} inputMode={inputMode} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", border: "1px solid rgba(51,43,35,0.13)", background: "#fff", borderRadius: 10, padding: "12px 13px", fontSize: 14, color: "#332B23", fontFamily: SANS }} /></div>);
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#FFFBF5", boxShadow: "0 20px 60px rgba(17,24,39,0.18)" };
const uplabel: CSSProperties = { fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "#9A8F80" };
const qtyBtn: CSSProperties = { width: 30, height: 30, border: "none", background: "transparent", fontSize: 17, cursor: "pointer", color: "#332B23" };
function timeStyle(sel: boolean): CSSProperties {
  return { flex: 1, display: "flex", alignItems: "center", gap: 9, borderRadius: 12, padding: "13px 14px", cursor: "pointer", justifyContent: "center", border: sel ? "2px solid #4B6F44" : "1px solid rgba(51,43,35,0.13)", background: sel ? "rgba(75,111,68,0.07)" : "#fff", color: sel ? "#3A5635" : "#7C7264", fontFamily: SANS };
}
function methodStyle(sel: boolean): CSSProperties {
  return { flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3, borderRadius: 12, padding: "13px 14px", cursor: "pointer", textAlign: "left", border: sel ? "2px solid #4B6F44" : "1px solid rgba(51,43,35,0.13)", background: sel ? "rgba(75,111,68,0.07)" : "#fff", color: sel ? "#3A5635" : "#7C7264", fontFamily: SANS };
}

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
@keyframes dcPulse { 0%,100% { opacity:1 } 50% { opacity:0.45 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
