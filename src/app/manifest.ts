import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CivicShield AI",
    short_name: "CivicShield",
    description: "Location-aware civic reporting, emergency guidance, women safety support, and public safety alerts.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f8f8",
    theme_color: "#076b5a",
    orientation: "portrait",
    categories: ["utilities", "navigation", "productivity"],
    icons: [
      {
        src: "/icons/favicon-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Emergency Help",
        short_name: "Emergency",
        description: "Open CivicShield emergency assistance.",
        url: "/emergency",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Women Safety",
        short_name: "Women Safety",
        description: "Open women safety support.",
        url: "/emergency?type=women",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Report Issue",
        short_name: "Report",
        description: "Start a civic issue report.",
        url: "/report",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
