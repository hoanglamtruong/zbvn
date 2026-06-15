export type CategoryMeta = {
  slug: string;
  name: string;
  description: string;
  tagline: string;
  emoji: string;
};

/** The 5 ZBVN industry categories. Source of truth for seed + UI. */
export const CATEGORIES: CategoryMeta[] = [
  { slug: "shop", name: "Shop", description: "Ngành bán hàng", tagline: "Cửa hàng online của bạn", emoji: "🛍️" },
  { slug: "spa", name: "Spa", description: "Ngành làm đẹp", tagline: "Làm đẹp & chăm sóc", emoji: "💆" },
  { slug: "store", name: "Store", description: "Ngành retail", tagline: "Bán lẻ đa ngành", emoji: "🏬" },
  { slug: "fb", name: "F&B", description: "Ngành ẩm thực", tagline: "Ẩm thực & đồ uống", emoji: "🍜" },
  { slug: "realestate", name: "Bất động sản", description: "Ngành BĐS", tagline: "Nhà đất & cho thuê", emoji: "🏡" },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategory(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
