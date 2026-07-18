import type { Metadata } from "next";

import { EmergencyAlertMarquee } from "@/components/emergency/emergency-alert-marquee";

import "./globals.css";

export const metadata: Metadata = {
  title: "CivicShield AI | Civic safety, made actionable",
  description:
    "AI-assisted civic issue reporting and emergency safety guidance for communities.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <EmergencyAlertMarquee />
        {children}
      </body>
    </html>
  );
}
