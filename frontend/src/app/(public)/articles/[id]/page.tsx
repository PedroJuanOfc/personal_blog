import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  author_id: number;
  created_at: string;
  next_id: number | null;
  next_title: string | null;
}

async function getArticle(id: string): Promise<Article | null> {
  const res = await fetch(`http://localhost:8002/articles/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return {};
  return { title: `${article.title} — pedrojuan.dev` };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) notFound();

  const date = new Date(article.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="py-12">
      <article>
        <h1 className="text-3xl font-bold tracking-tight leading-tight mb-3">
          {article.title}
        </h1>
        <p className="text-sm font-mono mb-8" style={{ color: "var(--muted)" }}>{date}</p>

        <div className="prose max-w-none">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {article.next_id && article.next_title && (
          <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
              Read next
            </p>
            <Link
              href={`/articles/${article.next_id}`}
              className="group flex items-center justify-between p-4 rounded-lg transition-colors"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <span className="font-semibold group-hover:text-[var(--accent)] transition-colors">
                {article.next_title}
              </span>
              <span style={{ color: "var(--accent)" }}>→</span>
            </Link>
          </div>
        )}
      </article>
    </main>

  );
}
