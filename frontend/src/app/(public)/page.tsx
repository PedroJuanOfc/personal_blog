import removeMd from "remove-markdown";
import Link from "next/link";
import { Suspense } from "react";
import ArticleFilters from "@/components/ArticleFilters";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  author_id: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

async function getArticles(categoryId?: string, sort?: string): Promise<Article[]> {
  const params = new URLSearchParams();
  if (categoryId) params.set("category_id", categoryId);
  if (sort) params.set("sort", sort);
  const res = await fetch(`${API_URL}/articles?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;
  const [articles, categories] = await Promise.all([
    getArticles(category, sort),
    getCategories(),
  ]);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <main className="max-w-[680px]">
      <section className="pt-10 pb-8 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm font-mono mb-3" style={{ color: "var(--accent)" }}>
          software engineer
        </p>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Pedro Juan.
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Software engineer from Brazil. I build things from scratch and write about what I learn: backend, Linux, DevOps, and more.
        </p>
      </section>

      <section className="pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-mono uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Articles
          </h2>
          <Suspense>
            <ArticleFilters categories={categories} />
          </Suspense>
        </div>

        {articles.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No articles found.</p>
        ) : (
          <ul className="flex flex-col">
            {articles.map((article) => {
              const raw = removeMd(article.content);
              const preview = raw.length > 140 ? raw.slice(0, 140).trim() + "…" : raw;
              const categoryName = categoryMap[article.category_id];
              return (
                <li key={article.id} className="py-5 border-b" style={{ borderColor: "var(--border)" }}>
                  <Link href={`/articles/${article.id}`} className="group block">
                    <h3 className="text-base font-semibold mb-1 transition-opacity group-hover:opacity-60">
                      {article.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                      {preview}
                    </p>
                    <div className="flex items-center gap-2">
                      {categoryName && (
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded-full"
                          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--accent)" }}
                        >
                          {categoryName}
                        </span>
                      )}
                      <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                        {new Date(article.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
