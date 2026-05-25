import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pedrojuan.dev",
  description: "Software engineer from Brazil. Writing about backend development, Linux, DevOps, and everything I build and learn.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="max-w-[680px] mx-auto px-6">
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
      </body>
    </html>
  );
}
