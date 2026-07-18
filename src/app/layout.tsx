import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "CivicShield AI | Civic safety, made actionable",
  description:
    "AI-assisted civic issue reporting and emergency safety guidance for communities.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
