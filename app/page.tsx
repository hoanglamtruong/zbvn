"use client";

import { useState } from "react";
import Link from "next/link";

const NGANH = [
  { icon: "🛒", name: "Bán hàng", sub: "Tạp hóa · thời trang · đồ dùng", slug: "shop" },
  { icon: "💆", name: "Spa · Làm đẹp", sub: "Nail · tóc · chăm sóc da", slug: "spa" },
  { icon: "🏪", name: "Cửa hàng", sub: "Retail · showroom · đặc sản", slug: "store" },
  { icon: "🍜", name: "Ẩm thực", sub: "Quán ăn · cà phê · bánh", slug: "fb" },
  { icon: "🏠", name: "Bất động sản", sub: "Cho thuê · mua bán · nghỉ dưỡng", slug: "realestate" },
];

const VALUES = [
  { icon: "🌐", title: "Web app chuyên nghiệp · đẹp", desc: "ZBVN build web app riêng cho cơ sở bạn tại [tên].zeebee.vn · thiết kế đẹp · đầy đủ chức năng · chuẩn SEO để Buyer tìm thấy.", highlight: true },
  { icon: "📱", title: "Nhận đơn qua Telegram", desc: "Mỗi khi có Buyer đặt hàng · bạn nhận thông báo ngay trên Telegram · xử lý đơn nhanh chóng · không bỏ lỡ khách nào." },
  { icon: "💰", title: "Miễn phí · chỉ chia sẻ khi có đơn", desc: "Không tốn chi phí setup · không phí hàng tháng · ZBVN chỉ nhận % nhỏ trên mỗi đơn hàng thực tế phát sinh." },
  { icon: "🔍", title: "Buyer tìm thấy bạn dễ dàng", desc: "Cơ sở bạn xuất hiện trên zeebee.vn · Buyer có thể tìm theo ngành · tên · khu vực. Thêm một kênh khách hàng mới bên cạnh kênh bán trực tiếp." },
  { icon: "🤝", title: "Bạn vẫn toàn quyền kinh doanh", desc: "ZBVN chỉ xây kênh · bạn tự giao hàng · tự chăm sóc khách · tự quyết giá. Quan hệ khách hàng hoàn toàn là của bạn." },
  { icon: "⚡", title: "Nhanh · đơn giản · không rắc rối", desc: "Điền form đăng ký · gửi ảnh qua Telegram · ZBVN lo phần còn lại. Web app của bạn go live trong vài ngày." },
];

const STEPS = [
  { n: 1, title: "Đăng ký", desc: "Điền form đăng ký trên zeebee.vn · thông tin cơ sở · sản phẩm · chính sách" },
  { n: 2, title: "Gửi nội dung", desc: "Gửi ảnh sản phẩm · logo · ảnh cơ sở qua Telegram theo hướng dẫn" },
  { n: 3, title: "ZBVN build", desc: "ZBVN tạo web app riêng cho cơ sở bạn · đẹp · đúng phong cách" },
  { n: 4, title: "Nhận đơn hàng", desc: "Web go live · Buyer tìm thấy · đặt hàng · bạn nhận thông báo Telegram" },
];

