"use client";

import dynamic from "next/dynamic";

const EmergencyAssistance = dynamic(
  () => import("@/components/emergency/emergency-assistance").then((module) => module.EmergencyAssistance),
  { ssr: false, loading: () => <main className="min-h-screen bg-[#fff8f6]" aria-label="Loading emergency assistance" /> },
);

export function EmergencyAssistanceSlot() {
  return <EmergencyAssistance />;
}
