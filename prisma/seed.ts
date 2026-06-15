import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { CATEGORIES } from "../lib/categories";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: { slug: c.slug, name: c.name, description: c.description },
    });
  }

  // A couple of demo owners so category pages aren't empty on first load.
  const demo = [
    { name: "Cửa Hàng Xanh", slug: "cua-hang-xanh", category: "shop", description: "Đồ gia dụng & quà tặng", status: "active" },
    { name: "An Nhiên Spa", slug: "an-nhien-spa", category: "spa", description: "Chăm sóc da & massage", status: "active" },
  ];
  for (const o of demo) {
    await prisma.owner.upsert({ where: { slug: o.slug }, update: {}, create: o });
  }

  const cats = await prisma.category.count();
  const owners = await prisma.owner.count();
  console.log(`Seeded: ${cats} categories, ${owners} owners`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
