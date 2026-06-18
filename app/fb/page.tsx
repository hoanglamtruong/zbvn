"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

const SANS = "var(--font-nunito), sans-serif";
const WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const CATS = ["Món chính", "Đồ uống", "Tráng miệng", "Combo"];
const TIMES = ["11:00", "11:30", "12:00", "12:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
const PICKUPS = ["Sớm nhất (~30′)", "11:30", "12:00", "12:30", "18:30", "19:00"];

type Dish = { id: string; name: string; cat: string; price: number; featured?: boolean; emoji: string; g: [string, string]; desc: string };

const MENU: Dish[] = [
  { id: "comga", name: "Cơm gà xối mỡ", cat: "Món chính", price: 65000, featured: true, emoji: "🍗", g: ["#5A3415", "#2E1B0A"], desc: "Da giòn rụm · cơm thơm mỡ hành · kèm canh." },
  { id: "bunbo", name: "Bún bò Huế", cat: "Món chính", price: 55000, emoji: "🍜", g: ["#5C2A12", "#2E1608"], desc: "Nước dùng đậm đà · giò heo · chả cua." },
  { id: "mixao", name: "Mì xào hải sản", cat: "Món chính", price: 75000, emoji: "🍝", g: ["#4E3010", "#2A1808"], desc: "Tôm mực tươi · rau cải · sốt đậm." },
  { id: "lauthai", name: "Lẩu Thái nhỏ", cat: "Món chính", price: 180000, emoji: "🍲", g: ["#5C2810", "#2E1408"], desc: "Chua cay · hải sản · rau nấm · 2–3 người." },
  { id: "caphe", name: "Cà phê sữa đá", cat: "Đồ uống", price: 25000, emoji: "☕", g: ["#4A2E14", "#26150A"], desc: "Cà phê phin đậm · sữa đặc · đá." },
  { id: "tradao", name: "Trà đào cam sả", cat: "Đồ uống", price: 35000, emoji: "🧋", g: ["#5A3A12", "#2C1C08"], desc: "Đào giòn · cam tươi · sả thơm mát." },
  { id: "sinhto", name: "Sinh tố bơ", cat: "Đồ uống", price: 40000, emoji: "🥑", g: ["#3E3A12", "#221E08"], desc: "Bơ sáp béo · sữa · ít ngọt." },
  { id: "epcam", name: "Nước ép cam", cat: "Đồ uống", price: 30000, emoji: "🍊", g: ["#5C3A0C", "#2E1C06"], desc: "Cam vắt nguyên chất · không đường." },
  { id: "che", name: "Chè khúc bạch", cat: "Tráng miệng", price: 30000, emoji: "🍧", g: ["#4A2E1C", "#26160E"], desc: "Khúc bạch mềm · hạnh nhân · nhãn." },
  { id: "flan", name: "Bánh flan", cat: "Tráng miệng", price: 20000, emoji: "🍮", g: ["#5A3A14", "#2C1C0A"], desc: "Caramen mịn · trứng sữa · béo nhẹ." },
  { id: "kemdua", name: "Kem dừa", cat: "Tráng miệng", price: 35000, emoji: "🥥", g: ["#3E3214", "#201A0A"], desc: "Kem dừa mát · dừa nạo · đậu phộng." },
  { id: "combo1", name: "Combo cơm + nước", cat: "Combo", price: 80000, emoji: "🍱", g: ["#5A3014", "#2E180A"], desc: "1 món cơm chính + 1 đồ uống tự chọn." },
  { id: "combo2", name: "Combo 2 người", cat: "Combo", price: 250000, emoji: "🍛", g: ["#5C2E10", "#2E1708"], desc: "2 món chính + 2 nước + 1 tráng miệng." },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";
const prod = (id: string) => MENU.find((p) => p.id === id)!;
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const iso = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
function imgBox(p: Dish, size: number): CSSProperties {
  return { width: size, height: size, borderRadius: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, background: `radial-gradient(circle at 50% 38%, rgba(255,150,70,0.22), transparent 70%), linear-gradient(145deg, ${p.g[0]}, ${p.g[1]})` };
}

export default function FbPage() {
  const [screen, setScreen] = useState<"menu" | "reserve" | "order" | "success">("menu");
  const [mode, setMode] = useState<"dinein" | "takeaway">("dinein");
  const [cat, setCat] = useState("Món chính");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [resv, setResv] = useState({ date: null as string | null, time: null as string | null, people: 2, request: "", name: "", phone: "" });
  const [ord, setOrd] = useState({ name: "", phone: "", address: "", pickup: "Sớm nhất (~30′)" });
  const [successType, setSuccessType] = useState<"reserve" | "order">("reserve");
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isTakeaway = mode === "takeaway";
  const add = (id: string) => setCart((s) => ({ ...s, [id]: (s[id] || 0) + 1 }));
  const dec = (id: string) => setCart((s) => { const c = { ...s }; const v = (c[id] || 0) - 1; if (v <= 0) delete c[id]; else c[id] = v; return c; });
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((s, [id, q]) => s + prod(id).price * q, 0);

  const list = MENU.filter((p) => p.cat === cat);
  const fp = MENU.find((p) => p.featured)!;
  const cartItems = Object.entries(cart).map(([id, q]) => ({ ...prod(id), qty: q }));
  const canReserve = !!(resv.date && resv.time && resv.name.trim() && resv.phone.trim());
  const canOrder = !!(cartCount > 0 && ord.name.trim() && ord.phone.trim());

  const dateStrip = Array.from({ length: 14 }, (_, i) => { const d = addDays(today(), i); return { i, weekday: WD[d.getDay()], day: d.getDate(), isod: iso(d), sel: iso(d) === resv.date }; });

  async function post(name: string, phone: string, note: string) {
    const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, note, category: "fb" }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gửi thất bại");
  }

  async function confirmReserve() {
    if (!canReserve || submitting) return;
    setSubmitting(true); setError("");
    const dlabel = resv.date ? resv.date.split("-").slice(1).reverse().map((x) => ("0" + x).slice(-2)).join("/") : "";
    const note = ["[Đặt bàn · Bếp Biển]", `Ngày ${dlabel} · ${resv.time}`, `${resv.people} người`, resv.request ? `Yêu cầu: ${resv.request}` : ""].filter(Boolean).join(" · ");
    try { await post(resv.name.trim(), resv.phone.trim(), note); setSuccessType("reserve"); setOrderCode("BB" + Math.floor(10000 + Math.random() * 90000)); setScreen("success"); }
    catch (e) { setError(e instanceof Error ? e.message : "Lỗi"); } finally { setSubmitting(false); }
  }
  async function confirmOrder() {
    if (!canOrder || submitting) return;
    setSubmitting(true); setError("");
    const note = ["[Đơn mang đi · Bếp Biển]", cartItems.map((it) => `${it.name} x${it.qty}`).join(", "), `Giờ nhận: ${ord.pickup}`, `Tổng: ${fmt(subtotal)}`, ord.address ? `Giao: ${ord.address}` : "Tự đến lấy"].filter(Boolean).join(" · ");
    try { await post(ord.name.trim(), ord.phone.trim(), note); setSuccessType("order"); setOrderCode("BB" + Math.floor(10000 + Math.random() * 90000)); setScreen("success"); }
    catch (e) { setError(e instanceof Error ? e.message : "Lỗi"); } finally { setSubmitting(false); }
  }
  function home() { setScreen("menu"); setCart({}); setResv({ date: null, time: null, people: 2, request: "", name: "", phone: "" }); setOrd({ name: "", phone: "", address: "", pickup: "Sớm nhất (~30′)" }); }

  const chipStyle = (active: boolean): CSSProperties => ({ border: active ? "none" : "1px solid rgba(192,80,0,0.22)", background: active ? "#C05000" : "rgba(255,255,255,0.04)", color: active ? "#fff" : "#C9B49E", borderRadius: 100, padding: "9px 16px", fontSize: 13, fontWeight: 800, cursor: "pointer", boxShadow: active ? "0 4px 12px rgba(192,80,0,0.4)" : "none", fontFamily: SANS });
  const dlabelShort = resv.date ? resv.date.split("-").slice(1).reverse().map((x) => ("0" + x).slice(-2)).join("/") : "";
  const successRows = successType === "reserve"
    ? [["Mã đặt bàn", orderCode], ["Ngày · giờ", `${dlabelShort} · ${resv.time || ""}`], ["Số người", `${resv.people} người`], ["Người đặt", resv.name]]
    : [["Mã đơn", orderCode], ["Số món", `${cartCount} món`], ["Giờ nhận", ord.pickup], ["Tổng cộng", fmt(subtotal)]];

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#1A0F00", fontFamily: SANS, color: "#F7ECE0", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* MENU */}
          {screen === "menu" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#1A0F00", padding: "54px 20px 12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.01em", lineHeight: 1.1 }}>Bếp Biển</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#7FC06E" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4B6F44", boxShadow: "0 0 7px #7FC06E", animation: "dcPulse 2s ease-in-out infinite" }} />Đang mở</span>
                      <span style={{ fontSize: 11.5, color: "#A98B6E" }}>· 10:00 – 22:00</span>
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#C05000,#8A3800)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 6px 18px rgba(192,80,0,0.4)" }}>🍜</div>
                </div>
                <div style={{ marginTop: 15, display: "flex", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(192,80,0,0.18)", borderRadius: 13, padding: 4, gap: 4 }}>
                  <button onClick={() => setMode("dinein")} style={modeStyle(!isTakeaway)}>🍽️ Tại chỗ</button>
                  <button onClick={() => setMode("takeaway")} style={modeStyle(isTakeaway)}>🥡 Mang đi</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", paddingBottom: 130 }} className="dc-noscroll">
                {/* featured */}
                <div onClick={() => { if (isTakeaway) add(fp.id); }} style={{ margin: "8px 20px 0", borderRadius: 18, overflow: "hidden", position: "relative", cursor: "pointer", background: `radial-gradient(circle at 50% 30%, rgba(255,140,50,0.28), transparent 68%), linear-gradient(155deg, ${fp.g[0]}, ${fp.g[1]})`, border: "1px solid rgba(192,80,0,0.3)" }}>
                  <div style={{ position: "relative", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 96, filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.45))" }}>{fp.emoji}</span>
                    <div style={{ position: "absolute", top: 14, left: 14, background: "#C05000", color: "#fff", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 100, boxShadow: "0 4px 14px rgba(192,80,0,0.5)" }}>🔥 Bán chạy</div>
                  </div>
                  <div style={{ padding: "15px 18px 17px", background: "linear-gradient(to top,rgba(10,6,0,0.72),rgba(10,6,0,0.2))" }}>
                    <div style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.1 }}>{fp.name}</div>
                    <div style={{ fontSize: 12.5, color: "#D9C3A9", marginTop: 5, lineHeight: 1.45 }}>{fp.desc}</div>
                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: "#FF7A2E" }}>{fmt(fp.price)}</span>
                      {isTakeaway && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#C05000", color: "#fff", borderRadius: 100, padding: "9px 17px", fontSize: 13, fontWeight: 800, boxShadow: "0 4px 16px rgba(192,80,0,0.45)" }}>Thêm món +</span>}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 20, display: "flex", gap: 8, overflowX: "auto", padding: "0 20px 4px" }} className="dc-noscroll">
                  {CATS.map((label) => { const active = cat === label; return <button key={label} onClick={() => setCat(label)} style={{ flexShrink: 0, border: active ? "none" : "1px solid rgba(192,80,0,0.22)", background: active ? "#C05000" : "rgba(255,255,255,0.04)", color: active ? "#fff" : "#C9B49E", borderRadius: 100, padding: "8px 16px", fontSize: 13, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", boxShadow: active ? "0 4px 14px rgba(192,80,0,0.4)" : "none", fontFamily: SANS }}>{label}</button>; })}
                </div>

                <div style={{ marginTop: 14, padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {list.map((p) => {
                    const qty = cart[p.id] || 0;
                    return (
                      <div key={p.id} style={{ display: "flex", gap: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,80,0,0.15)", borderRadius: 16, padding: 11, alignItems: "center" }}>
                        <div style={imgBox(p, 66)}>{p.emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15.5, fontWeight: 800, lineHeight: 1.2 }}>{p.name}</div>
                          <div style={{ fontSize: 11.5, color: "#A98B6E", marginTop: 3, lineHeight: 1.4 }}>{p.desc}</div>
                          <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 16, fontWeight: 900, color: "#FF7A2E" }}>{fmt(p.price)}</span>
                            {isTakeaway && (qty === 0 ? (
                              <button onClick={() => add(p.id)} style={{ width: 34, height: 34, borderRadius: 11, border: "none", background: "#C05000", color: "#fff", fontSize: 21, fontWeight: 600, lineHeight: 1, cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 12px rgba(192,80,0,0.4)" }}>+</button>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: 2, background: "#C05000", borderRadius: 11, flexShrink: 0, boxShadow: "0 4px 12px rgba(192,80,0,0.4)" }}>
                                <button onClick={() => dec(p.id)} style={{ width: 30, height: 34, border: "none", background: "transparent", color: "#fff", fontSize: 19, cursor: "pointer" }}>−</button>
                                <span style={{ minWidth: 16, textAlign: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>{qty}</span>
                                <button onClick={() => add(p.id)} style={{ width: 30, height: 34, border: "none", background: "transparent", color: "#fff", fontSize: 19, cursor: "pointer" }}>+</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#1A0F00 72%,rgba(26,15,0,0))", zIndex: 40 }}>
                {!isTakeaway && <button onClick={() => setScreen("reserve")} style={{ width: "100%", height: 54, border: "none", borderRadius: 15, background: "#C05000", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: "0 8px 26px rgba(192,80,0,0.5)" }}>🍽️ Đặt bàn ngay</button>}
                {isTakeaway && cartCount > 0 && (
                  <button onClick={() => setScreen("order")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#C05000", border: "none", borderRadius: 15, padding: "11px 16px 11px 13px", cursor: "pointer", boxShadow: "0 8px 26px rgba(192,80,0,0.5)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ position: "relative", display: "inline-flex", width: 36, height: 36, borderRadius: 11, background: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🥡<span style={{ position: "absolute", top: -5, right: -5, minWidth: 19, height: 19, padding: "0 4px", borderRadius: 10, background: "#1A0F00", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #C05000" }}>{cartCount}</span></span>
                      <span style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.15 }}><span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{cartCount} món</span><span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{fmt(subtotal)}</span></span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 800, color: "#fff" }}>Xem giỏ<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESERVE */}
          {screen === "reserve" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Header title="Đặt bàn" onBack={() => setScreen("menu")} />
              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 110px" }} className="dc-noscroll">
                <div style={uplabel}>Chọn ngày</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 5, marginTop: 10 }} className="dc-noscroll">
                  {dateStrip.map((d) => (
                    <button key={d.i} onClick={() => setResv((r) => ({ ...r, date: d.isod }))} style={{ flexShrink: 0, width: 52, height: 62, borderRadius: 13, cursor: "pointer", padding: "8px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: d.sel ? "none" : "1px solid rgba(192,80,0,0.2)", background: d.sel ? "#C05000" : "rgba(255,255,255,0.04)", boxShadow: d.sel ? "0 6px 16px rgba(192,80,0,0.45)" : "none" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: d.sel ? "rgba(255,255,255,0.85)" : "#A98B6E" }}>{d.weekday}</span>
                      <span style={{ fontSize: 19, fontWeight: 900, color: d.sel ? "#fff" : "#F7ECE0", lineHeight: 1 }}>{d.day}</span>
                    </button>
                  ))}
                </div>
                <div style={{ ...uplabel, margin: "22px 0 10px" }}>Chọn giờ</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>{TIMES.map((t) => <button key={t} onClick={() => setResv((r) => ({ ...r, time: t }))} style={chipStyle(resv.time === t)}>{t}</button>)}</div>
                <div style={{ ...uplabel, margin: "22px 0 10px" }}>Số người</div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,80,0,0.18)", borderRadius: 14, padding: "12px 16px", width: "fit-content" }}>
                  <button onClick={() => setResv((r) => ({ ...r, people: Math.max(1, r.people - 1) }))} style={stepBtn}>−</button>
                  <span style={{ minWidth: 54, textAlign: "center", fontSize: 18, fontWeight: 900 }}>{resv.people}{resv.people >= 12 ? "+" : ""}</span>
                  <button onClick={() => setResv((r) => ({ ...r, people: Math.min(12, r.people + 1) }))} style={stepBtn}>+</button>
                </div>
                <div style={{ ...uplabel, margin: "22px 0 10px" }}>Yêu cầu đặc biệt</div>
                <textarea value={resv.request} onChange={(e) => setResv((r) => ({ ...r, request: e.target.value }))} rows={2} placeholder="VD: bàn gần cửa sổ · ghế trẻ em · sinh nhật…" style={{ ...darkInput, resize: "none", lineHeight: 1.5 }} />
                <div style={{ ...uplabel, margin: "22px 0 11px" }}>Thông tin liên hệ</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <DField label="Họ và tên" value={resv.name} onChange={(v) => setResv((r) => ({ ...r, name: v }))} placeholder="VD: Phạm Quốc Anh" />
                  <DField label="Số điện thoại" value={resv.phone} onChange={(v) => setResv((r) => ({ ...r, phone: v }))} placeholder="VD: 0905 678 901" inputMode="numeric" />
                </div>
              </div>
              <Footer error={error}>
                <button onClick={confirmReserve} disabled={!canReserve || submitting} style={bigBtn(canReserve, submitting)}>{submitting ? "Đang gửi…" : canReserve ? "Đặt bàn" : "Vui lòng chọn ngày, giờ & thông tin"}</button>
              </Footer>
            </div>
          )}

          {/* ORDER */}
          {screen === "order" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Header title="Giỏ mang đi" onBack={() => setScreen("menu")} />
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 110px" }} className="dc-noscroll">
                {cartItems.length > 0 ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                      {cartItems.map((it) => (
                        <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,80,0,0.15)", borderRadius: 14, padding: 11 }}>
                          <div style={imgBox(it, 52)}>{it.emoji}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14.5, fontWeight: 800, lineHeight: 1.2 }}>{it.name}</div>
                            <div style={{ fontSize: 12, color: "#FF7A2E", fontWeight: 800, marginTop: 3 }}>{fmt(it.price)}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7 }}>
                            <span style={{ fontSize: 14, fontWeight: 900 }}>{fmt(it.price * it.qty)}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 1, background: "rgba(192,80,0,0.16)", borderRadius: 9 }}>
                              <button onClick={() => dec(it.id)} style={{ width: 27, height: 27, border: "none", background: "transparent", color: "#FF7A2E", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>−</button>
                              <span style={{ minWidth: 18, textAlign: "center", fontSize: 13, fontWeight: 800 }}>{it.qty}</span>
                              <button onClick={() => add(it.id)} style={{ width: 27, height: 27, border: "none", background: "transparent", color: "#FF7A2E", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>+</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ ...uplabel, margin: "22px 0 10px" }}>Giờ nhận</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>{PICKUPS.map((t) => <button key={t} onClick={() => setOrd((o) => ({ ...o, pickup: t }))} style={chipStyle(ord.pickup === t)}>{t}</button>)}</div>
                    <div style={{ ...uplabel, margin: "22px 0 11px" }}>Thông tin nhận món</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                      <DField label="Họ và tên" value={ord.name} onChange={(v) => setOrd((o) => ({ ...o, name: v }))} placeholder="VD: Vũ Minh Châu" />
                      <DField label="Số điện thoại" value={ord.phone} onChange={(v) => setOrd((o) => ({ ...o, phone: v }))} placeholder="VD: 0906 789 012" inputMode="numeric" />
                      <DField label="Địa chỉ giao (để trống nếu tự đến lấy)" value={ord.address} onChange={(v) => setOrd((o) => ({ ...o, address: v }))} placeholder="Số nhà, đường, phường…" />
                    </div>
                    <div style={{ marginTop: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,80,0,0.15)", borderRadius: 14, padding: "15px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: 13.5, fontWeight: 700, color: "#C9B49E" }}>Tổng cộng</span><span style={{ fontSize: 24, fontWeight: 900, color: "#FF7A2E" }}>{fmt(subtotal)}</span></div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#A98B6E" }}><div style={{ fontSize: 40, marginBottom: 10 }}>🥡</div><div style={{ fontSize: 14 }}>Giỏ hàng đang trống.</div></div>
                )}
              </div>
              {cartItems.length > 0 && (
                <Footer error={error}>
                  <button onClick={confirmOrder} disabled={!canOrder || submitting} style={bigBtn(canOrder, submitting)}>{submitting ? "Đang gửi…" : canOrder ? "Đặt món" : "Vui lòng điền thông tin"}</button>
                </Footer>
              )}
            </div>
          )}

          {/* SUCCESS */}
          {screen === "success" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "54px 28px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#C05000,#8A3800)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(192,80,0,0.55)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 27, fontWeight: 900, marginTop: 24, lineHeight: 1.15, animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>{successType === "reserve" ? "Bàn đã được đặt" : "Đơn đã ghi nhận"}</div>
              <div style={{ fontSize: 14.5, color: "#C9B49E", marginTop: 9, lineHeight: 1.6, maxWidth: 290, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>{successType === "reserve" ? "Quán sẽ gọi xác nhận đặt bàn trong vòng 15 phút. Hẹn gặp bạn tại Bếp Biển! 🍽️" : "Bếp đang chuẩn bị món của bạn · thời gian dự kiến ~30 phút. Cảm ơn bạn đã đặt món! 🥡"}</div>
              <div style={{ marginTop: 26, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,80,0,0.18)", borderRadius: 14, padding: 18, textAlign: "left", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                {successRows.map(([label, value], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "baseline", marginBottom: i < successRows.length - 1 ? 12 : 0 }}><span style={{ fontSize: 12.5, color: "#A98B6E" }}>{label}</span><span style={{ fontSize: 13, fontWeight: 800, color: "#F7ECE0", textAlign: "right" }}>{value}</span></div>
                ))}
              </div>
              <button onClick={home} style={{ marginTop: 24, width: "100%", height: 52, background: "#C05000", border: "none", borderRadius: 13, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(192,80,0,0.45)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both" }}>Về trang chủ</button>
              <Link href="/" style={{ marginTop: 16, fontSize: 12.5, color: "#A98B6E", fontFamily: SANS }}>← Về trang chủ zeebee.vn</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#1A0F00", padding: "54px 20px 13px", display: "flex", alignItems: "center", gap: 13, borderBottom: "1px solid rgba(192,80,0,0.15)" }}>
      <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(192,80,0,0.25)", background: "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#F7ECE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div style={{ fontSize: 20, fontWeight: 900 }}>{title}</div>
    </div>
  );
}
function Footer({ children, error }: { children: React.ReactNode; error: string }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#1A0F00 74%,rgba(26,15,0,0))", zIndex: 40 }}>
      {error && <div style={{ textAlign: "center", color: "#FF8A5B", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{error}</div>}
      {children}
    </div>
  );
}
function DField({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; inputMode?: "numeric" }) {
  return (<div><label style={{ fontSize: 12, color: "#C9B49E", fontWeight: 600, display: "block", marginBottom: 5 }}>{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} inputMode={inputMode} placeholder={placeholder} style={darkInputField} /></div>);
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#1A0F00", boxShadow: "0 20px 60px rgba(17,24,39,0.28)" };
const uplabel: CSSProperties = { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 800, color: "#A98B6E" };
const stepBtn: CSSProperties = { width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(192,80,0,0.3)", background: "transparent", color: "#F7ECE0", fontSize: 20, cursor: "pointer" };
const darkInputField: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(192,80,0,0.2)", background: "rgba(255,255,255,0.04)", borderRadius: 11, padding: "12px 13px", fontSize: 14, color: "#F7ECE0", fontFamily: SANS };
const darkInput: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(192,80,0,0.2)", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#F7ECE0", fontFamily: SANS };
function modeStyle(on: boolean): CSSProperties { return { flex: 1, border: "none", borderRadius: 10, padding: 10, fontSize: 13.5, fontWeight: 800, cursor: "pointer", background: on ? "#C05000" : "transparent", color: on ? "#fff" : "#A98B6E", boxShadow: on ? "0 4px 14px rgba(192,80,0,0.4)" : "none", fontFamily: SANS }; }
function bigBtn(enabled: boolean, busy: boolean): CSSProperties { return { width: "100%", height: 54, border: "none", borderRadius: 15, fontSize: 16, fontWeight: 800, cursor: enabled && !busy ? "pointer" : "not-allowed", color: "#fff", background: enabled ? "#C05000" : "#4A3420", boxShadow: enabled ? "0 8px 26px rgba(192,80,0,0.5)" : "none", fontFamily: SANS }; }

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
@keyframes dcPulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
