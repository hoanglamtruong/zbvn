"use client";

import { useEffect, useRef, useState } from "react";
import LandingShell from "@/components/LandingShell";

/** Counts from 0 → target when it scrolls into view. */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVal(target);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        const start = performance.now();
        const dur = 1200;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          setVal(Math.round(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString("vi-VN")}{suffix}</span>;
}

function ProgressBar({ filled, total }: { filled: number; total: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pct = Math.round((filled / total) * 100);
    if (typeof IntersectionObserver === "undefined") {
      setW(pct);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        setTimeout(() => setW(pct), 100);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [filled, total]);
  return (
    <div ref={ref}>
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span>Đã tuyển</span>
        <span className="font-bold text-[#1D4ED8]">{filled}/{total} chỗ</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: `${w}%`, background: "linear-gradient(90deg,#1D4ED8,#4B6F44)" }} />
      </div>
    </div>
  );
}

const JOBS = [
  { title: "Nhân viên bán hàng", place: "Cửa hàng Quận 1", tag: "Full-time" },
  { title: "Kỹ thuật viên spa", place: "An Nhiên Spa", tag: "Part-time" },
  { title: "Phụ bếp", place: "Quán Ngon 24/7", tag: "Ca tối" },
];

export default function RecruitPage() {
  return (
    <LandingShell
      fontFamily="var(--font-montserrat)"
      heroStyle={{ background: "linear-gradient(135deg,#1D4ED8 0%,#1E40AF 100%)" }}
      eyebrow="zeebee.vn · Tuyển dụng & Đào tạo"
      title={<>Tuyển đúng người · <span style={{ color: "#A7F3D0" }}>Đào tạo đúng nghề</span></>}
      sub="Nền tảng tuyển dụng & đào tạo địa phương · kết nối nhanh · hiệu quả. Đăng tin, nhận hồ sơ, đào tạo — tất cả một nơi."
      accent="#4B6F44"
      features={[
        { icon: "🎯", title: "Tuyển đúng người", desc: "Đăng tin tuyển dụng địa phương, ứng viên phù hợp ứng tuyển ngay." },
        { icon: "🎓", title: "Đào tạo đúng nghề", desc: "Lộ trình đào tạo theo từng vị trí, nhân sự lên tay nhanh." },
        { icon: "⚡", title: "Kết nối tức thì", desc: "Hồ sơ về ngay, theo dõi tiến độ tuyển dụng trực quan." },
      ]}
      demoEyebrow="Demo giao diện"
      demoTitle="Trang tuyển dụng của bạn"
      demo={
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          <div className="px-5 py-5 text-white" style={{ background: "linear-gradient(135deg,#1D4ED8,#1E40AF)" }}>
            <div className="text-lg font-bold">ZBVN Tuyển dụng</div>
            <div className="text-xs text-white/80">Việc làm & đào tạo địa phương</div>
          </div>
          <div className="grid grid-cols-3 gap-2 p-4">
            {[
              { n: 128, s: "+", l: "Việc làm" },
              { n: 540, s: "+", l: "Ứng viên" },
              { n: 92, s: "%", l: "Tuyển thành công" },
            ].map((st, i) => (
              <div key={i} className="rounded-2xl bg-blue-50 p-3 text-center">
                <div className="text-xl font-extrabold text-[#1D4ED8]"><CountUp target={st.n} suffix={st.s} /></div>
                <div className="text-[10px] text-gray-500">{st.l}</div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-2"><ProgressBar filled={22} total={30} /></div>
          <div className="space-y-2.5 p-4">
            {JOBS.map((j, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1D4ED8]/10 text-lg">💼</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--ink)]">{j.title}</div>
                  <div className="text-xs text-gray-400">{j.place}</div>
                </div>
                <span className="rounded-full bg-[#4B6F44]/10 px-2.5 py-1 text-[10px] font-bold text-[#4B6F44]">{j.tag}</span>
              </div>
            ))}
          </div>
        </div>
      }
      ctaTitle="Đăng ký tư vấn miễn phí"
      ctaLabel="Đăng ký tư vấn miễn phí"
      category="recruit"
      ctaStyle={{ background: "linear-gradient(135deg,#1D4ED8,#1E40AF)" }}
      ctaDark
    />
  );
}
