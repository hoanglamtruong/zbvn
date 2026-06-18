"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";

const SANS = "var(--font-dm-sans), sans-serif";
const WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

type Service = { id: string; label: string; emoji: string; from: number; tint: string };
const SERVICES: Service[] = [
  { id: "dien", label: "Sửa chữa điện", emoji: "🔧", from: 100000, tint: "rgba(245,158,11,0.12)" },
  { id: "nuoc", label: "Sửa ống nước", emoji: "🪛", from: 120000, tint: "rgba(14,165,233,0.12)" },
  { id: "dieuhoa", label: "Vệ sinh điều hòa", emoji: "❄️", from: 150000, tint: "rgba(29,78,216,0.1)" },
  { id: "khoa", label: "Sửa & thay khóa", emoji: "🔐", from: 80000, tint: "rgba(100,116,139,0.14)" },
  { id: "cua", label: "Sửa cửa · bản lề", emoji: "🪟", from: 100000, tint: "rgba(75,111,68,0.12)" },
  { id: "vesinh", label: "Vệ sinh nhà", emoji: "🧹", from: 200000, tint: "rgba(168,85,247,0.12)" },
];
const CAT_LABELS: Record<string, string> = { dien: "Điện", nuoc: "Nước", dieuhoa: "Điều hòa", khoa: "Khóa", cua: "Cửa", vesinh: "Vệ sinh" };
const SLOTS = [
  { id: "morning", label: "Sáng", time: "8:00–12:00", icon: "🌤️" },
  { id: "afternoon", label: "Chiều", time: "12:00–17:00", icon: "☀️" },
  { id: "evening", label: "Tối", time: "17:00–20:00", icon: "🌙" },
];
const RECENT = [
  { code: "HS24788", service: "Vệ sinh điều hòa", emoji: "❄️", date: "14/06", tint: "rgba(29,78,216,0.1)", status: "done" },
  { code: "HS24791", service: "Sửa ống nước", emoji: "🪛", date: "15/06", tint: "rgba(14,165,233,0.12)", status: "progress" },
  { code: "HS24802", service: "Sửa chữa điện", emoji: "🔧", date: "16/06", tint: "rgba(245,158,11,0.12)", status: "done" },
];

const svc = (id: string | null) => SERVICES.find((s) => s.id === id);
const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const iso = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const dmy = (s: string) => { const p = s.split("-"); return `${("0" + p[2]).slice(-2)}/${("0" + p[1]).slice(-2)}`; };

type TrackInfo = { code: string; service: string; emoji: string; tint: string; address: string; stage: number; badge: { t: string; c: string; bg: string }; tech: string; techRating: string };

