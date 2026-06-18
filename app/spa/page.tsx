"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

const SER = "var(--font-cormorant), serif";
const SANS = "var(--font-dm-sans), sans-serif";
const WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const CATS = [
  { id: "all", label: "Tất cả", icon: "🌿" },
  { id: "nail", label: "Nail", icon: "💅" },
  { id: "hair", label: "Tóc", icon: "✂️" },
  { id: "skin", label: "Chăm sóc da", icon: "🧖" },
  { id: "massage", label: "Massage", icon: "💆" },
  { id: "combo", label: "Gói combo", icon: "🌸" },
];
type Service = { id: string; cat: string; name: string; duration: string; price: number; emoji: string; g: [string, string] };
const SERVICES: Service[] = [
  { id: "nail1", cat: "Nail", name: "Sơn gel nghệ thuật", duration: "60 phút", price: 250000, emoji: "💅", g: ["#F7E4E8", "#EFC9D2"] },
  { id: "hair1", cat: "Tóc", name: "Cắt · gội · tạo kiểu", duration: "75 phút", price: 320000, emoji: "✂️", g: ["#EFE7DC", "#DDCBB4"] },
  { id: "skin1", cat: "Chăm sóc da", name: "Chăm sóc da chuyên sâu", duration: "90 phút", price: 550000, emoji: "🧖", g: ["#E5EEE3", "#C9DEC4"] },
  { id: "massage1", cat: "Massage", name: "Massage thư giãn toàn thân", duration: "90 phút", price: 480000, emoji: "💆", g: ["#E6E9F0", "#C8D0E0"] },
  { id: "combo1", cat: "Gói combo", name: "Combo Tóc + Nail thư giãn", duration: "150 phút", price: 780000, emoji: "🌸", g: ["#F3E6EC", "#E2C7D6"] },
  { id: "skin2", cat: "Chăm sóc da", name: "Trị mụn · phục hồi da", duration: "80 phút", price: 420000, emoji: "🌿", g: ["#E9EFE4", "#CFE0C5"] },
];
type Staff = { id: string; name: string; role: string; rating: string; c: [string, string] };
const STAFF: Staff[] = [
  { id: "s1", name: "Mai Anh", role: "Nail Artist", rating: "5.0", c: ["#E9A0B4", "#C76C86"] },
  { id: "s2", name: "Thu Hà", role: "Stylist tóc", rating: "4.9", c: ["#C9A98E", "#A07E5F"] },
  { id: "s3", name: "Ngọc Linh", role: "Chuyên viên da", rating: "4.9", c: ["#9FC195", "#6E9462"] },
  { id: "s4", name: "Quỳnh Như", role: "Massage trị liệu", rating: "5.0", c: ["#9DAAD0", "#6E7DA8"] },
];
const SLOTS = ["9:00", "9:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00", "16:00", "17:30"];
const BOOKED: Record<string, boolean> = { "10:00": true, "11:00": true, "14:30": true, "16:00": true };

const svc = (id: string | null) => SERVICES.find((s) => s.id === id);
const staff = (id: string | null) => STAFF.find((s) => s.id === id);
const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const iso = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const dmy = (s: string) => { const p = s.split("-"); return `${("0" + p[2]).slice(-2)}/${("0" + p[1]).slice(-2)}`; };
const initial = (name: string) => name.split(" ").slice(-1)[0][0];
function avatar(c: [string, string], size: number, fs: number): CSSProperties {
  return { width: size, height: size, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SER, fontSize: fs, fontWeight: 600, color: "#fff", background: `linear-gradient(140deg, ${c[0]}, ${c[1]})`, flexShrink: 0 };
}

