"use client";

import { useState } from "react";

export default function InquiryForm({
  category,
  ctaLabel,
  accentColor,
  dark = false,
}: {
  category: string;
  ctaLabel: string;
  accentColor: string;
  dark?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      note: String(fd.get("note") || "").trim(),
      category,
    };
    try {
      const res = await fetch("/api/owners/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }

  const labelCls = dark ? "text-white/80" : "text-[var(--ink)]";
  const inputCls = dark
    ? "bg-white/10 border-white/20 text-white placeholder-white/40"
    : "bg-white border-gray-300 text-[var(--ink)] placeholder-gray-400";

  if (status === "ok") {
    return (
      <div className={`rounded-2xl border p-8 text-center ${dark ? "border-white/20 bg-white/5" : "border-gray-200 bg-white"}`}>
        <div className="text-4xl">✅</div>
        <p className={`mt-3 text-lg font-bold ${dark ? "text-white" : "text-[var(--ink)]"}`}>
          Chúng tôi sẽ liên hệ bạn trong 24h!
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: accentColor }}
        >
          Gửi đăng ký khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`mb-1.5 block text-sm font-semibold ${labelCls}`}>Tên cơ sở</label>
        <input
          name="name"
          required
          placeholder="VD: Cửa Hàng Của Bạn"
          className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${inputCls}`}
          style={{ ["--tw-ring-color" as string]: accentColor }}
        />
      </div>
      <div>
        <label className={`mb-1.5 block text-sm font-semibold ${labelCls}`}>Số điện thoại</label>
        <input
          name="phone"
          type="tel"
          required
          placeholder="09xx xxx xxx"
          className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${inputCls}`}
          style={{ ["--tw-ring-color" as string]: accentColor }}
        />
      </div>
      <div>
        <label className={`mb-1.5 block text-sm font-semibold ${labelCls}`}>Ghi chú (tuỳ chọn)</label>
        <textarea
          name="note"
          rows={3}
          placeholder="Mô tả ngắn về cơ sở của bạn…"
          className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${inputCls}`}
          style={{ ["--tw-ring-color" as string]: accentColor }}
        />
      </div>

      {status === "error" && <p className="text-sm font-medium text-red-500">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="cta-pulse flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-70"
        style={{ backgroundColor: accentColor }}
      >
        {status === "sending" ? (
          <>
            <span className="spinner" /> Đang gửi…
          </>
        ) : (
          ctaLabel
        )}
      </button>
    </form>
  );
}
