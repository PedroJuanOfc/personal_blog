export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6">
      <header className="py-8 border-b" style={{ borderColor: "var(--border)" }}>
        <nav className="flex items-center justify-between">
          <a href="/" className="text-base font-mono font-semibold tracking-tight hover:opacity-70 transition-opacity">
            pedrojuan.dev
          </a>
          <div className="flex gap-6 text-sm" style={{ color: "var(--muted)" }}>
            <a href="/" className="hover:text-[var(--foreground)] transition-colors">Articles</a>
            <a href="https://github.com/PedroJuanOfc" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">GitHub</a>
          </div>
        </nav>
      </header>
      {children}
      <footer className="py-8 mt-16 border-t text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        <p>© {new Date().getFullYear()} Pedro Juan. Built from scratch.</p>
      </footer>
    </div>
  );
}
