"use client";

import LandingShell from "@/components/LandingShell";

const PROPS = [
  { name: "Căn hộ 2PN view sông", area: "68m²", price: "3.2 tỷ", loc: "Quận 2", bg: "linear-gradient(135deg,#0F172A,#334155)" },
  { name: "Nhà phố mặt tiền", area: "120m²", price: "8.5 tỷ", loc: "Quận 7", bg: "linear-gradient(135deg,#1E293B,#475569)" },
  { name: "Đất nền nghỉ dưỡng", area: "300m²", price: "1.8 tỷ", loc: "Bảo Lộc", bg: "linear-gradient(135deg,#334155,#64748B)" },
];

export default function RealEstatePage() {
  return (
    <LandingShell
      fontFamily="var(--font-montserrat)"
      heroStyle={{ background: "linear-gradient(180deg,#0F172A 0%,#1E293B 100%)" }}
      eyebrow="zeebee.vn · Bất động sản"
      title={<>Bất động sản của bạn · <span style={{ color: "#E0B341" }}>Khách hàng tìm thấy bạn</span></>}
      sub="Web app BĐS chuyên nghiệp · listing · tư vấn · không tốn phí setup. Mỗi dự án một trang riêng, sang trọng và chuẩn SEO."
      accent="#B8860B"
      features={[
        { icon: "🏡", title: "Listing chuyên nghiệp", desc: "Mỗi BĐS một card sang trọng: diện tích, giá, vị trí, hình ảnh." },
        { icon: "📍", title: "Bản đồ & vị trí", desc: "Khách xem vị trí trực quan, lọc theo khu vực dễ dàng." },
        { icon: "📞", title: "Lead tư vấn tự động", desc: "Form liên hệ gắn từng BĐS, lead về ngay cho môi giới." },
      ]}
      demoEyebrow="Demo giao diện"
      demoTitle="Trang listing BĐS của bạn"
      demo={
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-[#0F172A] shadow-2xl">
          <div className="relative h-36 overflow-hidden">
            <div className="kenburns absolute inset-0" style={{ background: "linear-gradient(135deg,#0F172A,#475569)" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#E0B341" }}>Dự án nổi bật</div>
              <div className="text-lg font-extrabold text-white">The Golden Residence</div>
            </div>
          </div>
          <div className="space-y-2.5 p-4">
            {PROPS.map((p, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                <div className="h-16 w-20 flex-shrink-0 rounded-lg" style={{ background: p.bg }} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-slate-400">📍 {p.loc} · {p.area}</div>
                  <div className="text-sm font-bold" style={{ color: "#E0B341" }}>{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      ctaTitle="Đăng ký tư vấn miễn phí"
      ctaLabel="Đăng ký tư vấn miễn phí"
      category="realestate"
      ctaStyle={{ background: "linear-gradient(180deg,#0F172A,#1E293B)" }}
      ctaDark
    />
  );
}
