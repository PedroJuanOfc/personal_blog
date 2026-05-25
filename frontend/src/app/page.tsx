import Link from "next/link";
import removeMd from "remove-markdown";

interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  author_id: number;
  created_at: string;
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch("http://localhost:8002/articles", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const articles = await getArticles();

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
        <h2 className="text-sm font-mono uppercase tracking-widest mb-8" style={{ color: "var(--muted)" }}>
          Articles
        </h2>

        {articles.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No articles yet. Check back soon.</p>
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
