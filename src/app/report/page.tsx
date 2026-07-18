import { CivicReportForm } from "@/components/report/civic-report-form";

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-canvas px-5 py-8 text-ink sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CivicReportForm />
      </div>
    </main>
  );
}
