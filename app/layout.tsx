import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZBVN · zeebee.vn — Kênh của bạn, Doanh thu của bạn",
  description:
    "zeebee.vn — nền tảng CTV Công nghệ. Bridge build web app cho Owner network: Shop · Spa · Store · F&B · Bất động sản.",
  manifest: "/manifest.webmanifest",
  applicationName: "ZBVN",
  appleWebApp: { capable: true, title: "ZBVN", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#4B6F44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--blue-light)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
