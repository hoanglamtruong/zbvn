"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";

export default function RegisterModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      category: String(form.get("category") || ""),
      telegramId: String(form.get("telegram") || "").trim(),
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
      setMessage("Đăng ký thành công! Bridge sẽ liên hệ với bạn sớm.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--orange-dark)] px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95"
      >
        Bạn có cơ sở kinh doanh? Tham gia ngay
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--stem-green)]">Đăng ký Owner</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-600"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            {status === "ok" ? (
              <div className="rounded-xl bg-green-50 p-5 text-center">
                <p className="text-green-700">{message}</p>
                <button
                  onClick={() => {
                    setOpen(false);
                    setStatus("idle");
                  }}
                  className="mt-4 rounded-full bg-[var(--stem-green)] px-6 py-2 font-semibold text-white"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Tên cơ sở" name="name" placeholder="VD: Cửa Hàng Xanh" required />
                <Field label="Số điện thoại" name="phone" type="tel" placeholder="09xx xxx xxx" required />
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--ink)]">Ngành</label>
                  <select
                    name="category"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-[var(--stem-green)]"
                  >
                    <option value="" disabled>
                      Chọn ngành…
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label="Telegram (tuỳ chọn)" name="telegram" placeholder="@username hoặc ID" />

                {status === "error" && <p className="text-sm text-red-600">{message}</p>}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-[var(--orange-dark)] py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  {status === "sending" ? "Đang gửi…" : "Gửi đăng ký"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[var(--ink)]">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-[var(--stem-green)]"
      />
    </div>
  );
}
