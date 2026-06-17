import type { Metadata, Viewport } from "next";
import { Montserrat, Nunito, Cormorant_Garamond, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
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
    <html lang="vi" className={`${montserrat.variable} ${nunito.variable} ${cormorant.variable} ${dmSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--blue-light)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
