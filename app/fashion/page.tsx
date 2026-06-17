"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";

const SER = "var(--font-cormorant), serif";
const SANS = "var(--font-dm-sans), sans-serif";
const SHIP = 30000;

type ColorKey = "trang" | "be" | "olive" | "den" | "navy" | "nau" | "hong";
const COLORS: Record<ColorKey, { name: string; hex: string }> = {
  trang: { name: "Trắng", hex: "#F4F2EC" },
  be: { name: "Be", hex: "#E0D5C2" },
  olive: { name: "Xanh rêu", hex: "#4B6F44" },
  den: { name: "Đen", hex: "#1A1A1A" },
  navy: { name: "Navy", hex: "#2C3A55" },
  nau: { name: "Nâu đất", hex: "#8B6F52" },
  hong: { name: "Hồng đất", hex: "#C29089" },
};

type Item = {
  id: string; name: string; price: number; orig?: number; tag?: "new" | "bestseller" | "last";
  emoji: string; g: [string, string]; sizes: string[]; colors: ColorKey[]; desc: string; guide: string;
};

const CATALOG: Item[] = [
  { id: "linen", name: "Áo sơ mi linen", price: 480000, tag: "new", emoji: "👔", g: ["#EDEBE4", "#D5CFBF"], sizes: ["S", "M", "L", "XL"], colors: ["trang", "be", "olive"], desc: "Linen 100% · form rộng nhẹ · thoáng mát. Đường may tỉ mỉ, tông trầm dễ phối cho cả ngày đi biển lẫn đi làm.", guide: "Sản phẩm may form rộng. Nếu thích dáng vừa ôm, hãy chọn nhỏ hơn 1 size so với thường ngày." },
  { id: "dam", name: "Đầm suông cotton", price: 620000, orig: 780000, tag: "bestseller", emoji: "👗", g: ["#E8E2EB", "#D3C9DC"], sizes: ["S", "M", "L"], colors: ["den", "be", "hong"], desc: "Đầm suông dáng dài, chất cotton mềm rũ. Thiết kế tối giản, tôn dáng mà vẫn thoải mái cả ngày dài.", guide: "Dáng suông rộng rãi. Chọn đúng size thường ngày để có phom chuẩn nhất." },
  { id: "quan", name: "Quần ống rộng", price: 520000, emoji: "👖", g: ["#E4E7EC", "#CCD2DC"], sizes: ["S", "M", "L", "XL"], colors: ["den", "navy", "be"], desc: "Quần ống rộng cạp cao, tôn chân. Chất vải đứng phom, giữ nếp tốt, phối được với hầu hết áo trong tủ.", guide: "Cạp cao ôm eo. Nếu phân vân giữa hai size, ưu tiên size lớn hơn cho phần hông." },
  { id: "tote", name: "Túi tote canvas", price: 280000, tag: "new", emoji: "👜", g: ["#EAE6DD", "#D5CCBB"], sizes: ["Freesize"], colors: ["be", "den", "olive"], desc: "Túi tote vải canvas dày dặn, quai chắc. Đủ rộng cho laptop 14″ và vật dụng đi làm hằng ngày.", guide: "Một kích cỡ duy nhất (Freesize) · 38 × 34 cm." },
  { id: "blazer", name: "Blazer dáng dài", price: 890000, tag: "last", emoji: "🧥", g: ["#E3E4E8", "#C8CAD4"], sizes: ["S", "M", "L"], colors: ["den", "be", "navy"], desc: "Blazer dáng dài, ve áo thanh, đệm vai nhẹ. Item chủ lực nâng tầm mọi set đồ tối giản.", guide: "May vừa vặn theo phom chuẩn. Nếu mặc kèm áo dày bên trong, chọn lớn hơn 1 size." },
  { id: "khan", name: "Khăn lụa vẽ tay", price: 180000, tag: "new", emoji: "🧣", g: ["#ECE6E2", "#D9CFC7"], sizes: ["Freesize"], colors: ["hong", "olive", "be"], desc: "Khăn lụa mềm, hoạ tiết vẽ tay tông trầm. Quàng cổ, buộc túi hay cài tóc đều hợp.", guide: "Một kích cỡ duy nhất (Freesize) · 70 × 70 cm." },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";
const prod = (id: string | null) => CATALOG.find((p) => p.id === id);
const badgeText = (t?: string) => (t === "new" ? "New" : t === "bestseller" ? "Bestseller" : t === "last" ? "Last pieces" : "");
function swatch(hex: string, size: number): CSSProperties {
  return { width: size, height: size, borderRadius: "50%", background: hex, display: "block", boxShadow: hex === "#F4F2EC" ? "inset 0 0 0 1px rgba(17,24,39,0.16)" : "none" };
}

export default function FashionPage() {
  const [screen, setScreen] = useState<"catalog" | "product" | "order" | "success">("catalog");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<ColorKey | null>(null);
  const [sort, setSort] = useState<"new" | "price">("new");
  const [wish, setWish] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [selSize, setSelSize] = useState<string | null>(null);
  const [selColor, setSelColor] = useState<ColorKey | null>(null);
  const [qty, setQty] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ckey = (id: string, s: string, c: string) => `${id}|${s}|${c}`;
  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const subtotal = useMemo(() => Object.entries(cart).reduce((sum, [k, q]) => sum + (prod(k.split("|")[0])?.price || 0) * q, 0), [cart]);
  const ship = cartCount > 0 ? SHIP : 0;

  function toggleWish(id: string) { setWish((w) => { const n = { ...w }; if (n[id]) delete n[id]; else n[id] = true; return n; }); }
  function openProduct(id: string) {
    const p = prod(id)!;
    setActiveId(id); setImgIdx(0); setSelSize(p.sizes.length === 1 ? p.sizes[0] : null); setSelColor(null); setQty(1); setGuideOpen(false); setJustAdded(false); setScreen("product");
  }
  function addCart(id: string, s: string, c: string, q: number) { setCart((st) => ({ ...st, [ckey(id, s, c)]: (st[ckey(id, s, c)] || 0) + q })); }
  function incLine(k: string) { setCart((st) => ({ ...st, [k]: st[k] + 1 })); }
  function decLine(k: string) { setCart((st) => { const n = { ...st }; const v = n[k] - 1; if (v <= 0) delete n[k]; else n[k] = v; return n; }); }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let l = CATALOG.filter((p) => (q === "" || p.name.toLowerCase().includes(q)) && (sizeFilter === null || p.sizes.includes(sizeFilter)) && (colorFilter === null || p.colors.includes(colorFilter)));
    if (sort === "price") l = [...l].sort((a, b) => a.price - b.price);
    return l;
  }, [search, sizeFilter, colorFilter, sort]);

  const cartItems = Object.entries(cart).map(([k, q]) => {
    const [id, size, color] = k.split("|");
    const p = prod(id)!;
    return { key: k, id, size, color, qty: q, name: p.name, emoji: p.emoji, g: p.g, line: p.price * q };
  });
  const canConfirm = !!(cartCount > 0 && form.name.trim() && form.phone.trim() && form.address.trim());
  const p = prod(activeId);
  const canAdd = !!(p && selSize && selColor);

  async function handleConfirm() {
    if (!canConfirm || submitting) return;
    setSubmitting(true); setError("");
    const note = [
      "[Đơn thời trang NHÃ]",
      cartItems.map((it) => `${it.name} (Size ${it.size} · ${it.color}) x${it.qty}`).join(", "),
      `Tổng: ${fmt(subtotal + ship)}`,
      `Địa chỉ: ${form.address}`,
      form.note ? `Ghi chú: ${form.note}` : "",
    ].filter(Boolean).join(" · ");
    try {
      const res = await fetch("/api/owners/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), note, category: "fashion" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi đơn thất bại");
      setOrderCode("NH" + Math.floor(100000 + Math.random() * 900000));
      setScreen("success");
    } catch (err) { setError(err instanceof Error ? err.message : "Có lỗi xảy ra"); } finally { setSubmitting(false); }
  }
  function newOrder() { setCart({}); setForm({ name: "", phone: "", address: "", note: "" }); setSearch(""); setSearchOpen(false); setSizeFilter(null); setColorFilter(null); setScreen("catalog"); }

  const angles = ["150deg", "120deg", "180deg"];

  return (
    <div style={frameOuter}>
      <style>{KEYFRAMES}</style>
      <div style={device}>
        <div style={{ height: "100%", background: "#FAFAFA", fontFamily: SANS, color: "#111827", display: "flex", flexDirection: "column", position: "relative" }}>

          {/* CATALOG */}
          {screen === "catalog" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(250,250,250,0.92)", backdropFilter: "saturate(120%)", padding: "52px 20px 14px", borderBottom: "1px solid rgba(17,24,39,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <button onClick={() => setSearchOpen((s) => !s)} style={iconBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#111827" strokeWidth="1.6" /><path d="M20 20l-3.4-3.4" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </button>
                  <div style={{ textAlign: "center", lineHeight: 1 }}>
                    <div style={{ fontFamily: SER, fontSize: 30, fontWeight: 600, letterSpacing: "0.18em", paddingLeft: "0.18em" }}>NHÃ</div>
                    <div style={{ fontSize: 9.5, letterSpacing: "0.24em", color: "#8A8780", marginTop: 3, textTransform: "uppercase" }}>Tối giản · tinh tế</div>
                  </div>
                  <button onClick={() => cartCount > 0 && setScreen("order")} style={{ ...iconBtn, position: "relative" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 8h12l-1 12H7L6 8z" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="#111827" strokeWidth="1.5" /></svg>
                    {cartCount > 0 && <span style={{ position: "absolute", top: 1, right: 1, minWidth: 15, height: 15, padding: "0 3px", borderRadius: 8, background: "#111827", color: "#fff", fontSize: 9, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
                  </button>
                </div>
                {searchOpen && (
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(17,24,39,0.14)", borderRadius: 8, padding: "9px 12px", background: "#fff" }}>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm sản phẩm…" style={{ border: "none", background: "transparent", flex: 1, fontSize: 14, color: "#111827", minWidth: 0, fontFamily: SANS }} />
                  </div>
                )}
              </div>

              <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30 }} className="dc-noscroll">
                {/* hero */}
                <div onClick={() => openProduct("linen")} style={{ margin: "16px 20px 0", borderRadius: 14, overflow: "hidden", cursor: "pointer", position: "relative", background: "linear-gradient(135deg,#EDEBE4,#D6D0C0)", minHeight: 230, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 22 }}>
                  <div style={{ position: "absolute", top: 20, left: 22, fontSize: 10, letterSpacing: "0.26em", color: "#4B6F44", fontWeight: 600, textTransform: "uppercase" }}>New Arrival</div>
                  <div style={{ position: "absolute", top: 34, right: 18, fontSize: 96, lineHeight: 1, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.12))", opacity: 0.95 }}>👗</div>
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ fontFamily: SER, fontSize: 34, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.01em", maxWidth: 220 }}>Bộ sưu tập <span style={{ fontStyle: "italic" }}>Thu</span> 2026</div>
                    <div style={{ fontSize: 12, color: "#5C5A54", marginTop: 8, maxWidth: 215, lineHeight: 1.5 }}>Những thiết kế tối giản · tông trầm · cho mùa chuyển.</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 14, background: "#111827", color: "#fff", borderRadius: 100, padding: "9px 18px", fontSize: 12, fontWeight: 500, letterSpacing: "0.02em" }}>Khám phá
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </div>

                {/* filters */}
                <div style={{ padding: "20px 20px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                    <div style={{ fontFamily: SER, fontSize: 23, fontWeight: 600 }}>Bộ sưu tập</div>
                    <button onClick={() => setSort((s) => (s === "new" ? "price" : "new"))} style={{ display: "flex", alignItems: "center", gap: 5, border: "none", background: "transparent", cursor: "pointer", fontSize: 11.5, color: "#5C5A54", fontWeight: 500, letterSpacing: "0.02em", padding: 0, fontFamily: SANS }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M6 12h12M10 18h4" stroke="#5C5A54" strokeWidth="1.7" strokeLinecap="round" /></svg>{sort === "price" ? "Giá thấp → cao" : "Mới nhất"}
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, overflowX: "auto", paddingBottom: 6 }} className="dc-noscroll">
                    {["Tất cả", "S", "M", "L", "XL"].map((label) => {
                      const val = label === "Tất cả" ? null : label;
                      const active = sizeFilter === val;
                      return <button key={label} onClick={() => setSizeFilter(val)} style={{ flexShrink: 0, minWidth: 34, height: 32, padding: "0 13px", borderRadius: 100, cursor: "pointer", fontSize: 12, fontWeight: 500, letterSpacing: "0.02em", border: active ? "1px solid #111827" : "1px solid rgba(17,24,39,0.16)", background: active ? "#111827" : "#fff", color: active ? "#fff" : "#5C5A54", fontFamily: SANS }}>{label}</button>;
                    })}
                    <span style={{ width: 1, height: 20, background: "rgba(17,24,39,0.12)", flexShrink: 0, margin: "0 2px" }} />
                    {(["trang", "be", "olive", "den", "hong"] as ColorKey[]).map((key) => {
                      const active = colorFilter === key;
                      return <button key={key} onClick={() => setColorFilter(active ? null : key)} title={COLORS[key].name} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", border: active ? "1.5px solid #111827" : "1.5px solid transparent", background: "transparent" }}><span style={swatch(COLORS[key].hex, 20)} /></button>;
                    })}
                  </div>
                </div>

                {/* grid */}
                {filtered.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "8px 20px 0" }}>
                    {filtered.map((it) => {
                      const wished = !!wish[it.id];
                      return (
                        <div key={it.id} onClick={() => openProduct(it.id)} style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}>
                          <div style={{ position: "relative", aspectRatio: "3 / 4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(150deg, ${it.g[0]}, ${it.g[1]})` }}>
                            <span style={{ fontSize: 62, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}>{it.emoji}</span>
                            {it.tag && <div style={{ position: "absolute", top: 9, left: 9, background: it.tag === "last" ? "#111827" : it.tag === "bestseller" ? "#4B6F44" : "rgba(255,255,255,0.9)", color: it.tag === "new" ? "#111827" : "#fff", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 4 }}>{badgeText(it.tag)}</div>}
                            <button onClick={(e) => { e.stopPropagation(); toggleWish(it.id); }} style={{ position: "absolute", top: 9, right: 9, width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.82)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "#4B6F44" : "none"}><path d="M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.5 6 4.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.4 0 4.7 3.5 3.2 6.5C19 15.4 12 20 12 20z" stroke={wished ? "#4B6F44" : "#111827"} strokeWidth="1.5" strokeLinejoin="round" /></svg>
                            </button>
                          </div>
                          <div style={{ fontFamily: SER, fontSize: 18, fontWeight: 600, lineHeight: 1.2, marginTop: 9 }}>{it.name}</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 2 }}>
                            {it.orig && <span style={{ fontSize: 11, color: "#B0ADA8", textDecoration: "line-through" }}>{fmt(it.orig)}</span>}
                            <span style={{ fontFamily: SER, fontSize: 17, fontWeight: 600, color: it.orig ? "#4B6F44" : "#111827" }}>{fmt(it.price)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "50px 20px", color: "#8A8780", fontSize: 14 }}>Không có sản phẩm phù hợp bộ lọc.</div>
                )}
              </div>
            </div>
          )}

          {/* PRODUCT DETAIL */}
          {screen === "product" && p && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96 }} className="dc-noscroll">
                <div style={{ position: "relative", width: "100%", height: 440, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(${angles[imgIdx]}, ${p.g[0]}, ${p.g[1]})` }}>
                  <span style={{ fontSize: 150, filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.12))" }}>{p.emoji}</span>
                  <button onClick={() => setScreen("catalog")} style={roundBtn(52, 18)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button onClick={() => toggleWish(p.id)} style={{ ...roundBtn(52, 18), left: "auto", right: 18 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={wish[p.id] ? "#4B6F44" : "none"}><path d="M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.5 6 4.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.4 0 4.7 3.5 3.2 6.5C19 15.4 12 20 12 20z" stroke={wish[p.id] ? "#4B6F44" : "#111827"} strokeWidth="1.5" strokeLinejoin="round" /></svg>
                  </button>
                  <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7 }}>
                    {[0, 1, 2].map((i) => <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 18 : 6, height: 6, borderRadius: 100, border: "none", cursor: "pointer", padding: 0, transition: "width .25s", background: i === imgIdx ? "#111827" : "rgba(17,24,39,0.3)" }} />)}
                  </div>
                </div>

                <div style={{ padding: "20px 22px 0" }}>
                  {p.tag && <div style={{ fontSize: 10, letterSpacing: "0.22em", color: "#4B6F44", fontWeight: 600, textTransform: "uppercase", marginBottom: 7 }}>{badgeText(p.tag)}</div>}
                  <div style={{ fontFamily: SER, fontSize: 30, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                    <span style={{ fontFamily: SER, fontSize: 26, fontWeight: 600, color: p.orig ? "#4B6F44" : "#111827" }}>{fmt(p.price)}</span>
                    {p.orig && <span style={{ fontSize: 14, color: "#B0ADA8", textDecoration: "line-through" }}>{fmt(p.orig)}</span>}
                    {p.orig && <span style={{ fontSize: 11, fontWeight: 600, color: "#4B6F44", background: "rgba(75,111,68,0.1)", borderRadius: 4, padding: "2px 7px" }}>-{Math.round((1 - p.price / p.orig) * 100)}%</span>}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 10 }}>
                    <div style={uplabel}>Kích cỡ</div>
                    <button onClick={() => setGuideOpen((g) => !g)} style={{ fontSize: 11.5, color: "#4B6F44", fontWeight: 500, border: "none", background: "transparent", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2, padding: 0, fontFamily: SANS }}>Hướng dẫn chọn size</button>
                  </div>
                  <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                    {p.sizes.map((label) => {
                      const sel = selSize === label;
                      return <button key={label} onClick={() => { setSelSize(label); setJustAdded(false); }} style={{ minWidth: p.sizes.length <= 1 ? "auto" : 46, padding: p.sizes.length <= 1 ? "0 20px" : 0, height: 44, borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 600, border: sel ? "1.5px solid #111827" : "1px solid rgba(17,24,39,0.16)", background: sel ? "#111827" : "#fff", color: sel ? "#fff" : "#111827", fontFamily: SANS }}>{label}</button>;
                    })}
                  </div>
                  {guideOpen && <div style={{ marginTop: 12, background: "#fff", border: "1px solid rgba(17,24,39,0.08)", borderRadius: 10, padding: "13px 15px", fontSize: 12.5, lineHeight: 1.6, color: "#5C5A54" }}>{p.guide}</div>}

                  <div style={{ ...uplabel, marginTop: 24, marginBottom: 10, display: "flex", gap: 8, alignItems: "baseline" }}>Màu sắc <span style={{ fontFamily: SER, fontSize: 15, letterSpacing: 0, textTransform: "none", color: "#111827", fontWeight: 500, fontStyle: "italic" }}>{selColor ? COLORS[selColor].name : "Chọn màu"}</span></div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {p.colors.map((key) => {
                      const sel = selColor === key;
                      return <button key={key} onClick={() => { setSelColor(key); setJustAdded(false); }} title={COLORS[key].name} style={{ width: 38, height: 38, borderRadius: "50%", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", border: sel ? "1.5px solid #111827" : "1.5px solid rgba(17,24,39,0.12)", background: "transparent" }}><span style={swatch(COLORS[key].hex, 26)} /></button>;
                    })}
                  </div>

                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(17,24,39,0.08)" }}>
                    <div style={{ fontFamily: SER, fontSize: 19, fontWeight: 600, marginBottom: 7 }}>Mô tả</div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "#4D4B45" }}>{p.desc}</div>
                  </div>
                </div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#FAFAFA 74%,rgba(250,250,250,0))", zIndex: 40 }}>
                {justAdded && <div style={{ textAlign: "center", fontSize: 12, color: "#4B6F44", fontWeight: 600, marginBottom: 9 }}>✓ Đã thêm vào giỏ</div>}
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(17,24,39,0.16)", borderRadius: 10, height: 50 }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 38, height: 50, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "#111827" }}>−</button>
                    <span style={{ minWidth: 22, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} style={{ width: 38, height: 50, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "#111827" }}>+</button>
                  </div>
                  <button onClick={() => { if (canAdd) { addCart(p.id, selSize!, COLORS[selColor!].name, qty); setJustAdded(true); } }} style={{ flex: 1, height: 50, border: "1px solid #111827", background: "transparent", color: "#111827", borderRadius: 10, fontSize: 13.5, fontWeight: 600, letterSpacing: "0.02em", cursor: "pointer", opacity: canAdd ? 1 : 0.5, fontFamily: SANS }}>Thêm vào giỏ</button>
                  <button onClick={() => { if (canAdd) { addCart(p.id, selSize!, COLORS[selColor!].name, qty); setScreen("order"); } }} style={{ flex: 1, height: 50, border: "none", background: "#111827", color: "#fff", borderRadius: 10, fontSize: 13.5, fontWeight: 600, letterSpacing: "0.02em", cursor: "pointer", opacity: canAdd ? 1 : 0.5, fontFamily: SANS }}>Mua ngay</button>
                </div>
              </div>
            </div>
          )}

          {/* ORDER */}
          {screen === "order" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#FAFAFA", padding: "52px 20px 13px", display: "flex", alignItems: "center", gap: 13, borderBottom: "1px solid rgba(17,24,39,0.07)" }}>
                <button onClick={() => setScreen("catalog")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(17,24,39,0.13)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ fontFamily: SER, fontSize: 24, fontWeight: 600 }}>Đơn hàng</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 110px" }} className="dc-noscroll">
                {cartItems.length > 0 ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {cartItems.map((it) => {
                        const cObj = Object.values(COLORS).find((c) => c.name === it.color);
                        return (
                          <div key={it.key} style={{ display: "flex", gap: 13 }}>
                            <div style={{ width: 76, height: 92, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: `linear-gradient(150deg, ${it.g[0]}, ${it.g[1]})` }}>{it.emoji}</div>
                            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                              <div style={{ fontFamily: SER, fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>{it.name}</div>
                              <div style={{ fontSize: 11.5, color: "#8A8780", marginTop: 3, display: "flex", alignItems: "center", gap: 7 }}>
                                <span>Size {it.size}</span><span>·</span><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 11, height: 11, borderRadius: "50%", background: cObj?.hex || "#ccc", boxShadow: "inset 0 0 0 1px rgba(17,24,39,0.15)", display: "inline-block" }} />{it.color}</span>
                              </div>
                              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 9 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid rgba(17,24,39,0.13)", borderRadius: 8 }}>
                                  <button onClick={() => decLine(it.key)} style={{ width: 28, height: 28, border: "none", background: "transparent", fontSize: 16, cursor: "pointer", color: "#111827" }}>−</button>
                                  <span style={{ minWidth: 18, textAlign: "center", fontSize: 13, fontWeight: 600 }}>{it.qty}</span>
                                  <button onClick={() => incLine(it.key)} style={{ width: 28, height: 28, border: "none", background: "transparent", fontSize: 16, cursor: "pointer", color: "#111827" }}>+</button>
                                </div>
                                <span style={{ fontFamily: SER, fontSize: 17, fontWeight: 600 }}>{fmt(it.line)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ ...uplabel, margin: "26px 0 12px" }}>Thông tin nhận hàng</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                      <FField label="Họ và tên" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="VD: Trần Mỹ Linh" />
                      <FField label="Số điện thoại" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="VD: 0902 345 678" inputMode="numeric" />
                      <FField label="Địa chỉ giao hàng" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} placeholder="Số nhà, đường, phường…" />
                      <div>
                        <label style={fLabel}>Ghi chú <span style={{ color: "#B0ADA8" }}>(không bắt buộc)</span></label>
                        <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} placeholder="VD: Giao giờ hành chính, gọi trước khi tới…" style={{ ...fInput, resize: "none" }} />
                      </div>
                    </div>

                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(17,24,39,0.1)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#5C5A54", marginBottom: 7 }}><span>Tạm tính</span><span style={{ color: "#111827" }}>{fmt(subtotal)}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#5C5A54", marginBottom: 12 }}><span>Phí giao hàng</span><span style={{ color: "#111827" }}>{ship > 0 ? fmt(ship) : "Miễn phí"}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>Tổng cộng</span><span style={{ fontFamily: SER, fontSize: 26, fontWeight: 600 }}>{fmt(subtotal + ship)}</span></div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#8A8780" }}><div style={{ fontSize: 40, marginBottom: 10 }}>🛍️</div><div style={{ fontSize: 14 }}>Giỏ hàng đang trống.</div></div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top,#FAFAFA 74%,rgba(250,250,250,0))", zIndex: 40 }}>
                  {error && <div style={{ textAlign: "center", color: "#C0392B", fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>{error}</div>}
                  <button onClick={handleConfirm} disabled={!canConfirm || submitting} style={{ width: "100%", height: 52, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", cursor: canConfirm && !submitting ? "pointer" : "not-allowed", color: "#fff", background: canConfirm ? "#111827" : "#B7B4AE", fontFamily: SANS }}>{submitting ? "Đang gửi…" : canConfirm ? "Xác nhận đơn hàng" : "Vui lòng điền thông tin"}</button>
                </div>
              )}
            </div>
          )}

          {/* SUCCESS */}
          {screen === "success" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "52px 28px 34px", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", animation: "dcPop 0.5s cubic-bezier(.16,1,.3,1) both" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontFamily: SER, fontSize: 30, fontWeight: 600, marginTop: 24, lineHeight: 1.15, animation: "dcFadeUp 0.5s 0.1s cubic-bezier(.16,1,.3,1) both" }}>Đơn hàng đã đặt</div>
              <div style={{ fontSize: 14, color: "#6B6960", marginTop: 9, lineHeight: 1.6, maxWidth: 285, animation: "dcFadeUp 0.5s 0.18s cubic-bezier(.16,1,.3,1) both" }}>Cảm ơn bạn đã chọn NHÃ. Shop sẽ liên hệ xác nhận đơn của bạn trong thời gian sớm nhất.</div>
              <div style={{ marginTop: 26, width: "100%", border: "1px solid rgba(17,24,39,0.1)", borderRadius: 12, padding: 18, textAlign: "left", background: "#fff", animation: "dcFadeUp 0.5s 0.26s cubic-bezier(.16,1,.3,1) both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#8A8780", marginBottom: 11 }}><span>Mã đơn</span><span style={{ fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{orderCode}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#8A8780", marginBottom: 11 }}><span>Người nhận</span><span style={{ fontWeight: 500, color: "#111827" }}>{form.name}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "1px solid rgba(17,24,39,0.08)" }}><span style={{ fontSize: 13, fontWeight: 600 }}>Tổng cộng</span><span style={{ fontFamily: SER, fontSize: 22, fontWeight: 600 }}>{fmt(subtotal + ship)}</span></div>
              </div>
              <button onClick={newOrder} style={{ marginTop: 24, width: "100%", height: 50, background: "#111827", border: "none", borderRadius: 10, color: "#fff", fontSize: 13.5, fontWeight: 600, letterSpacing: "0.02em", cursor: "pointer", animation: "dcFadeUp 0.5s 0.34s cubic-bezier(.16,1,.3,1) both", fontFamily: SANS }}>Tiếp tục mua sắm</button>
              <Link href="/" style={{ marginTop: 16, fontSize: 12.5, color: "#8A8780", fontFamily: SANS }}>← Về trang chủ zeebee.vn</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FField({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; inputMode?: "numeric" }) {
  return (<div><label style={fLabel}>{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} inputMode={inputMode} placeholder={placeholder} style={fInput} /></div>);
}

const frameOuter: CSSProperties = { minHeight: "100svh", background: "#E8EEFF", display: "flex", alignItems: "center", justifyContent: "center" };
const device: CSSProperties = { width: "100%", maxWidth: 390, height: "min(844px, 100svh)", overflow: "hidden", position: "relative", background: "#FAFAFA", boxShadow: "0 20px 60px rgba(17,24,39,0.18)" };
const iconBtn: CSSProperties = { width: 34, height: 34, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };
const uplabel: CSSProperties = { fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, color: "#5C5A54" };
const fLabel: CSSProperties = { fontSize: 12, color: "#5C5A54", fontWeight: 500, display: "block", marginBottom: 5 };
const fInput: CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(17,24,39,0.14)", background: "#fff", borderRadius: 8, padding: "12px 13px", fontSize: 14, color: "#111827", fontFamily: SANS };
function roundBtn(top: number, left: number): CSSProperties {
  return { position: "absolute", top, left, width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.85)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };
}

const KEYFRAMES = `
@keyframes dcFadeUp { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
@keyframes dcPop { 0% { transform: scale(0.5); opacity:0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity:1 } }
.dc-noscroll::-webkit-scrollbar { width:0; height:0; }
.dc-noscroll { scrollbar-width: none; }
`;
