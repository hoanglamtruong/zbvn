import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import RegisterModal from "@/components/RegisterModal";
import SearchBar from "@/components/SearchBar";
import type { OwnerLite } from "@/components/OwnerCard";

export const dynamic = "force-dynamic";

async function getActiveOwners(): Promise<OwnerLite[]> {
  try {
    return await prisma.owner.findMany({
      where: { status: "active" },
      select: { name: true, slug: true, category: true, description: true, webStatus: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[home] owner fetch failed:", err);
    return [];
  }
}

export default async function Home() {
  const owners = await getActiveOwners();

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="bg-[var(--stem-green)] px-5 pb-14 pt-16 text-center text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--blue-light)]">
          zeebee.vn · CTV Công nghệ
        </p>
        <h1 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
          Kênh của bạn · Doanh thu của bạn
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--blue-light)] sm:text-lg">
          Nền tảng mẹ CTV Công nghệ — chúng tôi build web app cho cơ sở kinh doanh của bạn,
          bạn giữ kênh & doanh thu.
        </p>
      </section>

      {/* Search */}
      <section className="-mt-7 px-5">
        <SearchBar owners={owners} />
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-5xl px-5 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-[var(--ink)]">Danh mục ngành</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--stem-green)] hover:shadow-md"
            >
              <span className="text-4xl transition group-hover:scale-110">{c.emoji}</span>
              <span className="mt-3 font-bold text-[var(--ink)]">{c.name}</span>
              <span className="mt-1 text-xs text-gray-500">{c.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Owner */}
      <section className="mx-5 mb-14 rounded-3xl bg-[var(--blue-light)] px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-[var(--stem-green-dark)]">
          Tham gia mạng lưới Owner ZBVN
        </h2>
        <p className="mx-auto mt-2 max-w-md text-gray-600">
          Bạn có cơ sở kinh doanh? Để Bridge build web app cho bạn — chỉ thu 10% mỗi đơn.
        </p>
        <div className="mt-6 flex justify-center">
          <RegisterModal />
        </div>
      </section>

      <footer className="mt-auto border-t border-gray-200 bg-white px-5 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} zeebee.vn · ZBVN — Kênh của bạn, Doanh thu của bạn
      </footer>
    </main>
  );
}
