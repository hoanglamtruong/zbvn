"use client";

import LandingShell from "@/components/LandingShell";

const SERVICES = [
  { icon: "💆", name: "Chăm sóc da mặt", time: "60 phút", price: "350.000đ" },
  { icon: "💅", name: "Nail nghệ thuật", time: "45 phút", price: "200.000đ" },
  { icon: "💇", name: "Gội đầu dưỡng sinh", time: "40 phút", price: "150.000đ" },
  { icon: "🧖", name: "Massage body", time: "90 phút", price: "500.000đ" },
];

export default function SpaPage() {
  return (
    <LandingShell
      fontFamily="var(--font-montserrat)"
      heroStyle={{ background: "linear-gradient(160deg,#FDF2F8 0%,#F0FDF4 100%)" }}
      heroDark={false}
      eyebrow="zeebee.vn · Spa & Làm đẹp"
      title={<>Vẻ đẹp của khách · <span style={{ color: "#4B6F44" }}>Doanh thu của bạn</span></>}
      sub="Web app spa chuyên nghiệp · đặt lịch online · không cần biết công nghệ. ZBVN lo toàn bộ phần kỹ thuật."
      accent="#4B6F44"
      features={[
        { icon: "📅", title: "Đặt lịch online", desc: "Khách chọn dịch vụ & khung giờ ngay trên web, lịch về thẳng cho bạn." },
        { icon: "✨", title: "Hình ảnh chuyên nghiệp", desc: "Trang dịch vụ pastel sang trọng, đúng phong cách thương hiệu spa." },
        { icon: "💬", title: "Nhắc lịch tự động", desc: "Hệ thống nhắc khách trước giờ hẹn, giảm tỷ lệ no-show." },
      ]}
      demoEyebrow="Demo giao diện"
      demoTitle="Trang đặt lịch spa của bạn"
      demo={
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          <div className="px-5 py-5" style={{ background: "linear-gradient(160deg,#FDF2F8,#F0FDF4)" }}>
            <div className="text-lg font-bold text-[var(--ink)]">An Nhiên Spa</div>
            <div className="text-xs text-gray-500">Thư giãn · trẻ hoá · chăm sóc toàn diện</div>
          </div>
          <div className="space-y-2.5 p-4">
            {SERVICES.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/40 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm">{s.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--ink)]">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.time}</div>
                </div>
                <div className="text-sm font-bold text-[var(--stem-green)]">{s.price}</div>
                <button className="rounded-full bg-[var(--stem-green)] px-3 py-1.5 text-xs font-semibold text-white">Đặt</button>
              </div>
            ))}
          </div>
        </div>
      }
      ctaTitle="Đưa spa của bạn lên online"
      ctaLabel="Đăng ký cho spa của bạn"
      category="spa"
      ctaStyle={{ background: "linear-gradient(160deg,#FDF2F8,#F0FDF4)" }}
    />
  );
}
