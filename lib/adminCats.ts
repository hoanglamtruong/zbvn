// Category metadata for admin pages. Keys = category values posted by the 10 storefronts.
// Note: the /shop retail storefront posts "retail".
export type AdminCat = { value: string; label: string; emoji: string; color: string };

export const ADMIN_CATS: AdminCat[] = [
  { value: "retail", label: "Tạp hóa & Bán lẻ", emoji: "🛒", color: "#4B6F44" },
  { value: "fashion", label: "Thời trang", emoji: "👗", color: "#111827" },
  { value: "bakery", label: "Tiệm bánh", emoji: "🎂", color: "#C05000" },
  { value: "fb", label: "Ẩm thực", emoji: "🍜", color: "#9A4A12" },
  { value: "services", label: "Dịch vụ tại nhà", emoji: "🔧", color: "#1D4ED8" },
  { value: "accommodation", label: "Lưu trú", emoji: "🏡", color: "#3E5A37" },
  { value: "recruit", label: "Giáo dục & Tuyển dụng", emoji: "🎓", color: "#1D4ED8" },
  { value: "realestate", label: "Môi giới BĐS", emoji: "🏢", color: "#B8860B" },
  { value: "store", label: "Cửa hàng & Showroom", emoji: "🏬", color: "#374151" },
  { value: "spa", label: "Spa & Làm đẹp", emoji: "💆", color: "#C05000" },
];

const MAP = new Map(ADMIN_CATS.map((c) => [c.value, c]));
export function catMeta(value: string): AdminCat {
  return MAP.get(value) || { value, label: value, emoji: "🏷️", color: "#6B7280" };
}
