"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";

const SANS = "var(--font-be-vietnam), sans-serif";

const STAT_TARGETS = [500, 50, 85];
const STAT_SUFFIX = ["+", "+", "%"];
const STAT_LABELS = ["Học viên", "Khóa học", "Có việc làm"];

type Course = { id: string; name: string; emoji: string; mode: string; hot?: boolean; duration: string; start: string; price: number; taken: number; total: number; g: [string, string] };
const COURSES: Course[] = [
  { id: "digital", name: "Digital Marketing thực chiến", emoji: "📈", mode: "Online", hot: true, duration: "8 tuần", start: "01/07", price: 3500000, taken: 18, total: 30, g: ["#2563EB", "#1739A8"] },
  { id: "design", name: "Thiết kế đồ họa cơ bản", emoji: "🎨", mode: "Offline", duration: "10 tuần", start: "15/07", price: 4200000, taken: 24, total: 25, g: ["#7C3AED", "#4C2398"] },
  { id: "web", name: "Lập trình Web Front-end", emoji: "💻", mode: "Online", hot: true, duration: "12 tuần", start: "08/07", price: 5800000, taken: 12, total: 30, g: ["#0891B2", "#075E73"] },
  { id: "english", name: "Tiếng Anh giao tiếp", emoji: "🗣️", mode: "Offline", duration: "16 tuần", start: "20/07", price: 2800000, taken: 27, total: 30, g: ["#4B6F44", "#3A5635"] },
  { id: "data", name: "Phân tích dữ liệu với Excel", emoji: "📊", mode: "Online", duration: "6 tuần", start: "05/07", price: 2400000, taken: 9, total: 30, g: ["#C05000", "#8A3800"] },
];

type Job = { id: string; title: string; company: string; logo: string; salary: string; location: string; deadline: string; urgent?: boolean; tint: string };
const JOBS: Job[] = [
  { id: "mkt", title: "Nhân viên Marketing", company: "Zeebee Studio · BR-VT", logo: "Z", salary: "10–15 triệu", location: "Vũng Tàu", deadline: "còn 5 ngày", urgent: true, tint: "rgba(29,78,216,0.1)" },
  { id: "sale", title: "Nhân viên Kinh doanh", company: "An Nhiên Retreat", logo: "A", salary: "8–20 triệu", location: "Long Hải", deadline: "còn 12 ngày", tint: "rgba(75,111,68,0.12)" },
  { id: "dev", title: "Lập trình viên Web", company: "ZTeam Technology", logo: "T", salary: "15–25 triệu", location: "Remote", deadline: "còn 8 ngày", urgent: true, tint: "rgba(124,58,237,0.12)" },
  { id: "design", title: "Thiết kế đồ họa", company: "Bếp Biển F&B", logo: "B", salary: "9–14 triệu", location: "Vũng Tàu", deadline: "còn 18 ngày", tint: "rgba(192,80,0,0.12)" },
  { id: "cs", title: "Chăm sóc khách hàng", company: "Thợ Nhà Việt", logo: "H", salary: "7–10 triệu", location: "Bà Rịa", deadline: "còn 3 ngày", tint: "rgba(8,145,178,0.12)" },
];

const LEVELS = ["THPT", "Trung cấp", "Cao đẳng", "Đại học", "Sau ĐH"];
const EXPS = ["Chưa có", "Dưới 1 năm", "1–3 năm", "Trên 3 năm"];
const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

