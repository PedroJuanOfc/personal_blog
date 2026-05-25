import Link from "next/link";
import { notFound } from "next/navigation";

interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  author_id: number;
}

async function getArticle(id: string): Promise<Article | null> {
  const res = await fetch(`http://localhost:8002/articles/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) notFound();

  return (
    <main className="max-w-[720px] py-12">
      <Link
        href="/"
        className="text-sm font-mono hover:text-[var(--accent)] transition-colors"
        style={{ color: "var(--muted)" }}
      >
        ← back
      </Link>

      <article className="mt-10">
        <h1 className="text-3xl font-bold tracking-tight leading-tight mb-8">
          {article.title}
        </h1>

        <div
          className="text-base leading-8 whitespace-pre-wrap"
          style={{ color: "var(--foreground)" }}
        >
          {article.content}
        </div>
      </article>
    </main>
  );
}
