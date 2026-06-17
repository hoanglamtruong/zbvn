"use client";

import LandingShell from "@/components/LandingShell";

const PRODUCTS = [
  { name: "Áo thun cotton", price: "180.000đ", bg: "linear-gradient(135deg,#4B6F44,#6EA15E)", badge: "-20%" },
  { name: "Túi vải canvas", price: "95.000đ", bg: "linear-gradient(135deg,#C05000,#E8814A)", badge: "HOT" },
  { name: "Bình giữ nhiệt", price: "250.000đ", bg: "linear-gradient(135deg,#1F2937,#4B5563)", badge: "Mới" },
  { name: "Sổ tay handmade", price: "60.000đ", bg: "linear-gradient(135deg,#B8860B,#E0B341)", badge: "-15%" },
];

export default function ShopPage() {
  return (
    <LandingShell
      fontFamily="var(--font-nunito)"
      heroStyle={{ background: "linear-gradient(135deg,#4B6F44 0%,#C05000 100%)" }}
      eyebrow="zeebee.vn · Bán hàng"
      title={<>Gian hàng online của bạn · <span style={{ color: "#FFE3B3" }}>Đơn hàng mỗi ngày</span></>}
      sub="ZBVN build web app bán hàng chuyên nghiệp · miễn phí setup. Bạn chỉ cần đăng sản phẩm, khách đặt hàng tự động."
      accent="#C05000"
      features={[
        { icon: "🛒", title: "Gian hàng đẹp tức thì", desc: "Grid sản phẩm chuẩn SEO, giỏ hàng, thanh toán — ZBVN dựng sẵn cho bạn." },
        { icon: "🔔", title: "Đơn về Telegram", desc: "Mỗi đơn hàng mới báo ngay Telegram, không bỏ lỡ khách nào." },
        { icon: "📈", title: "Bán thêm kênh online", desc: "Thêm doanh thu bên cạnh kênh bán trực tiếp, không tốn phí cố định." },
      ]}
      demoEyebrow="Demo giao diện"
      demoTitle="Gian hàng của bạn trông như thế này"
      demo={
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-gray-400">cuahang.zeebee.vn</span>
          </div>
          <div className="px-5 py-4" style={{ background: "linear-gradient(135deg,#4B6F44,#C05000)" }}>
            <div className="text-lg font-extrabold text-white">Cửa Hàng Xanh</div>
            <div className="text-xs text-white/80">Đồ gia dụng · quà tặng · giao nhanh</div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {PRODUCTS.map((p, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-100">
                <div className="relative h-24" style={{ background: p.bg }}>
                  <span className="pop-badge absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[var(--orange-dark)]" style={{ animationDelay: `${i * 120}ms` }}>
                    {p.badge}
                  </span>
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-bold text-[var(--ink)]">{p.name}</div>
                  <div className="text-sm font-extrabold text-[var(--orange-dark)]">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      ctaTitle="Sẵn sàng mở gian hàng?"
      ctaLabel="Đăng ký mở gian hàng"
      category="shop"
      ctaStyle={{ background: "var(--green-light)" }}
    />
  );
}
