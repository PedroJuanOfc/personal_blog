"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
}

export default function ArticleFilters({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "newest";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  }

  const selectStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--border)",
    color: "var(--foreground)",
    fontSize: "0.8rem",
    padding: "2px 20px 2px 0",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 4px center",
  };

  return (
    <div className="flex items-center gap-5">
      {categories.length > 0 && (
        <select
          value={currentCategory}
          onChange={(e) => updateParams("category", e.target.value)}
          style={selectStyle}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      <select
        value={currentSort}
        onChange={(e) => updateParams("sort", e.target.value)}
        style={selectStyle}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
