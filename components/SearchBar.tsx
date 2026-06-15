"use client";

import { useMemo, useState } from "react";
import OwnerCard, { type OwnerLite } from "./OwnerCard";

export default function SearchBar({ owners }: { owners: OwnerLite[] }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return owners.filter((o) => o.name.toLowerCase().includes(term));
  }, [q, owners]);

  return (
    <div className="mx-auto w-full max-w-xl">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="🔍 Tìm Owner theo tên…"
        className="w-full rounded-full border border-gray-200 bg-white px-6 py-3.5 text-base shadow-sm outline-none focus:border-[var(--stem-green)]"
      />
      {q.trim() && (
        <div className="mt-4 grid gap-3 text-left sm:grid-cols-2">
          {results.length > 0 ? (
            results.map((o) => <OwnerCard key={o.slug} owner={o} />)
          ) : (
            <p className="col-span-full py-4 text-center text-gray-500">
              Không tìm thấy Owner nào khớp “{q}”.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