export default function ServicesPage() {
  const [tab, setTab] = useState<"home" | "book" | "track">("home");
  const [view, setView] = useState<null | "success">(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [photos, setPhotos] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [lastCode, setLastCode] = useState("");
  const [trackInput, setTrackInput] = useState("");
  const [trackResult, setTrackResult] = useState<TrackInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sel = svc(serviceId);
  const scheduleText = date && slot ? `${dmy(date)} · ${SLOTS.find((x) => x.id === slot)?.label || ""}` : "";
  const canBook = !!(serviceId && date && slot && form.name.trim() && form.phone.trim() && form.address.trim());

  function resolveTrack(code: string): TrackInfo | null {
    const c = (code || "").trim();
    if (!c) return null;
    let stage = 1, s = svc("dieuhoa")!, addr = "24 Lê Hồng Phong, Vũng Tàu";
    if (c === lastCode) { stage = 0; s = svc(serviceId) || s; addr = form.address || addr; }
    else { const n = parseInt(c.replace(/\D/g, "").slice(-1) || "1", 10); stage = n % 3; }
    const techs = ["Anh Tuấn", "Anh Khoa", "Anh Dũng"];
    return {
      code: c.toUpperCase(), service: s.label, emoji: s.emoji, tint: s.tint, address: addr, stage,
      badge: stage === 0 ? { t: "Đã nhận", c: "#1D4ED8", bg: "rgba(29,78,216,0.1)" } : stage === 1 ? { t: "Đang xử lý", c: "#B45309", bg: "rgba(245,158,11,0.14)" } : { t: "Hoàn thành", c: "#3A5635", bg: "rgba(75,111,68,0.14)" },
      tech: techs[c.length % techs.length], techRating: "4.9",
    };
  }

  async function submitBooking() {
    if (!canBook || submitting || !sel) return;
    setSubmitting(true); setError("");
    const note = ["[Yêu cầu báo giá · Thợ Nhà Việt]", `Dịch vụ: ${sel.label}`, `Lịch hẹn: ${scheduleText}`, desc ? `Mô tả: ${desc}` : "", `Địa chỉ: ${form.address}`].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note, category: "services" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");
      setLastCode("HS" + Math.floor(10000 + Math.random() * 90000));
      setView("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Lỗi"); } finally { setSubmitting(false); }
  }
  function goHome() { setView(null); setTab("home"); setServiceId(null); setDesc(""); setPhotos(0); setDate(null); setSlot(null); setForm({ name: "", phone: "", address: "" }); }

  const steps = (stage: number) => {
    const defs = [
      { title: "Đã nhận yêu cầu", detail: "Đơn được ghi nhận · chờ thợ báo giá", d: "Hôm nay · 09:12" },
      { title: "Đang xử lý", detail: "Thợ đã nhận · đang trên đường đến", d: "Dự kiến hôm nay · 14:00" },
      { title: "Hoàn thành", detail: "Công việc xong · đã bảo hành", d: "Chờ cập nhật" },
    ];
    return defs.map((d, i) => ({ ...d, done: i < stage, active: i === stage, hasLine: i < 2 }));
  };

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#F8FAFF", fontFamily: SANS, color: "#0F172A", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* SUCCESS */}
          {view === "success" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "54px 28px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#1D4ED8,#1739A8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(29,78,216,0.32)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 25, fontWeight: 700, marginTop: 24, lineHeight: 1.15, letterSpacing: "-0.01em", animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Đã nhận yêu cầu</div>
              <div style={{ fontSize: 14.5, color: "#64748B", marginTop: 9, lineHeight: 1.6, maxWidth: 290, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Thợ sẽ liên hệ báo giá cho bạn trong vòng <strong style={{ color: "#1D4ED8" }}>30 phút</strong>. Bạn có thể theo dõi tiến độ bằng mã đơn dưới đây.</div>
              <div style={{ marginTop: 24, width: "100%", background: "#fff", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 14, padding: 18, textAlign: "left", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                {[["Mã đơn", lastCode], ["Dịch vụ", sel?.label || ""], ["Lịch hẹn", scheduleText]].map(([l, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#64748B", marginBottom: i < 2 ? 11 : 0 }}><span>{l}</span><span style={{ fontWeight: i === 0 ? 700 : 600, color: "#0F172A", fontVariantNumeric: i === 0 ? "tabular-nums" : undefined }}>{v}</span></div>
                ))}
              </div>
              <button onClick={() => { setView(null); setTab("track"); setTrackInput(lastCode); setTrackResult(resolveTrack(lastCode)); }} style={{ marginTop: 24, width: "100%", height: 50, background: "#1D4ED8", border: "none", borderRadius: 12, color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(29,78,216,0.28)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both" }}>Theo dõi đơn</button>
              <button onClick={goHome} style={{ marginTop: 10, width: "100%", height: 48, background: "transparent", border: "none", color: "#64748B", fontSize: 14, fontWeight: 600, cursor: "pointer", animation: "dcFadeUp 0.5s 0.4s cubic-bezier(.16,1,.3,1) both" }}>Về trang chủ</button>
            </div>
          )}

          {/* MAIN */}
          {view !== "success" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* HOME */}
              {tab === "home" && (
                <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96 }} className="dc-noscroll">
                  <div style={{ background: "linear-gradient(160deg,#1D4ED8,#1739A8)", padding: "54px 20px 22px", color: "#fff", borderRadius: "0 0 22px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🛠️</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>Thợ Nhà Việt</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(255,255,255,0.18)", borderRadius: 100, padding: "2px 8px", fontSize: 10.5, fontWeight: 700 }}>Verified<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, fontSize: 12, color: "rgba(255,255,255,0.85)" }}><span style={{ fontWeight: 700 }}>⭐ 4.9</span><span style={{ opacity: 0.7 }}>· 2.840 đánh giá · BR-VT</span></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "20px 20px 0" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 13 }}>Dịch vụ phổ biến</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 11 }}>
                      {SERVICES.map((s) => (
                        <button key={s.id} onClick={() => { setServiceId(s.id); setServiceOpen(false); setTab("book"); }} style={{ background: "#fff", border: "1px solid rgba(15,23,42,0.07)", borderRadius: 16, padding: "16px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
                          <span style={{ width: 46, height: 46, borderRadius: 13, background: s.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23 }}>{s.emoji}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>{CAT_LABELS[s.id]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "22px 20px 0" }}>
                    <div onClick={() => { setServiceId("dieuhoa"); setServiceOpen(false); setTab("book"); }} style={{ cursor: "pointer", background: "#fff", border: "1px solid rgba(15,23,42,0.07)", borderRadius: 18, overflow: "hidden" }}>
                      <div style={{ height: 128, background: "radial-gradient(circle at 70% 30%,rgba(255,255,255,0.25),transparent 60%),linear-gradient(135deg,#2563EB,#1739A8)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <span style={{ fontSize: 60, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))" }}>❄️</span>
                        <div style={{ position: "absolute", top: 13, left: 13, background: "rgba(255,255,255,0.92)", color: "#1D4ED8", fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>⭐ Được đặt nhiều</div>
                      </div>
                      <div style={{ padding: "15px 17px 17px" }}>
                        <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>Vệ sinh & bảo trì điều hòa</div>
                        <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 5, lineHeight: 1.45 }}>Vệ sinh dàn nóng/lạnh · nạp gas · kiểm tra toàn diện.</div>
                        <div style={{ marginTop: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ lineHeight: 1 }}><span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>Giá từ</span><div style={{ fontSize: 19, fontWeight: 700, color: "#1D4ED8", marginTop: 3 }}>150.000đ</div></div>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#1D4ED8", color: "#fff", borderRadius: 11, padding: "11px 20px", fontSize: 13.5, fontWeight: 700, boxShadow: "0 6px 16px rgba(29,78,216,0.28)" }}>Đặt lịch</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "20px 20px 0" }}>
                    <div style={{ display: "flex", gap: 9 }}>
                      {[["👨‍🔧", "Thợ có kinh nghiệm"], ["📋", "Báo giá trước"], ["🛡️", "Bảo hành 30 ngày"]].map(([icon, label], i) => (
                        <div key={i} style={{ flex: 1, background: "#fff", border: "1px solid rgba(15,23,42,0.07)", borderRadius: 14, padding: "13px 8px", textAlign: "center" }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(75,111,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>{icon}</div>
                          <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.25, color: "#1E293B" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "22px 20px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>Công việc gần đây</div>
                      <button onClick={() => setTab("track")} style={{ fontSize: 12, color: "#1D4ED8", fontWeight: 600, border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>Tra cứu đơn →</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {RECENT.map((j) => (
                        <div key={j.code} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid rgba(15,23,42,0.07)", borderRadius: 14, padding: "12px 13px" }}>
                          <span style={{ width: 40, height: 40, borderRadius: 11, background: j.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{j.emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>{j.service}</div>
                            <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>{j.code} · {j.date}</div>
                          </div>
                          <span style={statusBadge(j.status)}>{j.status === "done" ? "✅ Hoàn thành" : "🔧 Đang xử lý"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* BOOK */}
              {tab === "book" && (
                <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96 }} className="dc-noscroll">
                  <div style={{ padding: "54px 20px 14px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                    <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em" }}>Yêu cầu báo giá</div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Mô tả vấn đề · thợ sẽ báo giá trước khi làm.</div>
                  </div>
                  <div style={{ padding: "18px 20px" }}>
                    <label style={bLabel}>Dịch vụ cần sửa</label>
                    <div style={{ position: "relative" }}>
                      <button onClick={() => setServiceOpen((s) => !s)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid rgba(15,23,42,0.13)", borderRadius: 12, padding: "12px 14px", fontSize: 14, fontWeight: 600, color: sel ? "#0F172A" : "#94A3B8", cursor: "pointer", fontFamily: SANS }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>{sel && <span style={{ fontSize: 18 }}>{sel.emoji}</span>}<span>{sel ? sel.label : "Chọn dịch vụ…"}</span></span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      {serviceOpen && (
                        <div style={{ position: "absolute", top: 54, left: 0, right: 0, zIndex: 20, background: "#fff", border: "1px solid rgba(15,23,42,0.1)", borderRadius: 12, boxShadow: "0 14px 34px rgba(15,23,42,0.14)", overflow: "hidden" }}>
                          {SERVICES.map((o, i) => (
                            <button key={o.id} onClick={() => { setServiceId(o.id); setServiceOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 14px", border: "none", borderBottom: i < SERVICES.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none", background: serviceId === o.id ? "rgba(29,78,216,0.06)" : "#fff", color: "#0F172A", fontSize: 13.5, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: SANS }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 17 }}>{o.emoji}</span>{o.label}</span><span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>từ {fmt(o.from)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <label style={{ ...bLabel, margin: "18px 0 7px" }}>Mô tả vấn đề</label>
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="VD: máy lạnh chảy nước, không lạnh · ổ điện phòng khách bị nhảy CB…" style={{ ...lightInput, resize: "none", lineHeight: 1.5 }} />
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button onClick={() => setPhotos((p) => Math.min(3, p + 1))} style={{ width: 72, height: 72, borderRadius: 12, border: "1.5px dashed rgba(29,78,216,0.35)", background: "rgba(29,78,216,0.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 8v8M8 12h8" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" /><rect x="3" y="5" width="18" height="14" rx="3" stroke="#1D4ED8" strokeWidth="1.6" /></svg>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#1D4ED8" }}>Thêm ảnh</span>
                      </button>
                      {Array.from({ length: photos }, (_, i) => (
                        <div key={i} style={{ width: 72, height: 72, borderRadius: 12, background: "linear-gradient(135deg,#E0EAFF,#C7D7FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, position: "relative" }}>🖼️
                          <button onClick={() => setPhotos((p) => Math.max(0, p - 1))} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", border: "none", background: "#0F172A", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>
                      ))}
                    </div>

                    <label style={{ ...bLabel, margin: "20px 0 9px" }}>Ngày hẹn</label>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 5 }} className="dc-noscroll">
                      {Array.from({ length: 14 }, (_, i) => { const d = addDays(today(), i); const s = iso(d) === date; return (
                        <button key={i} onClick={() => setDate(iso(d))} style={{ flexShrink: 0, width: 50, height: 60, borderRadius: 13, cursor: "pointer", padding: "8px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: s ? "none" : "1px solid rgba(15,23,42,0.1)", background: s ? "#1D4ED8" : "#fff", boxShadow: s ? "0 6px 16px rgba(29,78,216,0.3)" : "none" }}>
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: s ? "rgba(255,255,255,0.85)" : "#94A3B8" }}>{WD[d.getDay()]}</span>
                          <span style={{ fontSize: 18, fontWeight: 700, color: s ? "#fff" : "#0F172A", lineHeight: 1 }}>{d.getDate()}</span>
                        </button>
                      ); })}
                    </div>

                    <label style={{ ...bLabel, margin: "20px 0 9px" }}>Khung giờ</label>
                    <div style={{ display: "flex", gap: 9 }}>
                      {SLOTS.map((sl) => { const s = slot === sl.id; return (
                        <button key={sl.id} onClick={() => setSlot(sl.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderRadius: 13, padding: "12px 6px", cursor: "pointer", border: s ? "2px solid #1D4ED8" : "1px solid rgba(15,23,42,0.12)", background: s ? "rgba(29,78,216,0.05)" : "#fff", color: s ? "#1D4ED8" : "#475569", fontFamily: SANS }}>
                          <span style={{ fontSize: 17 }}>{sl.icon}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{sl.label}</span><span style={{ fontSize: 10.5, opacity: 0.72 }}>{sl.time}</span>
                        </button>
                      ); })}
                    </div>

                    <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "#94A3B8", margin: "22px 0 11px" }}>Thông tin liên hệ</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                      <SField label="Họ và tên" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="VD: Đỗ Văn Hùng" />
                      <SField label="Số điện thoại" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="VD: 0908 901 234" inputMode="numeric" />
                      <SField label="Địa chỉ" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} placeholder="Số nhà, đường, phường…" />
                    </div>
                  </div>

                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 76, padding: "12px 20px 8px", background: "linear-gradient(to top,#F8FAFF 74%,rgba(248,250,255,0))", zIndex: 15 }}>
                    {error && <div style={{ textAlign: "center", color: "#DC2626", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{error}</div>}
                    <button onClick={submitBooking} disabled={!canBook || submitting} style={{ width: "100%", height: 54, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: canBook && !submitting ? "pointer" : "not-allowed", color: "#fff", background: canBook ? "#1D4ED8" : "#B6C2DE", boxShadow: canBook ? "0 8px 24px rgba(29,78,216,0.32)" : "none", fontFamily: SANS }}>{submitting ? "Đang gửi…" : canBook ? "Yêu cầu báo giá" : "Vui lòng điền đầy đủ thông tin"}</button>
                  </div>
                </div>
              )}

              {/* TRACK */}
              {tab === "track" && (
                <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96 }} className="dc-noscroll">
                  <div style={{ padding: "54px 20px 14px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                    <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em" }}>Tra cứu đơn</div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Nhập mã đơn để xem trạng thái công việc.</div>
                  </div>
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", gap: 9 }}>
                      <input value={trackInput} onChange={(e) => setTrackInput(e.target.value)} placeholder="VD: HS24816" style={{ flex: 1, minWidth: 0, boxSizing: "border-box", border: "1px solid rgba(15,23,42,0.13)", background: "#fff", borderRadius: 11, padding: "13px 14px", fontSize: 14, fontWeight: 600, color: "#0F172A", letterSpacing: "0.04em", fontFamily: SANS }} />
                      <button onClick={() => setTrackResult(resolveTrack(trackInput))} style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 11, padding: "0 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 16px rgba(29,78,216,0.26)", fontFamily: SANS }}>Tra cứu</button>
                    </div>

                    {trackResult ? (
                      <div style={{ marginTop: 18, background: "#fff", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 16, padding: 17 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 15, borderBottom: "1px solid rgba(15,23,42,0.07)" }}>
                          <span style={{ width: 44, height: 44, borderRadius: 12, background: trackResult.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{trackResult.emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{trackResult.service}</div>
                            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{trackResult.code} · {trackResult.address}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: trackResult.badge.c, background: trackResult.badge.bg, borderRadius: 8, padding: "5px 10px", whiteSpace: "nowrap", flexShrink: 0 }}>{trackResult.badge.t}</span>
                        </div>
                        <div style={{ paddingTop: 16, display: "flex", flexDirection: "column" }}>
                          {steps(trackResult.stage).map((s, i) => (
                            <div key={i} style={{ display: "flex", gap: 13 }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: s.done ? "#4B6F44" : s.active ? "#1D4ED8" : "#E2E8F0", animation: s.active ? "dcPulse2 2s infinite" : "none" }}>
                                  {s.done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </div>
                                {s.hasLine && <div style={{ width: 2, flex: 1, minHeight: 22, background: i < trackResult.stage ? "#4B6F44" : "#E2E8F0", marginTop: 2 }} />}
                              </div>
                              <div style={{ paddingBottom: 18, flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: s.done || s.active ? 700 : 600, color: s.done || s.active ? "#0F172A" : "#94A3B8" }}>{s.title}</div>
                                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{s.done || s.active ? s.d : s.detail}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {trackResult.stage >= 1 && (
                          <div style={{ marginTop: 2, display: "flex", alignItems: "center", gap: 11, background: "#F8FAFF", border: "1px solid rgba(29,78,216,0.12)", borderRadius: 12, padding: "11px 13px" }}>
                            <span style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1D4ED8,#1739A8)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{trackResult.tech.split(" ").slice(-1)[0][0]}</span>
                            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>{trackResult.tech}</div><div style={{ fontSize: 11.5, color: "#64748B" }}>Thợ phụ trách · ⭐ {trackResult.techRating}</div></div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", background: "rgba(29,78,216,0.08)", borderRadius: 8, padding: "6px 10px" }}>Đang đến</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: 40, textAlign: "center", color: "#94A3B8" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EEF3FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#1D4ED8" strokeWidth="1.8" /><path d="M20 20l-3.4-3.4" stroke="#1D4ED8" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#64748B" }}>Nhập mã đơn để xem tiến độ công việc.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* BOTTOM NAV */}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 50, background: "rgba(255,255,255,0.96)", borderTop: "1px solid rgba(15,23,42,0.07)", padding: "8px 16px 30px", display: "flex" }}>
                {([["home", "Trang chủ", <IconHome key="h" />], ["book", "Đặt lịch", <IconCal key="c" />], ["track", "Tra cứu", <IconSearch key="s" />]] as const).map(([id, label, icon]) => {
                  const active = tab === id;
                  return (
                    <button key={id} onClick={() => setTab(id)} style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 0" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 24, color: active ? "#1D4ED8" : "#94A3B8" }}>{icon}</span>
                      <span style={{ fontSize: 11, fontWeight: active ? 700 : 600, color: active ? "#1D4ED8" : "#94A3B8" }}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SField({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; inputMode?: "numeric" }) {
  return (<div><label style={{ fontSize: 12, color: "#475569", fontWeight: 600, display: "block", marginBottom: 5 }}>{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} inputMode={inputMode} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", border: "1px solid rgba(15,23,42,0.13)", background: "#fff", borderRadius: 11, padding: "12px 13px", fontSize: 14, color: "#0F172A", fontFamily: SANS }} /></div>);
}
const IconHome = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const IconCal = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M3 9h18M8 3v4M16 3v4M12 13v4M10 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const IconSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.4-3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;

function statusBadge(status: string): CSSProperties {
  return status === "done"
    ? { fontSize: 11, fontWeight: 700, color: "#3A5635", background: "rgba(75,111,68,0.13)", borderRadius: 8, padding: "5px 10px", whiteSpace: "nowrap" }
    : { fontSize: 11, fontWeight: 700, color: "#B45309", background: "rgba(245,158,11,0.14)", borderRadius: 8, padding: "5px 10px", whiteSpace: "nowrap" };
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#F8FAFF", boxShadow: "0 20px 60px rgba(17,24,39,0.18)" };
const bLabel: CSSProperties = { fontSize: 12.5, fontWeight: 600, color: "#475569", display: "block", marginBottom: 7 };
const lightInput: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(15,23,42,0.13)", background: "#fff", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#0F172A", fontFamily: SANS };

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
@keyframes dcPulse2 { 0%,100% { box-shadow:0 0 0 0 rgba(29,78,216,0.4) } 50% { box-shadow:0 0 0 6px rgba(29,78,216,0) } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
