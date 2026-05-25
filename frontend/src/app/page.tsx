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

  return (
    <main>
      <section className="py-16 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm font-mono mb-4" style={{ color: "var(--accent)" }}>
          software engineer
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hey, I&apos;m Pedro Juan.
        </h1>
        <p className="text-lg max-w-xl" style={{ color: "var(--muted)" }}>
          I write about software engineering, Linux, DevOps, backend development,
          and everything I learn along the way. Based in Brazil, building things from scratch.
        </p>
      </section>

      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
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
          <ul className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
            {articles.map((article) => {
              const raw = removeMd(article.content);
              const preview = raw.length > 140 ? raw.slice(0, 140).trim() + "…" : raw;
              return (
                <li key={article.id} className="py-6">
                  <Link href={`/articles/${article.id}`} className="group block">
                    <h3 className="text-lg font-semibold group-hover:text-[var(--accent)] transition-colors mb-1">
                      {article.title}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </h3>
                    <p className="text-xs font-mono mb-1" style={{ color: "var(--muted)" }}>
                      {new Date(article.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {preview}
                    </p>
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
