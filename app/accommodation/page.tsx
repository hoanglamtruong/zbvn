"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";

const SANS = "var(--font-raleway), sans-serif";
const WD = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const WDFULL = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const FEE = 80000;

type Room = { id: string; name: string; cap: string; price: number; available: number; emoji: string; g: [string, string]; amenities: { icon: string; label: string }[] };
const ROOMS: Room[] = [
  { id: "deluxe", name: "Deluxe hướng biển", cap: "2 khách · 1 giường đôi", price: 850000, available: 3, emoji: "🛏️", g: ["#6E9263", "#3E5A37"], amenities: [{ icon: "🌅", label: "View biển" }, { icon: "❄️", label: "Máy lạnh" }, { icon: "📶", label: "WiFi" }] },
  { id: "bungalow", name: "Bungalow vườn", cap: "2 khách · sân riêng", price: 1200000, available: 2, emoji: "🏡", g: ["#7E9B73", "#4A6840"], amenities: [{ icon: "🌿", label: "Vườn riêng" }, { icon: "🍳", label: "Bếp nhỏ" }, { icon: "📶", label: "WiFi" }] },
  { id: "family", name: "Phòng Family", cap: "4 khách · 2 giường", price: 1500000, available: 1, emoji: "🛌", g: ["#6B8F7E", "#3C5A4C"], amenities: [{ icon: "❄️", label: "Máy lạnh" }, { icon: "🛁", label: "Bồn tắm" }, { icon: "📶", label: "WiFi" }] },
  { id: "studio", name: "Studio đôi", cap: "2 khách · ban công", price: 700000, available: 5, emoji: "🚪", g: ["#8A9B6E", "#586B3C"], amenities: [{ icon: "☕", label: "Pha cà phê" }, { icon: "❄️", label: "Máy lạnh" }, { icon: "📶", label: "WiFi" }] },
  { id: "villa", name: "Villa 2 phòng ngủ", cap: "6 khách · hồ bơi riêng", price: 2800000, available: 1, emoji: "🏖️", g: ["#5E8F8A", "#36605B"], amenities: [{ icon: "🏊", label: "Hồ bơi" }, { icon: "🍳", label: "Bếp đầy đủ" }, { icon: "🅿️", label: "Bãi xe" }] },
];
const AMENITIES = [
  { icon: "🏊", label: "Hồ bơi vô cực" }, { icon: "🅿️", label: "Bãi đỗ xe" }, { icon: "🍳", label: "Bếp chung" }, { icon: "📶", label: "WiFi miễn phí" },
  { icon: "🍽️", label: "Nhà hàng" }, { icon: "🌅", label: "View biển" }, { icon: "🛎️", label: "Lễ tân 24h" }, { icon: "🚲", label: "Thuê xe đạp" },
];

