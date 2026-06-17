"use client";

import LandingShell from "@/components/LandingShell";

const ITEMS = [
  { name: "Đặc sản vùng cao", price: "120.000đ", old: "150.000đ", stars: 5, sale: true, bg: "#4B6F44" },
  { name: "Giày thể thao", price: "650.000đ", stars: 4, bg: "#1F2937" },
  { name: "Đồng hồ thời trang", price: "890.000đ", old: "1.200.000đ", stars: 5, sale: true, bg: "#B8860B" },
];

export default function StorePage() {
  return (
    <LandingShell
      fontFamily="var(--font-montserrat)"
      heroStyle={{ background: "linear-gradient(180deg,#111827 0%,#1F2937 100%)" }}
      eyebrow="zeebee.vn · Cửa hàng"
      title={<>Cửa hàng online · <span style={{ color: "#6EE7B7" }}>Bán không ngừng nghỉ</span></>}
      sub="Từ cửa hàng vật lý → kênh online · ZBVN lo hết. Sản phẩm, đánh giá, khuyến mãi — tất cả trong một web app."
      accent="#4B6F44"
      features={[
        { icon: "🏬", title: "Toàn bộ kho lên web", desc: "Danh mục, tồn kho, giá — đồng bộ và hiển thị đẹp trên mọi thiết bị." },
        { icon: "⭐", title: "Đánh giá tạo niềm tin", desc: "Khách xem rating & review, tăng tỷ lệ chốt đơn online." },
        { icon: "🏷️", title: "Chạy khuyến mãi dễ", desc: "Gắn badge sale, giá gạch — đẩy hàng nhanh bất cứ lúc nào." },
      ]}
      demoEyebrow="Demo giao diện"
      demoTitle="Cửa hàng online của bạn"
      demo={
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-gray-700 bg-[#111827] shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-base font-bold text-white">Retail Store</div>
              <div className="text-xs text-gray-400">Đa ngành · ship toàn quốc</div>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">🛒 3</div>
          </div>
          <div className="space-y-2.5 px-4 pb-4">
            {ITEMS.map((it, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative h-16 w-16 flex-shrink-0 rounded-xl" style={{ background: it.bg }}>
                  {it.sale && <span className="pop-badge absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">SALE</span>}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{it.name}</div>
                  <div className="text-xs text-yellow-400">{"★".repeat(it.stars)}{"☆".repeat(5 - it.stars)}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-sm font-bold text-[#6EE7B7]">{it.price}</span>
                    {it.old && <span className="text-xs text-gray-500 line-through">{it.old}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      ctaTitle="Đưa cửa hàng lên mạng"
      ctaLabel="Đưa cửa hàng lên mạng"
      category="store"
      ctaStyle={{ background: "linear-gradient(180deg,#111827,#1F2937)" }}
      ctaDark
    />
  );
}