export default function RecruitPage() {
  const [screen, setScreen] = useState<"main" | "form" | "success">("main");
  const [tab, setTab] = useState<"courses" | "jobs">("courses");
  const [kind, setKind] = useState<"course" | "job" | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", level: null as string | null, exp: null as string | null, note: "" });
  const [statN, setStatN] = useState([0, 0, 0]);
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const steps = 34, dur = 1100; let i = 0;
    const timer = setInterval(() => {
      i++; const p = Math.min(1, i / steps); const e = 1 - Math.pow(1 - p, 3);
      setStatN(STAT_TARGETS.map((t) => Math.round(t * e)));
      if (p >= 1) clearInterval(timer);
    }, dur / steps);
    return () => clearInterval(timer);
  }, []);

  const course = (id: string | null) => COURSES.find((c) => c.id === id);
  const job = (id: string | null) => JOBS.find((j) => j.id === id);

  const sel = kind === "course" ? (() => { const c = course(itemId); return c ? { kind: "Khóa học", name: c.name, icon: c.emoji, meta: `${c.duration} · ${c.mode} · ${fmt(c.price)}`, iconStyle: { width: 56, height: 56, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, background: `linear-gradient(140deg, ${c.g[0]}, ${c.g[1]})` } as CSSProperties } : null; })()
    : kind === "job" ? (() => { const j = job(itemId); return j ? { kind: "Vị trí ứng tuyển", name: j.title, icon: j.logo, meta: `${j.company} · ${j.salary}`, iconStyle: { width: 56, height: 56, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#1D4ED8", background: j.tint } as CSSProperties } : null; })()
    : null;

  const canSubmit = !!(itemId && form.name.trim() && form.phone.trim() && form.email.trim() && form.level && form.exp);

  async function submit() {
    if (!canSubmit || submitting || !sel) return;
    setSubmitting(true); setError("");
    const note = [`[${kind === "job" ? "Ứng tuyển" : "Đăng ký khóa học"} · ZSkills]`, `${sel.kind}: ${sel.name}`, `Email: ${form.email}`, `Trình độ: ${form.level}`, `Kinh nghiệm: ${form.exp}`, form.note ? `Ghi chú: ${form.note}` : ""].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note, category: "recruit" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");
      setOrderCode((kind === "job" ? "TD" : "KH") + Math.floor(10000 + Math.random() * 90000));
      setScreen("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Lỗi"); } finally { setSubmitting(false); }
  }
  function home() { setScreen("main"); setKind(null); setItemId(null); setForm({ name: "", phone: "", email: "", level: null, exp: null, note: "" }); }

  const chip = (label: string, active: boolean): CSSProperties => ({ border: active ? "none" : "1px solid rgba(29,78,216,0.2)", background: active ? "#1D4ED8" : "#fff", color: active ? "#fff" : "#5B7299", borderRadius: 100, padding: "8px 15px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", boxShadow: active ? "0 4px 11px rgba(29,78,216,0.28)" : "none", fontFamily: SANS });
  const inputStyle: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(29,78,216,0.18)", background: "#fff", borderRadius: 11, padding: "12px 13px", fontSize: 14, color: "#0F2545", fontFamily: SANS };

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#EFF6FF", fontFamily: SANS, color: "#0F2545", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* MAIN */}
          {screen === "main" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ background: "linear-gradient(160deg,#1D4ED8,#1739A8)", padding: "54px 20px 20px", color: "#fff", borderRadius: "0 0 24px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🎓</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1 }}>Trung tâm ZSkills</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.16)", borderRadius: 100, padding: "3px 9px", fontSize: 10.5, fontWeight: 600, marginTop: 6 }}>Đối tác chính thức<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                  </div>
                </div>
                <div style={{ marginTop: 18, display: "flex", gap: 9 }}>
                  {STAT_TARGETS.map((_, i) => (
                    <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 14, padding: "13px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.01em" }}>{statN[i].toLocaleString("vi-VN")}{STAT_SUFFIX[i]}</div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.82)", fontWeight: 500, marginTop: 6, lineHeight: 1.25 }}>{STAT_LABELS[i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "16px 20px 0" }}>
                <div style={{ display: "flex", background: "#fff", border: "1px solid rgba(29,78,216,0.12)", borderRadius: 13, padding: 4, gap: 4 }}>
                  <button onClick={() => setTab("courses")} style={tabStyle(tab === "courses")}>📚 Khóa học</button>
                  <button onClick={() => setTab("jobs")} style={tabStyle(tab === "jobs")}>💼 Tuyển dụng</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 30px" }} className="dc-noscroll">
                {tab === "courses" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {COURSES.map((c) => {
                      const pct = Math.round((c.taken / c.total) * 100);
                      const nearFull = pct >= 90;
                      return (
                        <div key={c.id} style={{ background: "#fff", border: "1px solid rgba(29,78,216,0.1)", borderRadius: 18, overflow: "hidden", boxShadow: "0 6px 16px rgba(15,37,69,0.05)" }}>
                          <div style={{ position: "relative", height: 92, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 72% 28%, rgba(255,255,255,0.2), transparent 58%), linear-gradient(140deg, ${c.g[0]}, ${c.g[1]})` }}>
                            <span style={{ fontSize: 46, filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.16))" }}>{c.emoji}</span>
                            <div style={{ position: "absolute", top: 11, left: 11, display: "flex", gap: 6 }}>
                              {c.hot && <span style={{ background: "#C05000", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 100 }}>🔥 Hot</span>}
                              <span style={{ background: "rgba(255,255,255,0.92)", color: "#1D4ED8", fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 100 }}>{c.mode}</span>
                            </div>
                          </div>
                          <div style={{ padding: "14px 16px 16px" }}>
                            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>{c.name}</div>
                            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#5B7299", fontWeight: 500 }}>🕐 {c.duration}</span>
                              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#5B7299", fontWeight: 500 }}>📅 {c.start}</span>
                            </div>
                            <div style={{ marginTop: 12 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 11.5, color: "#5B7299", fontWeight: 600 }}>Đã đăng ký</span>
                                <span style={{ fontSize: 11.5, fontWeight: 700, color: nearFull ? "#C05000" : "#1D4ED8" }}>{c.taken}/{c.total} chỗ</span>
                              </div>
                              <div style={{ height: 7, background: "#E2ECFB", borderRadius: 100, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 100, background: nearFull ? "linear-gradient(90deg,#E0820F,#C05000)" : "linear-gradient(90deg,#3B82F6,#1D4ED8)" }} />
                              </div>
                            </div>
                            <div style={{ marginTop: 14, paddingTop: 13, borderTop: "1px solid rgba(29,78,216,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div style={{ lineHeight: 1 }}><span style={{ fontSize: 10.5, color: "#93A8C9", fontWeight: 500 }}>Học phí</span><div style={{ fontSize: 18, fontWeight: 800, color: "#1D4ED8", marginTop: 3 }}>{fmt(c.price)}</div></div>
                              <button onClick={() => { setKind("course"); setItemId(c.id); setScreen("form"); }} style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 11, padding: "11px 20px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 5px 14px rgba(29,78,216,0.26)", fontFamily: SANS }}>Đăng ký</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {JOBS.map((j) => (
                      <div key={j.id} style={{ background: "#fff", border: "1px solid rgba(29,78,216,0.1)", borderRadius: 16, padding: "15px 16px", boxShadow: "0 6px 16px rgba(15,37,69,0.05)" }}>
                        <div style={{ display: "flex", gap: 13 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 13, background: j.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23, flexShrink: 0, fontWeight: 800, color: "#1D4ED8" }}>{j.logo}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.2 }}>{j.title}</div>
                            <div style={{ fontSize: 12.5, color: "#5B7299", fontWeight: 500, marginTop: 3 }}>{j.company}</div>
                          </div>
                          {j.urgent && <span style={{ height: "fit-content", background: "rgba(192,80,0,0.1)", color: "#C05000", fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>Gấp</span>}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#3A5635", background: "rgba(75,111,68,0.1)", borderRadius: 8, padding: "5px 10px" }}>💰 {j.salary}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#5B7299", background: "#EEF3FB", borderRadius: 8, padding: "5px 10px" }}>📍 {j.location}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#5B7299", background: "#EEF3FB", borderRadius: 8, padding: "5px 10px" }}>⏳ {j.deadline}</span>
                        </div>
                        <button onClick={() => { setKind("job"); setItemId(j.id); setScreen("form"); }} style={{ marginTop: 13, width: "100%", border: "1px solid #1D4ED8", background: "transparent", color: "#1D4ED8", borderRadius: 11, padding: 11, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>Ứng tuyển ngay</button>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 20, fontSize: 12.5, color: "#5B7299", fontWeight: 600 }}>← Về trang chủ zeebee.vn</Link>
              </div>
            </div>
          )}

          {/* FORM */}
          {screen === "form" && sel && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#EFF6FF", padding: "54px 20px 13px", display: "flex", alignItems: "center", gap: 13, borderBottom: "1px solid rgba(29,78,216,0.1)" }}>
                <button onClick={() => setScreen("main")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(29,78,216,0.2)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#0F2545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{kind === "job" ? "Ứng tuyển" : "Đăng ký khóa học"}</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 110px" }} className="dc-noscroll">
                <div style={{ display: "flex", gap: 13, background: "#fff", border: "1px solid rgba(29,78,216,0.1)", borderRadius: 16, padding: 14 }}>
                  <div style={sel.iconStyle}>{sel.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93A8C9", fontWeight: 700 }}>{sel.kind}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, marginTop: 4 }}>{sel.name}</div>
                    <div style={{ fontSize: 12.5, color: "#5B7299", fontWeight: 500, marginTop: 4 }}>{sel.meta}</div>
                  </div>
                </div>

                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "#93A8C9", margin: "22px 0 11px" }}>Thông tin của bạn</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div><label style={rLabel}>Họ và tên</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="VD: Trần Gia Bảo" style={inputStyle} /></div>
                  <div><label style={rLabel}>Số điện thoại</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} inputMode="numeric" placeholder="090..." style={inputStyle} /></div>
                  <div><label style={rLabel}>Email</label><input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} inputMode="email" placeholder="ban@email.com" style={inputStyle} /></div>
                  <div><label style={rLabel}>Trình độ học vấn</label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{LEVELS.map((l) => <button key={l} onClick={() => setForm((f) => ({ ...f, level: l }))} style={chip(l, form.level === l)}>{l}</button>)}</div></div>
                  <div><label style={rLabel}>Kinh nghiệm</label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{EXPS.map((x) => <button key={x} onClick={() => setForm((f) => ({ ...f, exp: x }))} style={chip(x, form.exp === x)}>{x}</button>)}</div></div>
                  <div><label style={rLabel}>Ghi chú <span style={{ color: "#93A8C9" }}>(không bắt buộc)</span></label><textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} placeholder="VD: mong muốn học buổi tối · quan tâm lộ trình việc làm…" style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} /></div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#EFF6FF 74%,rgba(239,246,255,0))", zIndex: 40 }}>
                {error && <div style={{ textAlign: "center", color: "#B91C1C", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{error}</div>}
                <button onClick={submit} disabled={!canSubmit || submitting} style={{ width: "100%", height: 54, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: canSubmit && !submitting ? "pointer" : "not-allowed", color: "#fff", background: canSubmit ? "#1D4ED8" : "#A9C0E8", boxShadow: canSubmit ? "0 8px 24px rgba(29,78,216,0.32)" : "none", fontFamily: SANS }}>{submitting ? "Đang gửi…" : canSubmit ? (kind === "job" ? "Nộp hồ sơ ứng tuyển" : "Đăng ký ngay") : "Vui lòng điền đầy đủ thông tin"}</button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {screen === "success" && sel && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "54px 28px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#1D4ED8,#1739A8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(29,78,216,0.3)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 24, lineHeight: 1.15, letterSpacing: "-0.01em", animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Đã nhận đăng ký</div>
              <div style={{ fontSize: 14.5, color: "#5B7299", marginTop: 9, lineHeight: 1.6, fontWeight: 400, maxWidth: 290, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Tư vấn viên của ZSkills sẽ liên hệ với bạn trong vòng <strong style={{ color: "#1D4ED8" }}>24 giờ</strong> để hướng dẫn bước tiếp theo. 🎓</div>
              <div style={{ marginTop: 26, width: "100%", background: "#fff", border: "1px solid rgba(29,78,216,0.12)", borderRadius: 16, padding: 18, textAlign: "left", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#93A8C9", marginBottom: 11 }}><span>Mã đăng ký</span><span style={{ fontWeight: 700, color: "#0F2545", fontVariantNumeric: "tabular-nums" }}>{orderCode}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#93A8C9", marginBottom: 11 }}><span>{sel.kind}</span><span style={{ fontWeight: 600, color: "#0F2545", textAlign: "right", maxWidth: 200 }}>{sel.name}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#93A8C9" }}><span>Người đăng ký</span><span style={{ fontWeight: 600, color: "#0F2545" }}>{form.name}</span></div>
              </div>
              <button onClick={home} style={{ marginTop: 24, width: "100%", height: 52, background: "#1D4ED8", border: "none", borderRadius: 13, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 22px rgba(29,78,216,0.3)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both", fontFamily: SANS }}>Về trang chủ</button>
              <Link href="/" style={{ marginTop: 16, fontSize: 12.5, color: "#5B7299", fontFamily: SANS }}>← Về trang chủ zeebee.vn</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#EFF6FF", boxShadow: "0 20px 60px rgba(17,24,39,0.18)" };
const rLabel: CSSProperties = { fontSize: 12, color: "#5B7299", fontWeight: 600, display: "block", marginBottom: 5 };
function tabStyle(on: boolean): CSSProperties { return { flex: 1, border: "none", borderRadius: 10, padding: 11, fontSize: 13.5, fontWeight: 700, cursor: "pointer", background: on ? "#1D4ED8" : "transparent", color: on ? "#fff" : "#5B7299", boxShadow: on ? "0 4px 12px rgba(29,78,216,0.3)" : "none", fontFamily: SANS }; }

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