const room = (id: string | null) => ROOMS.find((r) => r.id === id);
const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";
const startToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const dt = (i: string) => { const p = i.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
const iso = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const label = (i: string | null) => { if (!i) return null; const d = dt(i); return `${WDFULL[d.getDay()]}, ${("0" + d.getDate()).slice(-2)}/${("0" + (d.getMonth() + 1)).slice(-2)}`; };

export default function AccommodationPage() {
  const [screen, setScreen] = useState<"home" | "booking" | "success">("home");
  const [checkin, setCheckin] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [calOpen, setCalOpen] = useState(false);
  const [viewY, setViewY] = useState<number | null>(null);
  const [viewM, setViewM] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", request: "" });
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = startToday();
    setCheckin(iso(t)); setCheckout(iso(addDays(t, 2))); setViewY(t.getFullYear()); setViewM(t.getMonth());
  }, []);

  const nights = checkin && checkout ? Math.round((dt(checkout).getTime() - dt(checkin).getTime()) / 86400000) : 0;

  function pickDay(i: string) {
    if (!checkin || (checkin && checkout)) { setCheckin(i); setCheckout(null); return; }
    const d = dt(i), ci = dt(checkin);
    if (d > ci) setCheckout(i); else { setCheckin(i); setCheckout(null); }
  }

  const t = startToday();
  const vY = viewY ?? t.getFullYear();
  const vM = viewM ?? t.getMonth();
  const first = new Date(vY, vM, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(vY, vM + 1, 0).getDate();
  const cells: ({ blank: true } | { day: number; iso: string; disabled: boolean })[] = [];
  for (let i = 0; i < offset; i++) cells.push({ blank: true });
  for (let dd = 1; dd <= daysInMonth; dd++) { const d = new Date(vY, vM, dd); d.setHours(0, 0, 0, 0); cells.push({ day: dd, iso: iso(d), disabled: d < t }); }
  const monthTitle = `Tháng ${vM + 1}, ${vY}`;
  const atCurrentMonth = vY === t.getFullYear() && vM === t.getMonth();

  const r = room(roomId);
  const subtotal = r ? r.price * nights : 0;
  const total = subtotal + FEE;
  const rangeText = `${label(checkin) || ""} → ${label(checkout) || ""}`;
  const canConfirm = !!(r && checkin && checkout && nights > 0 && form.name.trim() && form.phone.trim());

  async function confirm() {
    if (!canConfirm || submitting || !r) return;
    setSubmitting(true); setError("");
    const note = ["[Đặt phòng · An Nhiên Retreat]", `Phòng: ${r.name}`, `${nights} đêm · ${guests} khách`, rangeText, `Tổng: ${fmt(total)}`, form.request ? `Yêu cầu: ${form.request}` : ""].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note, category: "accommodation" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");
      setOrderCode("AN" + Math.floor(10000 + Math.random() * 90000));
      setScreen("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Lỗi"); } finally { setSubmitting(false); }
  }
  function home() { setScreen("home"); setRoomId(null); setForm({ name: "", phone: "", request: "" }); setCalOpen(false); }

  const dateValStyle = (has: boolean): CSSProperties => ({ fontSize: 15, fontWeight: 700, marginTop: 3, color: has ? "#243524" : "#A7B6A4" });
  const guestCtrl = (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <button onClick={() => setGuests((g) => Math.max(1, g - 1))} style={guestBtn}>−</button>
      <span style={{ minWidth: 26, textAlign: "center", fontSize: 15, fontWeight: 700 }}>{guests}</span>
      <button onClick={() => setGuests((g) => Math.min(12, g + 1))} style={guestBtn}>+</button>
    </div>
  );

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#F7FBF7", fontFamily: SANS, color: "#243524", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* HOME */}
          {screen === "home" && (
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30 }} className="dc-noscroll">
              {/* hero */}
              <div style={{ position: "relative", height: 340, background: "radial-gradient(ellipse 90% 70% at 70% 20%,rgba(184,134,11,0.22),transparent 60%),linear-gradient(165deg,#6E9263,#3E5A37 70%,#2E4429)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 28px", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 64, right: 26, fontSize: 90, opacity: 0.9, filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.25))" }}>🌅</div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top,rgba(20,32,18,0.7),transparent)" }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.16)", border: "0.5px solid rgba(255,255,255,0.28)", borderRadius: 100, padding: "5px 13px", fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>📍 Long Hải · Vũng Tàu</div>
                  <div style={{ fontSize: 34, fontWeight: 700, color: "#fff", lineHeight: 1.05, marginTop: 13, letterSpacing: "-0.01em" }}>An Nhiên Retreat</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", marginTop: 7, fontWeight: 300, fontStyle: "italic" }}>Nghỉ dưỡng yên bình bên biển Long Hải</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 11 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(184,134,11,0.92)", borderRadius: 8, padding: "4px 9px", fontSize: 12, fontWeight: 700, color: "#fff" }}>⭐ 4.9</span>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.82)", fontWeight: 400 }}>326 đánh giá · Hạng sang</span>
                  </div>
                </div>
              </div>

              {/* search card */}
              <div style={{ margin: "-26px 18px 0", position: "relative", zIndex: 5, background: "#fff", border: "1px solid rgba(75,111,68,0.12)", borderRadius: 18, padding: 6, boxShadow: "0 14px 34px rgba(46,68,41,0.12)" }}>
                <div style={{ display: "flex" }}>
                  <button onClick={() => setCalOpen((c) => !c)} style={{ flex: 1, textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "13px 14px" }}>
                    <div style={capLabel}>Nhận phòng</div><div style={dateValStyle(!!checkin)}>{label(checkin) || "Chọn ngày"}</div>
                  </button>
                  <div style={{ width: 1, background: "rgba(75,111,68,0.12)", margin: "10px 0" }} />
                  <button onClick={() => setCalOpen((c) => !c)} style={{ flex: 1, textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "13px 14px" }}>
                    <div style={capLabel}>Trả phòng</div><div style={dateValStyle(!!checkout)}>{label(checkout) || "Chọn ngày"}</div>
                  </button>
                </div>
                <div style={{ borderTop: "1px solid rgba(75,111,68,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px" }}>
                  <div><div style={capLabel}>Số khách</div><div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{guests} khách</div></div>
                  {guestCtrl}
                </div>

                {calOpen && (
                  <div style={{ borderTop: "1px solid rgba(75,111,68,0.1)", padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <button onClick={() => { if (atCurrentMonth) return; const m = vM - 1; if (m < 0) { setViewY(vY - 1); setViewM(11); } else setViewM(m); }} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(75,111,68,0.2)", background: "transparent", cursor: atCurrentMonth ? "default" : "pointer", color: atCurrentMonth ? "#CBD6C7" : "#3E5A37", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{monthTitle}</span>
                      <button onClick={() => { const m = vM + 1; if (m > 11) { setViewY(vY + 1); setViewM(0); } else setViewM(m); }} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(75,111,68,0.2)", background: "transparent", color: "#3E5A37", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
                      {WD.map((w) => <div key={w} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: "#94A88F", padding: "4px 0" }}>{w}</div>)}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px 0" }}>
                      {cells.map((c, i) => {
                        if ("blank" in c) return <div key={i} />;
                        const isCi = c.iso === checkin, isCo = c.iso === checkout;
                        const inRange = checkin && checkout && dt(c.iso) > dt(checkin) && dt(c.iso) < dt(checkout);
                        const endpoint = isCi || isCo;
                        const wrapBg = inRange ? "rgba(75,111,68,0.1)" : isCi && checkout ? "linear-gradient(to right, transparent 50%, rgba(75,111,68,0.1) 50%)" : isCo ? "linear-gradient(to left, transparent 50%, rgba(75,111,68,0.1) 50%)" : "transparent";
                        return (
                          <div key={i} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 40, background: wrapBg }}>
                            <button onClick={() => !c.disabled && pickDay(c.iso)} disabled={c.disabled} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", cursor: c.disabled ? "default" : "pointer", fontSize: 13.5, fontWeight: endpoint ? 700 : 500, background: endpoint ? "#4B6F44" : "transparent", color: c.disabled ? "#CBD6C7" : endpoint ? "#fff" : "#243524", boxShadow: endpoint ? "0 4px 10px rgba(75,111,68,0.35)" : "none", fontFamily: SANS }}>{c.day}</button>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 13 }}>
                      <span style={{ fontSize: 13, color: "#5A6E55", fontWeight: 500 }}>{nights > 0 ? `${nights} đêm đã chọn` : "Chọn ngày trả phòng"}</span>
                      <button onClick={() => setCalOpen(false)} style={{ background: "#4B6F44", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>Áp dụng</button>
                    </div>
                  </div>
                )}
              </div>

              {/* rooms */}
              <div style={{ padding: "24px 18px 0" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>Phòng & Unit</div>
                  <span style={{ fontSize: 12.5, color: "#94A88F", fontWeight: 500 }}>{ROOMS.length} loại phòng</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {ROOMS.map((rm) => (
                    <div key={rm.id} style={{ background: "#fff", border: "1px solid rgba(75,111,68,0.1)", borderRadius: 18, overflow: "hidden", boxShadow: "0 6px 18px rgba(46,68,41,0.05)" }}>
                      <div style={{ position: "relative", height: 150, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse 80% 70% at 70% 25%, rgba(184,134,11,0.18), transparent 60%), linear-gradient(150deg, ${rm.g[0]}, ${rm.g[1]})` }}>
                        <span style={{ fontSize: 64, filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.18))" }}>{rm.emoji}</span>
                        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.92)", color: "#3E5A37", fontSize: 11, fontWeight: 700, padding: "5px 11px", borderRadius: 100 }}>Còn {rm.available} phòng</div>
                        <div style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.5 6 4.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.4 0 4.7 3.5 3.2 6.5C19 15.4 12 20 12 20z" stroke="#B8860B" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                      <div style={{ padding: "15px 17px 17px" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{rm.name}</div>
                        <div style={{ fontSize: 12.5, color: "#7A8C76", marginTop: 5, fontWeight: 500 }}>{rm.cap}</div>
                        <div style={{ display: "flex", gap: 14, marginTop: 11 }}>
                          {rm.amenities.map((a, i) => <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#5A6E55", fontWeight: 500 }}><span style={{ fontSize: 14 }}>{a.icon}</span>{a.label}</span>)}
                        </div>
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(75,111,68,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ lineHeight: 1 }}><span style={{ fontSize: 20, fontWeight: 800, color: "#243524" }}>{fmt(rm.price)}</span><span style={{ fontSize: 12.5, color: "#94A88F", fontWeight: 500 }}> / đêm</span></div>
                          <button onClick={() => { setRoomId(rm.id); setCalOpen(false); setScreen("booking"); }} style={{ background: "#4B6F44", color: "#fff", border: "none", borderRadius: 11, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 5px 14px rgba(75,111,68,0.28)", fontFamily: SANS }}>Đặt ngay</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* amenities */}
              <div style={{ padding: "26px 18px 0" }}>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.01em" }}>Tiện nghi cơ sở</div>
                <div style={{ background: "#fff", border: "1px solid rgba(75,111,68,0.1)", borderRadius: 18, padding: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  {AMENITIES.map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 12px" }}>
                      <span style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(75,111,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{a.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#3A4D37" }}>{a.label}</span>
                    </div>
                  ))}
                </div>
                <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 22, fontSize: 12.5, color: "#7A8C76", fontWeight: 600 }}>← Về trang chủ zeebee.vn</Link>
              </div>
            </div>
          )}

          {/* BOOKING */}
          {screen === "booking" && r && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#F7FBF7", padding: "54px 20px 13px", display: "flex", alignItems: "center", gap: 13, borderBottom: "1px solid rgba(75,111,68,0.1)" }}>
                <button onClick={() => setScreen("home")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(75,111,68,0.2)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#243524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Đặt phòng</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 110px" }} className="dc-noscroll">
                <div style={{ display: "flex", gap: 14, background: "#fff", border: "1px solid rgba(75,111,68,0.1)", borderRadius: 16, padding: 13 }}>
                  <div style={{ width: 88, height: 88, borderRadius: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: `radial-gradient(ellipse 80% 70% at 70% 25%, rgba(184,134,11,0.2), transparent 60%), linear-gradient(150deg, ${r.g[0]}, ${r.g[1]})` }}>{r.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#7A8C76", marginTop: 4, fontWeight: 500 }}>{r.cap}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#243524", marginTop: 9 }}>{fmt(r.price)} <span style={{ fontSize: 11.5, color: "#94A88F", fontWeight: 500 }}>/ đêm</span></div>
                  </div>
                </div>

                <div style={{ marginTop: 14, background: "#fff", border: "1px solid rgba(75,111,68,0.1)", borderRadius: 16, overflow: "hidden" }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, padding: "14px 16px" }}><div style={capLabel}>Nhận phòng</div><div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{label(checkin) || "—"}</div><div style={{ fontSize: 11.5, color: "#94A88F", marginTop: 2 }}>từ 14:00</div></div>
                    <div style={{ width: 1, background: "rgba(75,111,68,0.1)" }} />
                    <div style={{ flex: 1, padding: "14px 16px" }}><div style={capLabel}>Trả phòng</div><div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{label(checkout) || "—"}</div><div style={{ fontSize: 11.5, color: "#94A88F", marginTop: 2 }}>trước 12:00</div></div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(75,111,68,0.1)", padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(75,111,68,0.03)" }}>
                    <span style={{ fontSize: 13, color: "#5A6E55", fontWeight: 600 }}>{nights} đêm · {guests} khách</span>
                    <button onClick={() => setScreen("home")} style={{ fontSize: 12, color: "#4B6F44", fontWeight: 700, border: "none", background: "transparent", cursor: "pointer", padding: 0, fontFamily: SANS }}>Đổi ngày</button>
                  </div>
                </div>

                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "#94A88F", margin: "22px 0 11px" }}>Thông tin người đặt</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <AField label="Họ và tên" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="VD: Nguyễn Thanh Hà" />
                  <AField label="Số điện thoại" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="VD: 0909 012 345" inputMode="numeric" />
                  <div><label style={aLabel}>Số khách</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, border: "1px solid rgba(75,111,68,0.18)", background: "#fff", borderRadius: 11, padding: "9px 14px", width: "fit-content" }}>
                      <button onClick={() => setGuests((g) => Math.max(1, g - 1))} style={guestBtn}>−</button>
                      <span style={{ minWidth: 50, textAlign: "center", fontSize: 16, fontWeight: 700 }}>{guests} người</span>
                      <button onClick={() => setGuests((g) => Math.min(12, g + 1))} style={guestBtn}>+</button>
                    </div>
                  </div>
                  <div><label style={aLabel}>Yêu cầu đặc biệt <span style={{ color: "#A7B6A4" }}>(không bắt buộc)</span></label>
                    <textarea value={form.request} onChange={(e) => setForm((f) => ({ ...f, request: e.target.value }))} rows={2} placeholder="VD: phòng tầng cao · giường phụ · nhận phòng sớm…" style={{ ...aInput, resize: "none", lineHeight: 1.5 }} /></div>
                </div>

                <div style={{ marginTop: 18, background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 14, padding: "14px 15px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#8A6608", marginBottom: 9 }}>Chính sách phòng</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {["Hủy miễn phí trước 3 ngày nhận phòng.", "Nhận phòng từ 14:00 · trả phòng trước 12:00.", "Thanh toán khi nhận phòng · giữ chỗ miễn phí."].map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, color: "#5A6E55", fontWeight: 500, lineHeight: 1.4 }}><span style={{ color: "#B8860B" }}>✓</span>{p}</div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 18, background: "#fff", border: "1px solid rgba(75,111,68,0.1)", borderRadius: 16, padding: "15px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "#5A6E55", fontWeight: 500, marginBottom: 8 }}><span>{fmt(r.price)} × {nights} đêm</span><span style={{ color: "#243524", fontWeight: 600 }}>{fmt(subtotal)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "#5A6E55", fontWeight: 500, paddingBottom: 11, borderBottom: "1px solid rgba(75,111,68,0.1)" }}><span>Phí dịch vụ</span><span style={{ color: "#243524", fontWeight: 600 }}>{fmt(FEE)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 11 }}><span style={{ fontSize: 14.5, fontWeight: 700 }}>Tổng cộng</span><span style={{ fontSize: 24, fontWeight: 800, color: "#243524" }}>{fmt(total)}</span></div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#F7FBF7 74%,rgba(247,251,247,0))", zIndex: 40 }}>
                {error && <div style={{ textAlign: "center", color: "#B91C1C", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{error}</div>}
                <button onClick={confirm} disabled={!canConfirm || submitting} style={{ width: "100%", height: 54, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: canConfirm && !submitting ? "pointer" : "not-allowed", color: "#fff", background: canConfirm ? "#4B6F44" : "#B7C7B3", boxShadow: canConfirm ? "0 8px 24px rgba(75,111,68,0.32)" : "none", fontFamily: SANS }}>{submitting ? "Đang gửi…" : canConfirm ? "Xác nhận đặt phòng" : "Vui lòng điền thông tin"}</button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {screen === "success" && r && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "54px 28px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#4B6F44,#3A5635)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(75,111,68,0.3)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, marginTop: 24, lineHeight: 1.15, letterSpacing: "-0.01em", animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Booking đã ghi nhận</div>
              <div style={{ fontSize: 14.5, color: "#5A6E55", marginTop: 9, lineHeight: 1.6, maxWidth: 290, fontWeight: 400, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Chủ cơ sở sẽ xác nhận đặt phòng của bạn trong vòng <strong style={{ color: "#B8860B" }}>2 giờ</strong>. Hẹn gặp bạn tại An Nhiên Retreat! 🌿</div>
              <div style={{ marginTop: 26, width: "100%", background: "#fff", border: "1px solid rgba(75,111,68,0.12)", borderRadius: 16, padding: 18, textAlign: "left", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#94A88F", marginBottom: 11 }}><span>Mã booking</span><span style={{ fontWeight: 700, color: "#243524", fontVariantNumeric: "tabular-nums" }}>{orderCode}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#94A88F", marginBottom: 11 }}><span>Phòng</span><span style={{ fontWeight: 600, color: "#243524", textAlign: "right", maxWidth: 200 }}>{r.name}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#94A88F", marginBottom: 11 }}><span>Ngày ở</span><span style={{ fontWeight: 600, color: "#243524", textAlign: "right" }}>{rangeText}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "1px solid rgba(75,111,68,0.1)" }}><span style={{ fontSize: 13, fontWeight: 700 }}>Tổng cộng</span><span style={{ fontSize: 22, fontWeight: 800, color: "#243524" }}>{fmt(total)}</span></div>
              </div>
              <button onClick={home} style={{ marginTop: 24, width: "100%", height: 52, background: "#4B6F44", border: "none", borderRadius: 13, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 22px rgba(75,111,68,0.3)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both", fontFamily: SANS }}>Về trang chủ</button>
              <Link href="/" style={{ marginTop: 16, fontSize: 12.5, color: "#7A8C76", fontFamily: SANS }}>← Về trang chủ zeebee.vn</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AField({ label: lb, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; inputMode?: "numeric" }) {
  return (<div><label style={aLabel}>{lb}</label><input value={value} onChange={(e) => onChange(e.target.value)} inputMode={inputMode} placeholder={placeholder} style={aInput} /></div>);
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#F7FBF7", boxShadow: "0 20px 60px rgba(17,24,39,0.18)" };
const capLabel: CSSProperties = { fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A88F", fontWeight: 600 };
const aLabel: CSSProperties = { fontSize: 12, color: "#5A6E55", fontWeight: 600, display: "block", marginBottom: 5 };
const aInput: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(75,111,68,0.18)", background: "#fff", borderRadius: 11, padding: "12px 13px", fontSize: 14, color: "#243524", fontFamily: SANS };
const guestBtn: CSSProperties = { width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(75,111,68,0.25)", background: "transparent", color: "#3E5A37", fontSize: 18, cursor: "pointer" };

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
