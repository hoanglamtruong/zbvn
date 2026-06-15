import { getCategory } from "@/lib/categories";

export type OwnerLite = {
  name: string;
  slug: string;
  category: string;
  description: string | null;
  webStatus: string;
};

export default function OwnerCard({ owner }: { owner: OwnerLite }) {
  const cat = getCategory(owner.category);
  const down = owner.webStatus !== "up";
  return (
    <a
      href={down ? undefined : `https://${owner.slug}.zeebee.vn`}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition ${
        down ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{cat?.emoji ?? "🏪"}</span>
        <h3 className="font-bold text-[var(--ink)]">{owner.name}</h3>
      </div>
      <p className="mb-3 min-h-[2.5rem] text-sm text-gray-500">
        {owner.description || cat?.tagline || "Owner trên zeebee.vn"}
      </p>
      <span className={`text-sm font-medium ${down ? "text-red-500" : "text-[var(--stem-green)]"}`}>
        {down ? "Tạm ngưng" : `${owner.slug}.zeebee.vn →`}
      </span>
    </a>
  );
}
