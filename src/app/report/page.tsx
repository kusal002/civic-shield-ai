import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { CivicReportForm } from "@/components/report/civic-report-form";

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-canvas px-5 py-8 text-ink sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand" href="/"><ArrowLeft aria-hidden="true" size={16} /> Back to home</Link>
        <CivicReportForm />
      </div>
    </main>
  );
}
