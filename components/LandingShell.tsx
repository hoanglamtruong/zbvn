"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import InquiryForm from "@/components/InquiryForm";

export type Feature = { icon: ReactNode; title: string; desc: string };

export default function LandingShell({
  fontFamily,
  heroStyle,
  heroDark = true,
  eyebrow,
  title,
  sub,
  accent,
  features,
  demoTitle,
  demoEyebrow,
  demo,
  ctaTitle,
  ctaLabel,
  category,
  ctaStyle,
  ctaDark = false,
}: {
  fontFamily?: string;
  heroStyle: CSSProperties;
  heroDark?: boolean;
  eyebrow: string;
  title: ReactNode;
  sub: string;
  accent: string;
  features: Feature[];
  demoEyebrow: string;
  demoTitle: string;
  demo: ReactNode;
  ctaTitle: string;
  ctaLabel: string;
  category: string;
  ctaStyle?: CSSProperties;
  ctaDark?: boolean;
}) {
  const ref = useScrollReveal<HTMLDivElement>();
  const heroText = heroDark ? "text-white" : "text-[var(--ink)]";
  const heroMuted = heroDark ? "text-white/70" : "text-gray-600";

  return (
    <main ref={ref} style={fontFamily ? { fontFamily } : undefined}>
      {/* SECTION 1 · HERO */}
      <section style={heroStyle} className="relative flex min-h-[88vh] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="reveal max-w-3xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>
            {eyebrow}
          </p>
          <h1 className={`text-4xl font-extrabold leading-tight sm:text-6xl ${heroText}`}>{title}</h1>
          <p className={`mx-auto mt-6 max-w-xl text-base sm:text-lg ${heroMuted}`}>{sub}</p>
          <a
            href="#dang-ky"
            className="cta-pulse mt-9 inline-block rounded-full px-8 py-4 text-base font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {ctaLabel} →
          </a>
        </div>
        <div className={`scroll-indicator absolute bottom-8 text-2xl ${heroDark ? "text-white/50" : "text-black/30"}`}>↓</div>
      </section>

      {/* SECTION 2 · FEATURES */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="reveal group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition group-hover:scale-110"
                style={{ backgroundColor: `${accent}1a`, color: accent }}
              >
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-[var(--ink)]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 · DEMO UI */}
      <section className="bg-[#f6f7f9] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="reveal mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
              {demoEyebrow}
            </p>
            <h2 className="text-3xl font-extrabold text-[var(--ink)]">{demoTitle}</h2>
          </div>
          <div className="reveal-zoom">{demo}</div>
        </div>
      </section>

      {/* SECTION 4 · CTA FORM */}
      <section id="dang-ky" style={ctaStyle} className="px-6 py-20">
        <div className="mx-auto max-w-md">
          <h2 className={`reveal mb-2 text-center text-3xl font-extrabold ${ctaDark ? "text-white" : "text-[var(--ink)]"}`}>
            {ctaTitle}
          </h2>
          <p className={`reveal mb-8 text-center ${ctaDark ? "text-white/70" : "text-gray-500"}`}>
            Để lại thông tin · ZBVN liên hệ trong 24h · hoàn toàn miễn phí.
          </p>
          <div className="reveal">
            <InquiryForm category={category} ctaLabel={ctaLabel} accentColor={accent} dark={ctaDark} />
          </div>
        </div>
      </section>

      {/* SECTION 5 · BACK LINK */}
      <section className="bg-white px-6 py-10 text-center">
        <Link href="/" className="text-sm font-semibold text-gray-500 transition hover:text-[var(--stem-green)]">
          ← Về trang chủ zeebee.vn
        </Link>
      </section>
    </main>
  );
}
