"use client";

import dynamic from "next/dynamic";

const QuickIncidentRecord = dynamic(
  () => import("@/components/landing/quick-incident-record").then((module) => module.QuickIncidentRecord),
  { ssr: false, loading: () => <div className="min-h-72 rounded-3xl border border-[#efc7bf] bg-white p-5 shadow-surface sm:p-6" aria-label="Loading quick incident record" /> },
);

export function QuickIncidentRecordSlot() {
  return <QuickIncidentRecord />;
}