const FAQS = [
  { q: "Tôi có phải trả chi phí gì không?", a: "Hoàn toàn miễn phí để bắt đầu. ZBVN chỉ nhận một phần nhỏ (%) trên mỗi đơn hàng thực tế phát sinh qua web app của bạn. Không có đơn = không có chi phí." },
  { q: "Tôi cần biết gì về công nghệ không?", a: "Không cần biết gì. Bạn chỉ cần điền form và gửi ảnh qua Telegram. ZBVN lo toàn bộ phần kỹ thuật." },
  { q: "Web app của tôi trông như thế nào?", a: "Web app được thiết kế riêng theo phong cách và sản phẩm của cơ sở bạn — chuyên nghiệp, đẹp, dễ dùng trên điện thoại. Bạn xem và duyệt trước khi go live." },
  { q: "Tôi nhận thông báo đơn hàng như thế nào?", a: "Mỗi khi có Buyer đặt hàng, Telegram của bạn sẽ nhận thông báo ngay lập tức với đầy đủ thông tin đơn hàng. Bạn liên hệ Buyer và giao hàng như bình thường." },
  { q: "ZBVN có can thiệp vào việc kinh doanh của tôi không?", a: "Không. ZBVN chỉ xây và vận hành kênh bán hàng online. Bạn hoàn toàn tự quyết về giá · giao hàng · chăm sóc khách hàng · chính sách của cơ sở." },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function openModal() {
    setStatus("idle");
    setErrorMsg("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      category: String(fd.get("category") || ""),
      telegramId: String(fd.get("telegram") || "").trim(),
    };
    try {
      const res = await fetch("/api/owners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng ký thất bại");
      setStatus("ok");
      form.reset();
      setTimeout(() => setModalOpen(false), 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }

  return (
    <div className="zbvn-home">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-icon">Z</div>
          <div className="nav-name">ZB<span>VN</span></div>
        </div>
        <button className="nav-cta" onClick={openModal}>Đăng ký làm Owner →</button>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">zeebee.vn · Nền tảng kinh doanh địa phương</div>
          <h1 className="hero-title">Kênh bán hàng <span>miễn phí</span> cho cơ sở của bạn</h1>
          <p className="hero-sub">ZBVN xây web app chuyên nghiệp · đưa cơ sở bạn lên mạng · tự động nhận đơn hàng. Bạn chỉ cần tập trung làm tốt sản phẩm của mình.</p>
          <button className="btn-hero" onClick={openModal}>Đăng ký ngay · Hoàn toàn miễn phí →</button>
        </div>
      </div>

      {/* GIÁ TRỊ */}
      <div className="section">
        <div className="sec-eyebrow">Tại sao chọn ZBVN</div>
        <h2 className="sec-title">Cơ sở của bạn xứng đáng có <span>kênh bán hàng tốt hơn</span></h2>
        <p className="sec-sub">Không cần biết công nghệ · không tốn chi phí ban đầu · chỉ chia sẻ một phần nhỏ khi có đơn hàng thực tế.</p>
        <div className="val-grid">
          {VALUES.map((v) => (
            <div key={v.title} className={`val-card${v.highlight ? " highlight" : ""}`}>
              <div className="val-icon">{v.icon}</div>
              <div className="val-title">{v.title}</div>
              <div className="val-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="section alt">
        <div className="section-inner">
          <div className="sec-eyebrow">Cách hoạt động</div>
          <h2 className="sec-title">Chỉ <span>4 bước</span> để bắt đầu</h2>
          <div className="steps">
            {STEPS.map((s) => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NGÀNH */}
      <div className="section">
        <div className="sec-eyebrow">Ngành phù hợp</div>
        <h2 className="sec-title">ZBVN phục vụ <span>nhiều ngành</span></h2>
        <p className="sec-sub" style={{ marginBottom: 28 }}>Dù bạn kinh doanh gì · ZBVN đều có thể xây kênh phù hợp cho cơ sở của bạn.</p>
        <div className="nganh-grid">
          {NGANH.map((n) => (
            <Link key={n.slug} href={`/${n.slug}`} className="nganh-card">
              <div className="nganh-icon">{n.icon}</div>
              <div className="nganh-name">{n.name}</div>
              <div className="nganh-sub">{n.sub}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="section alt">
        <div className="section-inner">
          <div className="sec-eyebrow">Câu hỏi thường gặp</div>
          <h2 className="sec-title">Bạn đang <span>thắc mắc</span>?</h2>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <span className="faq-mark">{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA BOTTOM */}
      <div className="cta-bottom" id="dang-ky">
        <h2 className="cta-title">Sẵn sàng đưa cơ sở lên mạng?</h2>
        <p className="cta-sub">Đăng ký miễn phí · ZBVN liên hệ trong 24h · Web go live trong vài ngày.</p>
        <button className="btn-cta-white" onClick={openModal}>Đăng ký làm Owner →</button>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-logo">ZB<span>VN</span></div>
        <div className="footer-text">zeebee.vn · CTV Công nghệ · Owner Network</div>
      </div>

      {/* MODAL ĐĂNG KÝ */}
      {modalOpen && (
        <div className="zbvn-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="zbvn-modal" onClick={(e) => e.stopPropagation()}>
            {status === "ok" ? (
              <div className="msg-success">
                <div className="check">✅</div>
                <p>Đăng ký thành công!</p>
                <p>ZBVN sẽ liên hệ trong 24h.</p>
              </div>
            ) : (
              <>
                <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Đóng">×</button>
                <h3>Đăng ký làm Owner</h3>
                <p className="modal-sub">Điền thông tin · ZBVN liên hệ trong 24h.</p>
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label>Tên cơ sở</label>
                    <input name="name" required placeholder="VD: Cửa Hàng Xanh" />
                  </div>
                  <div className="field">
                    <label>Số điện thoại</label>
                    <input name="phone" type="tel" required placeholder="09xx xxx xxx" />
                  </div>
                  <div className="field">
                    <label>Ngành</label>
                    <select name="category" required defaultValue="">
                      <option value="" disabled>Chọn ngành…</option>
                      {NGANH.map((n) => (
                        <option key={n.slug} value={n.slug}>{n.icon} {n.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Username Telegram</label>
                    <input name="telegram" placeholder="@username (tuỳ chọn)" />
                  </div>
                  {status === "error" && <div className="msg-error">{errorMsg}</div>}
                  <button type="submit" className="btn-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Đang gửi…" : "Gửi đăng ký →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
