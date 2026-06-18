"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

const SANS = "var(--font-raleway), sans-serif";
const TIMES = ["Trong hôm nay", "Sáng mai", "Chiều mai", "Cuối tuần"];

type Listing = { id: string; name: string; address: string; mode: "buy" | "rent"; emoji: string; beds: number; baths: number; area: number; price: string; badge?: "new" | "hot"; g: [string, string]; desc: string; features: { icon: string; label: string }[] };
const LISTINGS: Listing[] = [
  { id: "villa", name: "Villa biển Long Hải", address: "Mặt tiền Trần Phú · Long Hải", mode: "buy", emoji: "🏖️", beds: 4, baths: 3, area: 280, price: "12,5 tỷ", badge: "new", g: ["#1E293B", "#0B1220"], desc: "Villa nghỉ dưỡng sát biển, thiết kế hiện đại với hồ bơi riêng và sân vườn rộng. Pháp lý sổ hồng đầy đủ, sổ riêng từng căn. Vị trí mặt tiền đường lớn, thuận tiện kinh doanh lưu trú.", features: [{ icon: "🏊", label: "Hồ bơi riêng" }, { icon: "🌳", label: "Sân vườn" }, { icon: "🚗", label: "Gara 2 xe" }, { icon: "📜", label: "Sổ hồng" }, { icon: "🌊", label: "View biển" }] },
  { id: "canho", name: "Căn hộ The Sóng", address: "Thùy Vân · TP. Vũng Tàu", mode: "buy", emoji: "🏙️", beds: 2, baths: 2, area: 75, price: "4,2 tỷ", badge: "hot", g: ["#1B2A3A", "#0C1622"], desc: "Căn hộ cao cấp tầng trung, view biển trực diện, full nội thất nhập khẩu. Tiện ích 5 sao nội khu: hồ bơi, gym, spa. Bàn giao ngay, pháp lý minh bạch.", features: [{ icon: "🌊", label: "View biển" }, { icon: "🛋️", label: "Full nội thất" }, { icon: "🏋️", label: "Gym · Spa" }, { icon: "🔒", label: "An ninh 24/7" }] },
  { id: "nhapho", name: "Nhà phố Bà Rịa", address: "Phường Phước Hưng · Bà Rịa", mode: "buy", emoji: "🏘️", beds: 3, baths: 3, area: 120, price: "5,8 tỷ", g: ["#23303F", "#0E1A26"], desc: "Nhà phố 1 trệt 2 lầu, kết cấu kiên cố, hẻm xe hơi. Khu dân cư hiện hữu, gần chợ và trường học. Phù hợp ở hoặc cho thuê.", features: [{ icon: "🚗", label: "Hẻm xe hơi" }, { icon: "🏫", label: "Gần trường" }, { icon: "📜", label: "Sổ hồng" }, { icon: "🏪", label: "Gần chợ" }] },
  { id: "datnen", name: "Đất nền KDC Phước Tỉnh", address: "Phước Tỉnh · Long Điền", mode: "buy", emoji: "🌅", beds: 0, baths: 0, area: 100, price: "2,4 tỷ", badge: "new", g: ["#26313D", "#101A24"], desc: "Lô đất nền thổ cư 100%, mặt tiền đường nhựa 12m. Khu dân cư quy hoạch bài bản, hạ tầng hoàn thiện. Tiềm năng tăng giá cao.", features: [{ icon: "📜", label: "Thổ cư 100%" }, { icon: "🛣️", label: "Đường 12m" }, { icon: "⚡", label: "Hạ tầng đủ" }] },
  { id: "thueCanho", name: "Căn hộ Gateway cho thuê", address: "Thùy Vân · TP. Vũng Tàu", mode: "rent", emoji: "🏢", beds: 2, baths: 2, area: 68, price: "14 tr", g: ["#1B2A3A", "#0C1622"], desc: "Căn hộ cho thuê dài hạn, full nội thất, dọn vào ở ngay. View thành phố, gần biển 300m. Bao phí quản lý.", features: [{ icon: "🛋️", label: "Full nội thất" }, { icon: "🌆", label: "View thành phố" }, { icon: "🏊", label: "Hồ bơi" }, { icon: "🔒", label: "An ninh" }] },
  { id: "thueNha", name: "Nhà nguyên căn Long Hải", address: "Gần biển Long Hải", mode: "rent", emoji: "🏡", beds: 3, baths: 2, area: 110, price: "18 tr", badge: "hot", g: ["#23303F", "#0E1A26"], desc: "Nhà nguyên căn 3 phòng ngủ, sân thượng thoáng, phù hợp homestay hoặc ở gia đình. Cách biển 200m, khu yên tĩnh.", features: [{ icon: "🏖️", label: "Gần biển" }, { icon: "☀️", label: "Sân thượng" }, { icon: "🚗", label: "Chỗ đậu xe" }] },
];
const REQ_TYPES = [
  { id: "visit", icon: "🔑", label: "Xem thực địa", desc: "Đặt lịch tham quan trực tiếp" },
  { id: "legal", icon: "📜", label: "Tư vấn pháp lý", desc: "Sổ hồng · hợp đồng · thủ tục" },
  { id: "quote", icon: "💰", label: "Báo giá chi tiết", desc: "Giá · phương án vay · chi phí" },
];

