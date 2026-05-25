"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL, getToken, authHeaders } from "@/lib/api";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) router.push("/admin/login");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = getToken();
    const res = await fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        title,
        content,
        category_id: parseInt(categoryId),
        author_id: 1,
      }),
    });

    if (!res.ok) {
      setError("Failed to create article. Make sure you are logged in.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="py-12 max-w-[720px]">
      <h1 className="text-2xl font-bold mb-8">New Article</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--muted)" }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded text-sm outline-none"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--muted)" }}>Category ID</label>
          <input
            type="number"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2 rounded text-sm outline-none"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label className="block text-sm mb-2" style={{ color: "var(--muted)" }}>
            Content <span className="font-mono text-xs">(Markdown supported)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            className="w-full px-4 py-3 rounded text-sm outline-none font-mono leading-7 resize-y"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-6 py-2 rounded text-sm transition-opacity hover:opacity-80"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
