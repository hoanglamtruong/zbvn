import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategory } from "@/lib/categories";
import OwnerCard, { type OwnerLite } from "@/components/OwnerCard";

export const dynamic = "force-dynamic";

async function getOwners(category: string): Promise<OwnerLite[]> {
  try {
    return await prisma.owner.findMany({
      where: { category, status: "active" },
      select: { name: true, slug: true, category: true, description: true, webStatus: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[category] owner fetch failed:", err);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = getCategory(category);
  if (!meta) notFound();

  const owners = await getOwners(category);

  return (
    <main className="flex flex-col">
      <section className="bg-[var(--stem-green)] px-5 pb-10 pt-12 text-center text-white">
        <Link href="/" className="mb-4 inline-block text-sm text-[var(--blue-light)] hover:underline">
          ← Trang chủ
        </Link>
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {meta.emoji} {meta.name}
        </h1>
        <p className="mt-2 text-[var(--blue-light)]">{meta.tagline}</p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-10">
        {owners.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {owners.map((o) => (
              <OwnerCard key={o.slug} owner={o} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-4xl">{meta.emoji}</p>
            <h2 className="mt-4 text-lg font-bold text-[var(--ink)]">
              Chưa có Owner trong ngành {meta.name}
            </h2>
            <p className="mt-2 text-gray-500">
              Là người đầu tiên! Đăng ký để Bridge build web app cho bạn.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-[var(--orange-dark)] px-6 py-3 font-semibold text-white hover:brightness-110"
            >
              Đăng ký Owner
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
