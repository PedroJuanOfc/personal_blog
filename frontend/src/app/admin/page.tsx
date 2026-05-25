"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL, getToken, removeToken, authHeaders } from "@/lib/api";

interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  author_id: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const res = await fetch(`${API_URL}/articles`, { cache: "no-store" });
    if (res.ok) setArticles(await res.json());
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this article?")) return;
    await fetch(`${API_URL}/articles/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  function handleLogout() {
    removeToken();
    router.push("/admin/login");
  }

  if (loading) return <main className="py-12"><p style={{ color: "var(--muted)" }}>Loading...</p></main>;

  return (
    <main className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 rounded text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            New Article
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded text-sm"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            Logout
          </button>
        </div>
      </div>

      {articles.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No articles yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              <th className="pb-3">Title</th>
              <th className="pb-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="py-3">{article.title}</td>
                <td className="py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="hover:text-[var(--accent)] transition-colors"
                      style={{ color: "var(--muted)" }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="hover:text-red-400 transition-colors"
                      style={{ color: "var(--muted)" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
