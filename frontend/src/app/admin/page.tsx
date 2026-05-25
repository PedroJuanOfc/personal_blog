"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL, getToken, removeToken, authHeaders } from "@/lib/api";

interface Article {
  id: number;
  title: string;
  category_id: number;
  author_id: number;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.push("/admin/login");
      return;
    }
    Promise.all([fetchArticles(), fetchCategories()]);
  }, []);

  async function fetchArticles() {
    const res = await fetch(`${API_URL}/articles`, { cache: "no-store" });
    if (res.ok) setArticles(await res.json());
    setLoading(false);
  }

  async function fetchCategories() {
    const res = await fetch(`${API_URL}/categories`);
    if (res.ok) setCategories(await res.json());
  }

  async function handleDeleteArticle(id: number) {
    if (!confirm("Delete this article?")) return;
    await fetch(`${API_URL}/articles/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setCategoryError("");
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name: newCategory }),
    });
    if (!res.ok) {
      setCategoryError("Failed to create category.");
      return;
    }
    const created = await res.json();
    setCategories((prev) => [...prev, created]);
    setNewCategory("");
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.detail || "Failed to delete category.");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
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

      {/* Articles */}
      <section className="mb-12">
        <h2 className="text-sm font-mono uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>Articles</h2>
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
                        onClick={() => handleDeleteArticle(article.id)}
                        className="hover:text-red-500 transition-colors"
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
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-sm font-mono uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>Categories</h2>
        <form onSubmit={handleCreateCategory} className="flex gap-3 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            required
            className="px-4 py-2 rounded text-sm outline-none"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Add
          </button>
        </form>
        {categoryError && <p className="text-sm text-red-500 mb-3">{categoryError}</p>}
        {categories.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>No categories yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between text-sm py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                <span>{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="hover:text-red-500 transition-colors"
                  style={{ color: "var(--muted)" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