export default function SpaPage() {
  const [screen, setScreen] = useState<"home" | "booking" | "success">("home");
  const [cat, setCat] = useState("Tất cả");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function openBook(sid: string, stId?: string) { setServiceId(sid); setStaffId(stId || null); setDate(iso(addDays(today(), 1))); setSlot(null); setScreen("booking"); }

  const list = SERVICES.filter((s) => cat === "Tất cả" || s.cat === cat);
  const sv = svc(serviceId);
  const stf = staff(staffId);
  const scheduleText = date && slot ? `${dmy(date)} · ${slot}` : "";
  const canConfirm = !!(sv && staffId && date && slot && form.name.trim() && form.phone.trim());

  async function confirm() {
    if (!canConfirm || submitting || !sv) return;
    setSubmitting(true); setError("");
    const note = ["[Đặt lịch spa · Maison Lá]", `Dịch vụ: ${sv.name} (${sv.duration})`, `Chuyên viên: ${stf?.name || ""}`, `Thời gian: ${scheduleText}`, `Giá: ${fmt(sv.price)}`, form.note ? `Ghi chú: ${form.note}` : ""].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note, category: "spa" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");
      setOrderCode("ML" + Math.floor(10000 + Math.random() * 90000));
      setScreen("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Lỗi"); } finally { setSubmitting(false); }
  }
  function home() { setScreen("home"); setCat("Tất cả"); setServiceId(null); setStaffId(null); setDate(null); setSlot(null); setForm({ name: "", phone: "", note: "" }); }

  const inputStyle: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(58,50,44,0.14)", background: "#fff", borderRadius: 11, padding: "12px 13px", fontSize: 14, color: "#3A322C", fontFamily: SANS };

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#FDF8F5", fontFamily: SANS, color: "#3A322C", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* HOME */}
          {screen === "home" && (
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30 }} className="dc-noscroll">
              <div style={{ padding: "54px 22px 0" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C05000", fontWeight: 600, fontFamily: SANS }}>Beauty · Wellness</div>
                    <div style={{ fontFamily: SER, fontSize: 34, fontWeight: 600, lineHeight: 1.02, marginTop: 7, letterSpacing: "-0.01em" }}>Maison Lá</div>
                    <div style={{ color: "#8A7C6F", marginTop: 6, fontStyle: "italic", fontFamily: SER, fontWeight: 500, fontSize: 16 }}>Nơi vẻ đẹp được nâng niu mỗi ngày</div>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(75,111,68,0.1)", borderRadius: 100, padding: "6px 12px", flexShrink: 0, marginTop: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4B6F44", animation: "dcPulse 2s ease-in-out infinite" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#3A5635", whiteSpace: "nowrap" }}>Đang mở</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 13 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#C05000" }}>⭐ 4.9</span>
                  <span style={{ fontSize: 12.5, color: "#A89A8C" }}>· 512 lượt đánh giá · 9:00 – 20:00</span>
                </div>
              </div>

              <div style={{ padding: "20px 22px 0" }}>
                <div style={{ borderRadius: 22, overflow: "hidden", position: "relative", height: 200, background: "radial-gradient(ellipse 80% 70% at 72% 28%,rgba(192,80,0,0.16),transparent 62%),linear-gradient(150deg,#EADFD2,#E3D0CB 55%,#D8C2BE)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 22 }}>
                  <div style={{ position: "absolute", top: 26, right: 28, fontSize: 64, opacity: 0.55 }}>🌸</div>
                  <div style={{ fontFamily: SER, fontSize: 25, fontWeight: 500, fontStyle: "italic", lineHeight: 1.25, color: "#4A3F37", maxWidth: "80%" }}>“Chăm sóc bản thân là sự đầu tư đẹp nhất.”</div>
                  <button onClick={() => openBook(SERVICES[0].id)} style={{ marginTop: 16, alignSelf: "flex-start", background: "#3A322C", color: "#fff", border: "none", borderRadius: 100, padding: "12px 24px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Đặt lịch ngay</button>
                </div>
              </div>

              <div style={{ padding: "26px 22px 0" }}>
                <div style={{ fontFamily: SER, fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Dịch vụ</div>
                <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }} className="dc-noscroll">
                  {CATS.map((c) => {
                    const active = cat === c.label || (c.id === "all" && cat === "Tất cả");
                    return (
                      <button key={c.id} onClick={() => setCat(c.label)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, border: "none", background: "transparent", cursor: "pointer", padding: 0, width: 66 }}>
                        <span style={{ width: 58, height: 58, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, background: active ? "#3A322C" : "#fff", border: active ? "none" : "1px solid rgba(58,50,44,0.08)", boxShadow: active ? "0 6px 16px rgba(58,50,44,0.18)" : "none" }}>{c.icon}</span>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: active ? "#3A322C" : "#A89A8C", textAlign: "center", lineHeight: 1.2 }}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: "20px 22px 0", display: "flex", flexDirection: "column", gap: 11 }}>
                {list.map((s) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid rgba(58,50,44,0.07)", borderRadius: 16, padding: 14 }}>
                    <div style={{ width: 62, height: 62, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: `linear-gradient(145deg, ${s.g[0]}, ${s.g[1]})` }}>{s.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: SER, fontSize: 19, fontWeight: 600, lineHeight: 1.15 }}>{s.name}</div>
                      <div style={{ fontSize: 11.5, color: "#A89A8C", marginTop: 3, fontWeight: 500 }}>🕐 {s.duration} · {s.cat}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#C05000", marginTop: 7, fontFamily: SER }}>{fmt(s.price)}</div>
                    </div>
                    <button onClick={() => openBook(s.id)} style={{ background: "transparent", border: "1px solid #4B6F44", color: "#3A5635", borderRadius: 100, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0, fontFamily: SANS }}>Chọn</button>
                  </div>
                ))}
              </div>

              <div style={{ padding: "28px 22px 0" }}>
                <div style={{ fontFamily: SER, fontSize: 22, fontWeight: 600, marginBottom: 5 }}>Đội ngũ chuyên viên</div>
                <div style={{ fontSize: 12.5, color: "#A89A8C", marginBottom: 15 }}>Chọn người bạn muốn được phục vụ.</div>
                <div style={{ display: "flex", gap: 13, overflowX: "auto", paddingBottom: 4 }} className="dc-noscroll">
                  {STAFF.map((s) => (
                    <div key={s.id} style={{ width: 128, flexShrink: 0, background: "#fff", border: "1px solid rgba(58,50,44,0.07)", borderRadius: 18, padding: "16px 12px", textAlign: "center" }}>
                      <div style={{ ...avatar(s.c, 64, 26), margin: "0 auto" }}>{initial(s.name)}</div>
                      <div style={{ fontFamily: SER, fontSize: 18, fontWeight: 600, marginTop: 11, lineHeight: 1.1 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#A89A8C", marginTop: 3, fontWeight: 500 }}>{s.role}</div>
                      <div style={{ fontSize: 11, color: "#C05000", fontWeight: 600, marginTop: 5 }}>⭐ {s.rating}</div>
                      <button onClick={() => openBook(SERVICES[0].id, s.id)} style={{ marginTop: 11, width: "100%", background: "#FBF1EA", border: "none", color: "#C05000", borderRadius: 100, padding: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>Chọn</button>
                    </div>
                  ))}
                </div>
                <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 24, fontSize: 12.5, color: "#A89A8C", fontWeight: 600 }}>← Về trang chủ zeebee.vn</Link>
              </div>
            </div>
          )}

          {/* BOOKING */}
          {screen === "booking" && sv && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#FDF8F5", padding: "54px 22px 13px", display: "flex", alignItems: "center", gap: 13, borderBottom: "1px solid rgba(58,50,44,0.07)" }}>
                <button onClick={() => setScreen("home")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(58,50,44,0.14)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#3A322C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ fontFamily: SER, fontSize: 25, fontWeight: 600 }}>Đặt lịch hẹn</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px 110px" }} className="dc-noscroll">
                <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid rgba(58,50,44,0.07)", borderRadius: 16, padding: 14 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 31, background: `linear-gradient(145deg, ${sv.g[0]}, ${sv.g[1]})` }}>{sv.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: SER, fontSize: 20, fontWeight: 600, lineHeight: 1.15 }}>{sv.name}</div>
                    <div style={{ fontSize: 11.5, color: "#A89A8C", marginTop: 3, fontWeight: 500 }}>🕐 {sv.duration}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#C05000", marginTop: 6, fontFamily: SER }}>{fmt(sv.price)}</div>
                  </div>
                </div>

                <div style={{ fontFamily: SER, fontSize: 19, fontWeight: 600, margin: "22px 0 11px" }}>Chuyên viên</div>
                <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }} className="dc-noscroll">
                  {STAFF.map((s) => { const active = staffId === s.id; return (
                    <button key={s.id} onClick={() => setStaffId(s.id)} style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0, border: active ? "2px solid #4B6F44" : "1px solid rgba(58,50,44,0.1)", background: active ? "rgba(75,111,68,0.06)" : "#fff", color: "#3A322C", borderRadius: 14, padding: "9px 13px 9px 9px", cursor: "pointer" }}>
                      <span style={avatar(s.c, 34, 15)}>{initial(s.name)}</span>
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}><span style={{ fontSize: 13.5, fontWeight: 700 }}>{s.name}</span><span style={{ fontSize: 10.5, opacity: 0.7 }}>{s.role}</span></span>
                    </button>
                  ); })}
                </div>

                <div style={{ fontFamily: SER, fontSize: 19, fontWeight: 600, margin: "24px 0 11px" }}>Chọn ngày</div>
                <div style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 5 }} className="dc-noscroll">
                  {Array.from({ length: 14 }, (_, i) => { const dd = addDays(today(), i); const s = iso(dd) === date; return (
                    <button key={i} onClick={() => setDate(iso(dd))} style={{ flexShrink: 0, width: 52, height: 64, borderRadius: 16, cursor: "pointer", padding: "9px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: s ? "none" : "1px solid rgba(58,50,44,0.1)", background: s ? "#3A322C" : "#fff", boxShadow: s ? "0 6px 16px rgba(58,50,44,0.2)" : "none" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: s ? "rgba(255,255,255,0.8)" : "#A89A8C" }}>{WD[dd.getDay()]}</span>
                      <span style={{ fontFamily: SER, fontSize: 20, fontWeight: 600, color: s ? "#fff" : "#3A322C", lineHeight: 1 }}>{dd.getDate()}</span>
                    </button>
                  ); })}
                </div>

                <div style={{ fontFamily: SER, fontSize: 19, fontWeight: 600, margin: "24px 0 11px" }}>Giờ trống</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
                  {SLOTS.map((t) => { const booked = !!BOOKED[t]; const active = slot === t; return (
                    <button key={t} onClick={() => { if (!booked) setSlot(t); }} disabled={booked} style={{ padding: "13px 6px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, cursor: booked ? "default" : "pointer", fontFamily: SANS, border: active ? "none" : booked ? "none" : "1px solid rgba(58,50,44,0.14)", background: active ? "#4B6F44" : booked ? "#F0E9E3" : "#fff", color: active ? "#fff" : booked ? "#C3B4A8" : "#3A322C", textDecoration: booked ? "line-through" : "none", boxShadow: active ? "0 5px 13px rgba(75,111,68,0.3)" : "none" }}>{t}</button>
                  ); })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 13 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#A89A8C" }}><span style={{ width: 11, height: 11, borderRadius: 3, border: "1px solid rgba(58,50,44,0.18)", background: "#fff" }} />Còn trống</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#A89A8C" }}><span style={{ width: 11, height: 11, borderRadius: 3, background: "#F0E9E3" }} />Đã đặt</span>
                </div>

                <div style={{ fontFamily: SER, fontSize: 19, fontWeight: 600, margin: "24px 0 11px" }}>Thông tin của bạn</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <div><label style={sl}>Họ và tên</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="VD: Lý Thuỳ Dương" style={inputStyle} /></div>
                  <div><label style={sl}>Số điện thoại</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} inputMode="numeric" placeholder="VD: 0913 456 789" style={inputStyle} /></div>
                  <div><label style={sl}>Ghi chú <span style={{ color: "#C3B4A8" }}>(không bắt buộc)</span></label><textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} placeholder="VD: mong muốn kiểu nhẹ nhàng · có thai 5 tháng…" style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} /></div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 22px 30px", background: "linear-gradient(to top,#FDF8F5 74%,rgba(253,248,245,0))", zIndex: 40 }}>
                {error && <div style={{ textAlign: "center", color: "#B91C1C", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{error}</div>}
                <button onClick={confirm} disabled={!canConfirm || submitting} style={{ width: "100%", height: 54, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: canConfirm && !submitting ? "pointer" : "not-allowed", color: "#fff", background: canConfirm ? "#3A322C" : "#CDBFB2", boxShadow: canConfirm ? "0 8px 22px rgba(58,50,44,0.22)" : "none", fontFamily: SANS }}>{submitting ? "Đang gửi…" : canConfirm ? "Xác nhận lịch hẹn" : "Vui lòng chọn đủ thông tin"}</button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {screen === "success" && sv && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "54px 30px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#4B6F44,#3A5635)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(75,111,68,0.28)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontFamily: SER, fontSize: 31, fontWeight: 600, marginTop: 24, lineHeight: 1.1, letterSpacing: "-0.01em", animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Lịch hẹn đã được đặt</div>
              <div style={{ fontSize: 14, color: "#8A7C6F", marginTop: 10, lineHeight: 1.6, maxWidth: 290, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Maison Lá sẽ xác nhận lịch hẹn của bạn trong vòng <strong style={{ color: "#C05000" }}>15 phút</strong>. Hẹn gặp bạn! 🌸</div>
              <div style={{ marginTop: 26, width: "100%", background: "#fff", border: "1px solid rgba(58,50,44,0.08)", borderRadius: 16, padding: 18, textAlign: "left", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#A89A8C", marginBottom: 11 }}><span>Mã lịch hẹn</span><span style={{ fontWeight: 700, color: "#3A322C", fontVariantNumeric: "tabular-nums", fontFamily: SANS }}>{orderCode}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#A89A8C", marginBottom: 11 }}><span>Dịch vụ</span><span style={{ fontWeight: 600, color: "#3A322C", textAlign: "right", maxWidth: 190 }}>{sv.name}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#A89A8C", marginBottom: 11 }}><span>Chuyên viên</span><span style={{ fontWeight: 600, color: "#3A322C" }}>{stf?.name || ""}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#A89A8C" }}><span>Thời gian</span><span style={{ fontWeight: 600, color: "#3A322C" }}>{scheduleText}</span></div>
              </div>
              <button onClick={home} style={{ marginTop: 24, width: "100%", height: 52, background: "#3A322C", border: "none", borderRadius: 13, color: "#fff", fontSize: 14.5, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 22px rgba(58,50,44,0.2)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both", fontFamily: SANS }}>Về trang chủ</button>
              <Link href="/" style={{ marginTop: 16, fontSize: 12.5, color: "#A89A8C", fontFamily: SANS }}>← Về trang chủ zeebee.vn</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#FDF8F5", boxShadow: "0 20px 60px rgba(58,50,44,0.18)" };
const sl: CSSProperties = { fontSize: 12, color: "#8A7C6F", fontWeight: 600, display: "block", marginBottom: 5 };

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
@keyframes dcPulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