const listing = (id: string | null) => LISTINGS.find((p) => p.id === id);
const imgBg = (g: [string, string]) => `radial-gradient(ellipse 90% 70% at 70% 25%, rgba(184,134,11,0.2), transparent 60%), linear-gradient(155deg, ${g[0]}, ${g[1]})`;
const typeChip = (mode: string) => mode === "rent"
  ? { text: "Cho thuê", style: { background: "rgba(75,111,68,0.85)", color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "5px 11px", borderRadius: 100 } as CSSProperties }
  : { text: "Bán", style: { background: "rgba(184,134,11,0.92)", color: "#0F172A", fontSize: 10.5, fontWeight: 800, padding: "5px 11px", borderRadius: 100 } as CSSProperties };
const badgeChip = (b?: string): { text: string; style: CSSProperties } | null =>
  b === "new" ? { text: "MỚI", style: { background: "#B8860B", color: "#0F172A", fontSize: 10, fontWeight: 800, padding: "5px 10px", borderRadius: 100, letterSpacing: "0.04em" } }
    : b === "hot" ? { text: "🔥 HOT", style: { background: "rgba(192,80,0,0.92)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "5px 10px", borderRadius: 100 } }
      : null;

export default function RealEstatePage() {
  const [screen, setScreen] = useState<"home" | "detail" | "consult" | "success">("home");
  const [mode, setMode] = useState<"buy" | "rent">("buy");
  const [listingId, setListingId] = useState<string | null>(null);
  const [fromAgent, setFromAgent] = useState(false);
  const [reqType, setReqType] = useState("visit");
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const list = LISTINGS.filter((p) => p.mode === mode);
  const d = listing(listingId);
  const reqLabel = REQ_TYPES.find((r) => r.id === reqType)?.label || "";
  const canSubmit = !!(form.name.trim() && form.phone.trim() && timeSlot);

  async function submit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true); setError("");
    const note = ["[Yêu cầu tư vấn BĐS · An Phú Estate]", `Loại: ${reqLabel}`, d ? `BĐS: ${d.name} (${d.price}${d.mode === "rent" ? "/tháng" : ""})` : "Tư vấn chung", `Thời gian: ${timeSlot}`, form.note ? `Ghi chú: ${form.note}` : ""].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note, category: "realestate" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");
      setOrderCode("RE" + Math.floor(10000 + Math.random() * 90000));
      setScreen("success");
    } catch (e) { setError(e instanceof Error ? e.message : "Lỗi"); } finally { setSubmitting(false); }
  }
  function home() { setScreen("home"); setListingId(null); setFromAgent(false); setReqType("visit"); setTimeSlot(null); setForm({ name: "", phone: "", note: "" }); }
  function openDetail(id: string) { setListingId(id); setFromAgent(false); setScreen("detail"); }

  const inputStyle: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(184,134,11,0.2)", background: "rgba(255,255,255,0.04)", borderRadius: 11, padding: "12px 13px", fontSize: 14, color: "#E8ECF3", fontFamily: SANS };
  const cs = d ? { hasListing: true, name: d.name, address: d.address, emoji: d.emoji, priceText: d.price + (d.mode === "rent" ? " / tháng" : ""), imgStyle: { width: 64, height: 64, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: imgBg(d.g) } as CSSProperties } : { hasListing: false };

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#0F172A", fontFamily: SANS, color: "#E8ECF3", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* HOME */}
          {screen === "home" && (
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30 }} className="dc-noscroll">
              <div style={{ padding: "54px 20px 18px", borderBottom: "1px solid rgba(184,134,11,0.16)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,#B8860B,#8A6608)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>AN</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8860B", fontWeight: 700 }}>An Phú Estate</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em" }}>Lê Hoàng Minh</span>
                        <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#B8860B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(184,134,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 8h14M5 12h14M5 16h14" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" /></svg>
                  </div>
                </div>
              </div>

              <div style={{ padding: "18px 20px 0" }}>
                <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,134,11,0.18)", borderRadius: 12, padding: 4, gap: 4 }}>
                  <button onClick={() => setMode("buy")} style={toggleStyle(mode === "buy")}>Mua</button>
                  <button onClick={() => setMode("rent")} style={toggleStyle(mode === "rent")}>Thuê</button>
                </div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 11, paddingBottom: 4 }} className="dc-noscroll">
                  {(mode === "buy" ? ["Khu vực", "Giá", "Diện tích"] : ["Khu vực", "Giá / tháng", "Diện tích"]).map((label) => (
                    <button key={label} style={{ display: "flex", alignItems: "center", flexShrink: 0, border: "1px solid rgba(184,134,11,0.22)", background: "rgba(255,255,255,0.04)", color: "#C4CDDC", borderRadius: 100, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: SANS }}>{label}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 2 }}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                  ))}
                </div>
              </div>

              {/* featured */}
              <div style={{ padding: "20px 20px 0" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A93A6", fontWeight: 700, marginBottom: 11 }}>Bất động sản nổi bật</div>
                <div onClick={() => openDetail("villa")} style={{ cursor: "pointer", borderRadius: 18, overflow: "hidden", position: "relative", border: "1px solid rgba(184,134,11,0.2)" }}>
                  <div style={{ height: 210, position: "relative", background: "radial-gradient(ellipse 90% 70% at 70% 25%,rgba(184,134,11,0.28),transparent 60%),linear-gradient(155deg,#1E293B,#0B1220)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 78, filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.4))", opacity: 0.92 }}>🏖️</span>
                    <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 7 }}>
                      <span style={{ background: "#B8860B", color: "#0F172A", fontSize: 10.5, fontWeight: 800, padding: "5px 11px", borderRadius: 100, letterSpacing: "0.04em" }}>MỚI</span>
                      <span style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(4px)", color: "#E8C97A", fontSize: 10.5, fontWeight: 700, padding: "5px 11px", borderRadius: 100, border: "0.5px solid rgba(184,134,11,0.4)" }}>Bán</span>
                    </div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "62%", background: "linear-gradient(to top,rgba(8,12,22,0.92),transparent)" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                      <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>Villa biển Long Hải</div>
                      <div style={{ fontSize: 12.5, color: "#B6C0D2", marginTop: 4, fontWeight: 400 }}>📍 Mặt tiền Trần Phú · Long Hải</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 11 }}>
                        <span style={{ fontSize: 23, fontWeight: 800, color: "#E8C97A" }}>12,5 tỷ</span>
                        <span style={{ display: "flex", gap: 13, fontSize: 12, color: "#C4CDDC", fontWeight: 500 }}><span>🛏 4</span><span>🚿 3</span><span>📐 280m²</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* listings */}
              <div style={{ padding: "24px 20px 0" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>{mode === "buy" ? "Nhà đất bán" : "Cho thuê"}</div>
                  <span style={{ fontSize: 12, color: "#8A93A6", fontWeight: 500 }}>{list.length} tin</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {list.map((p) => {
                    const tc = typeChip(p.mode); const bc = badgeChip(p.badge);
                    const unit = p.mode === "rent" ? "/ tháng" : p.beds === 0 ? `· ${p.area}m²` : "";
                    return (
                      <div key={p.id} onClick={() => openDetail(p.id)} style={{ cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,134,11,0.14)", borderRadius: 16, overflow: "hidden" }}>
                        <div style={{ height: 140, position: "relative", background: imgBg(p.g), display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 52, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.35))", opacity: 0.9 }}>{p.emoji}</span>
                          <div style={{ position: "absolute", top: 11, left: 11, display: "flex", gap: 6 }}>
                            <span style={tc.style}>{tc.text}</span>
                            {bc && <span style={bc.style}>{bc.text}</span>}
                          </div>
                          <div style={{ position: "absolute", top: 11, right: 11, width: 32, height: 32, borderRadius: "50%", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.5 6 4.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.4 0 4.7 3.5 3.2 6.5C19 15.4 12 20 12 20z" stroke="#E8C97A" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                          </div>
                        </div>
                        <div style={{ padding: "13px 15px 15px" }}>
                          <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.25 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "#8A93A6", marginTop: 4, fontWeight: 400 }}>📍 {p.address}</div>
                          <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12, color: "#B6C0D2", fontWeight: 500 }}><span>🛏 {p.beds}</span><span>🚿 {p.baths}</span><span>📐 {p.area}m²</span></div>
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(184,134,11,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 19, fontWeight: 800, color: "#E8C97A" }}>{p.price}</span>
                            <span style={{ fontSize: 11.5, color: "#8A93A6", fontWeight: 500 }}>{unit}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* agent card */}
              <div style={{ padding: "24px 20px 0" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A93A6", fontWeight: 700, marginBottom: 11 }}>Chuyên viên phụ trách</div>
                <div style={{ background: "linear-gradient(150deg,rgba(184,134,11,0.12),rgba(255,255,255,0.03))", border: "1px solid rgba(184,134,11,0.25)", borderRadius: 18, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#B8860B,#8A6608)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#0F172A", flexShrink: 0 }}>LM</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 17, fontWeight: 700 }}>Lê Hoàng Minh</span><span style={{ width: 16, height: 16, borderRadius: "50%", background: "#B8860B", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0F172A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div>
                      <div style={{ fontSize: 12, color: "#8A93A6", marginTop: 3 }}>Chuyên viên cao cấp · BĐS nghỉ dưỡng</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}><span style={{ fontSize: 12.5, fontWeight: 700, color: "#E8C97A" }}>⭐ 4.9</span><span style={{ fontSize: 11.5, color: "#8A93A6" }}>· 186 đánh giá</span></div>
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: 15, borderTop: "1px solid rgba(184,134,11,0.18)", paddingTop: 14 }}>
                    {[["340+", "Giao dịch"], ["9 năm", "Kinh nghiệm"], ["98%", "Hài lòng"]].map(([v, l], i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(184,134,11,0.18)" : "none" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#E8ECF3" }}>{v}</div><div style={{ fontSize: 10.5, color: "#8A93A6", marginTop: 3, fontWeight: 500 }}>{l}</div></div>
                    ))}
                  </div>
                  <button onClick={() => { setListingId(null); setFromAgent(true); setScreen("consult"); }} style={{ marginTop: 15, width: "100%", height: 46, background: "#B8860B", border: "none", borderRadius: 11, color: "#0F172A", fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: "0.02em", fontFamily: SANS }}>Yêu cầu tư vấn</button>
                </div>
                <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 22, fontSize: 12.5, color: "#8A93A6", fontWeight: 600 }}>← Về trang chủ zeebee.vn</Link>
              </div>
            </div>
          )}

          {/* DETAIL */}
          {screen === "detail" && d && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96 }} className="dc-noscroll">
                <div style={{ height: 280, position: "relative", background: imgBg(d.g), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 96, filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.45))", opacity: 0.92 }}>{d.emoji}</span>
                  <button onClick={() => setScreen("home")} style={{ position: "absolute", top: 54, left: 20, width: 38, height: 38, borderRadius: "50%", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", border: "0.5px solid rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <div style={{ position: "absolute", top: 54, right: 20, display: "flex", gap: 8 }}>
                    <span style={typeChip(d.mode).style}>{typeChip(d.mode).text}</span>
                    {badgeChip(d.badge) && <span style={badgeChip(d.badge)!.style}>{badgeChip(d.badge)!.text}</span>}
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.18, letterSpacing: "-0.01em" }}>{d.name}</div>
                  <div style={{ fontSize: 13, color: "#8A93A6", marginTop: 6, fontWeight: 400 }}>📍 {d.address}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#E8C97A", marginTop: 14 }}>{d.price} <span style={{ fontSize: 13, color: "#8A93A6", fontWeight: 500 }}>{d.mode === "rent" ? "/ tháng" : ""}</span></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 18 }}>
                    {(d.beds === 0 ? [{ icon: "📐", value: `${d.area}m²`, label: "Diện tích" }, { icon: "📜", value: "Thổ cư", label: "Pháp lý" }, { icon: "🛣️", value: "12m", label: "Mặt tiền" }] : [{ icon: "🛏", value: d.beds, label: "Phòng ngủ" }, { icon: "🚿", value: d.baths, label: "Phòng tắm" }, { icon: "📐", value: `${d.area}m²`, label: "Diện tích" }]).map((s, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,134,11,0.14)", borderRadius: 13, padding: "13px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 21 }}>{s.icon}</div><div style={{ fontSize: 15, fontWeight: 800, marginTop: 6 }}>{s.value}</div><div style={{ fontSize: 10, color: "#8A93A6", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A93A6", fontWeight: 700, margin: "22px 0 9px" }}>Mô tả</div>
                  <div style={{ fontSize: 13.5, color: "#B6C0D2", lineHeight: 1.7, fontWeight: 400 }}>{d.desc}</div>
                  <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A93A6", fontWeight: 700, margin: "22px 0 11px" }}>Tiện ích</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {d.features.map((ft, i) => <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#C4CDDC", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,134,11,0.14)", borderRadius: 9, padding: "8px 12px" }}>{ft.icon} {ft.label}</span>)}
                  </div>
                  <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,134,11,0.18)", borderRadius: 14, padding: "13px 15px" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#B8860B,#8A6608)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#0F172A", flexShrink: 0 }}>LM</div>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 700 }}>Lê Hoàng Minh</div><div style={{ fontSize: 11.5, color: "#8A93A6" }}>Chuyên viên phụ trách · ⭐ 4.9</div></div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#0F172A 74%,rgba(15,23,42,0))", zIndex: 40 }}>
                <button onClick={() => { setFromAgent(false); setScreen("consult"); }} style={{ width: "100%", height: 54, background: "#B8860B", border: "none", borderRadius: 14, color: "#0F172A", fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 8px 24px rgba(184,134,11,0.32)", fontFamily: SANS }}>Yêu cầu tư vấn</button>
              </div>
            </div>
          )}

          {/* CONSULT */}
          {screen === "consult" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#0F172A", padding: "54px 20px 13px", display: "flex", alignItems: "center", gap: 13, borderBottom: "1px solid rgba(184,134,11,0.16)" }}>
                <button onClick={() => setScreen(fromAgent ? "home" : "detail")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(184,134,11,0.25)", background: "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#E8ECF3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Yêu cầu tư vấn</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 110px" }} className="dc-noscroll">
                {cs.hasListing && d && (
                  <div style={{ display: "flex", gap: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,134,11,0.16)", borderRadius: 14, padding: 13 }}>
                    <div style={cs.imgStyle}>{cs.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{cs.name}</div>
                      <div style={{ fontSize: 11.5, color: "#8A93A6", marginTop: 3 }}>📍 {cs.address}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#E8C97A", marginTop: 7 }}>{cs.priceText}</div>
                    </div>
                  </div>
                )}

                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A93A6", fontWeight: 700, margin: "22px 0 11px" }}>Loại yêu cầu</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {REQ_TYPES.map((r) => {
                    const active = reqType === r.id;
                    return (
                      <button key={r.id} onClick={() => setReqType(r.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", border: active ? "1.5px solid #B8860B" : "1px solid rgba(184,134,11,0.18)", background: active ? "rgba(184,134,11,0.08)" : "rgba(255,255,255,0.04)", color: "#E8ECF3", borderRadius: 13, padding: "13px 15px", cursor: "pointer", textAlign: "left", fontFamily: SANS }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 20 }}>{r.icon}</span><span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.3 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{r.label}</span><span style={{ fontSize: 11.5, opacity: 0.7, fontWeight: 400 }}>{r.desc}</span></span></span>
                        <span style={{ width: 20, height: 20, borderRadius: "50%", border: active ? "none" : "1.5px solid rgba(184,134,11,0.4)", background: active ? "rgba(184,134,11,0.18)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{active && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#B8860B" }} />}</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A93A6", fontWeight: 700, margin: "22px 0 11px" }}>Thông tin liên hệ</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div><label style={reLabel}>Họ và tên</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="VD: Nguyễn Hữu Phước" style={inputStyle} /></div>
                  <div><label style={reLabel}>Số điện thoại</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} inputMode="numeric" placeholder="VD: 0911 234 567" style={inputStyle} /></div>
                  <div><label style={reLabel}>Thời gian thuận tiện</label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{TIMES.map((tt) => { const active = timeSlot === tt; return <button key={tt} onClick={() => setTimeSlot(tt)} style={{ border: active ? "none" : "1px solid rgba(184,134,11,0.22)", background: active ? "#B8860B" : "rgba(255,255,255,0.04)", color: active ? "#0F172A" : "#C4CDDC", borderRadius: 100, padding: "8px 15px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>{tt}</button>; })}</div></div>
                  <div><label style={reLabel}>Ghi chú <span style={{ color: "#6B7689" }}>(không bắt buộc)</span></label><textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} placeholder="VD: quan tâm pháp lý sổ hồng · cần vay ngân hàng…" style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} /></div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#0F172A 74%,rgba(15,23,42,0))", zIndex: 40 }}>
                {error && <div style={{ textAlign: "center", color: "#F0A868", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{error}</div>}
                <button onClick={submit} disabled={!canSubmit || submitting} style={{ width: "100%", height: 54, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, letterSpacing: "0.02em", cursor: canSubmit && !submitting ? "pointer" : "not-allowed", color: canSubmit ? "#0F172A" : "#5A6273", background: canSubmit ? "#B8860B" : "#3A4250", boxShadow: canSubmit ? "0 8px 24px rgba(184,134,11,0.32)" : "none", fontFamily: SANS }}>{submitting ? "Đang gửi…" : canSubmit ? "Yêu cầu tư vấn" : "Vui lòng điền thông tin"}</button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {screen === "success" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "54px 28px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#B8860B,#8A6608)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 38px rgba(184,134,11,0.36)", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, marginTop: 24, lineHeight: 1.15, letterSpacing: "-0.01em", animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Đã nhận yêu cầu</div>
              <div style={{ fontSize: 14.5, color: "#8A93A6", marginTop: 9, lineHeight: 1.6, maxWidth: 290, fontWeight: 400, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Chuyên viên Lê Hoàng Minh sẽ liên hệ với bạn trong vòng <strong style={{ color: "#E8C97A" }}>2 giờ</strong> để hỗ trợ. Cảm ơn bạn đã quan tâm! ✨</div>
              <div style={{ marginTop: 26, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,134,11,0.2)", borderRadius: 16, padding: 18, textAlign: "left", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#8A93A6", marginBottom: 11 }}><span>Mã yêu cầu</span><span style={{ fontWeight: 700, color: "#E8ECF3", fontVariantNumeric: "tabular-nums" }}>{orderCode}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#8A93A6", marginBottom: cs.hasListing ? 11 : 0 }}><span>Loại</span><span style={{ fontWeight: 600, color: "#E8ECF3", textAlign: "right" }}>{reqLabel}</span></div>
                {cs.hasListing && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#8A93A6" }}><span>BĐS</span><span style={{ fontWeight: 600, color: "#E8ECF3", textAlign: "right", maxWidth: 200 }}>{cs.name}</span></div>}
              </div>
              <button onClick={home} style={{ marginTop: 24, width: "100%", height: 52, background: "#B8860B", border: "none", borderRadius: 13, color: "#0F172A", fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 8px 22px rgba(184,134,11,0.3)", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both", fontFamily: SANS }}>Về trang chủ</button>
              <Link href="/" style={{ marginTop: 16, fontSize: 12.5, color: "#8A93A6", fontFamily: SANS }}>← Về trang chủ zeebee.vn</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#0F172A", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" };
const reLabel: CSSProperties = { fontSize: 12, color: "#8A93A6", fontWeight: 600, display: "block", marginBottom: 5 };
function toggleStyle(on: boolean): CSSProperties { return { flex: 1, border: "none", borderRadius: 9, padding: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer", background: on ? "#B8860B" : "transparent", color: on ? "#0F172A" : "#8A93A6", fontFamily: SANS }; }

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
