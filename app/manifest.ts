import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZBVN · zeebee.vn",
    short_name: "ZBVN",
    description: "Nền tảng CTV Công nghệ — Kênh của bạn, Doanh thu của bạn.",
    start_url: "/",
    display: "standalone",
    background_color: "#E8EEFF",
    theme_color: "#4B6F44",
    icons: [],
  };
}
