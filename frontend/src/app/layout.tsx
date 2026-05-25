import type { Metadata } from "next";
import { Geist_Mono, Courier_Prime } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${courierPrime.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-199S16RB7Z" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-199S16RB7Z');
        `}</Script>
        {children}
      </body>
    </html>
  );
}
