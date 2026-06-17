"use client";

import LandingShell from "@/components/LandingShell";

const DISHES = [
  { emoji: "🍜", name: "Phở bò tái nạm", price: "55.000đ", hot: true },
  { emoji: "🍱", name: "Cơm gà xối mỡ", price: "45.000đ", hot: true },
  { emoji: "🍰", name: "Bánh flan caramel", price: "20.000đ", hot: false },
  { emoji: "🧋", name: "Trà sữa trân châu", price: "35.000đ", hot: false },
];

export default function FbPage() {
  return (
    <LandingShell
      fontFamily="var(--font-montserrat)"
      heroStyle={{ background: "linear-gradient(135deg,#1A0F00 0%,#2D1A00 100%)" }}
      eyebrow="zeebee.vn · Ẩm thực"
      title={<>Món ngon · <span style={{ color: "#FFB454" }}>Đơn hàng tới tấp</span></>}
      sub="Web app đặt món online · giao hàng · ZBVN vận hành 24/7. Thực đơn đẹp mắt, khách đặt là bạn nhận đơn ngay."
      accent="#C05000"
      features={[
        { icon: "🍽️", title: "Thực đơn hấp dẫn", desc: "Món ăn trình bày đẹp, phân loại rõ ràng, kích thích đặt món." },
        { icon: "🛵", title: "Đặt món & giao hàng", desc: "Khách đặt online, đơn về ngay, sẵn sàng kết nối shipper." },
        { icon: "🔥", title: "Đẩy món hot", desc: "Gắn badge 🔥 cho món bán chạy, tăng giá trị mỗi đơn." },
      ]}
      demoEyebrow="Demo giao diện"
      demoTitle="Thực đơn online của quán"
      demo={
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-orange-900/40 shadow-2xl" style={{ background: "#1A0F00" }}>
          <div className="px-5 py-5" style={{ background: "linear-gradient(135deg,#C05000,#7A2E00)" }}>
            <div className="text-lg font-extrabold text-white">Quán Ngon 24/7</div>
            <div className="text-xs text-white/80">Mở cửa · giao nhanh 30 phút</div>
          </div>
          <div className="space-y-2.5 p-4">
            {DISHES.map((d, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-2xl">{d.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    {d.name}
                    {d.hot && <span className="pop-badge text-xs">🔥</span>}
                  </div>
                  <div className="text-sm font-bold text-[#FFB454]">{d.price}</div>
                </div>
                <button className="rounded-full bg-[#C05000] px-3 py-1.5 text-xs font-bold text-white">+ Thêm</button>
              </div>
            ))}
          </div>
        </div>
      }
      ctaTitle="Mở kênh đặt món online"
      ctaLabel="Mở kênh đặt món online"
      category="fb"
      ctaStyle={{ background: "linear-gradient(135deg,#1A0F00,#2D1A00)" }}
      ctaDark
    />
  );
}
