import { ArrowLeft, CalendarClock, FileText, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicReportDetail } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { ReportStatus, UrgencyLevel } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function PublicReportDetailPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  if (!isSupabaseConfigured()) notFound();
  const report = await getPublicReportDetail(reportId);
  if (!report) notFound();

  return (
    <main className="min-h-screen bg-canvas px-5 py-8 text-ink sm:py-10 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand" href="/dashboard">
          <ArrowLeft aria-hidden="true" size={16} /> Back to nearby dashboard
        </Link>

        <section className="mt-7 rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold text-brand">{report.id}</p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{report.category ?? "Civic issue report"}</h1>
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted"><MapPin aria-hidden="true" className="mt-0.5 shrink-0" size={16} />{report.locationLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={report.status} />
              {report.urgency ? <UrgencyBadge urgency={report.urgency} /> : null}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <InfoTile icon={<CalendarClock aria-hidden="true" size={18} />} label="Lodged" value={formatDateTime(report.createdAt)} />
            <InfoTile icon={<ShieldCheck aria-hidden="true" size={18} />} label="Current status" value={report.status.replaceAll("-", " ")} />
            <InfoTile icon={<FileText aria-hidden="true" size={18} />} label="Evidence count" value={`${report.attachmentCount} file${report.attachmentCount === 1 ? "" : "s"}`} />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <Card className="rounded-3xl">
            <CardContent className="p-6 sm:p-7">
              <p className="eyebrow">Detailed report</p>
              <dl className="mt-5 space-y-5">
                <DetailItem label="Citizen description" value={report.description} />
                <DetailItem label="Incident time" value={formatIncidentTime(report.duration)} />
                <DetailItem label="Affected people" value={report.affectedPeople ? String(report.affectedPeople) : "Not specified"} />
                <DetailItem label="Extra details" value={report.extraDetails || "No extra details added."} />
                <DetailItem label="Suggested department" value={report.routeName || "Not routed yet"} />
              </dl>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6 sm:p-7">
              <p className="eyebrow">Status timeline</p>
              <div className="mt-5 space-y-4">
                {report.statusEvents.length ? report.statusEvents.map((event) => (
                  <article className="border-l-2 border-brand-soft pl-4" key={`${event.status}-${event.createdAt}`}>
                    <p className="text-sm font-bold capitalize">{event.status.replaceAll("-", " ")}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{event.note}</p>
                    <p className="mt-1 text-xs font-semibold text-brand">{formatDateTime(event.createdAt)}</p>
                  </article>
                )) : <p className="text-sm leading-6 text-muted">No public status updates yet.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {report.analysis ? (
          <Card className="mt-6 rounded-3xl">
            <CardContent className="p-6 sm:p-7">
              <p className="eyebrow">Safety analysis</p>
              <h2 className="mt-3 font-display text-2xl font-bold">{report.analysis.riskSummary}</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <section>
                  <h3 className="text-sm font-bold">Immediate actions</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                    {report.analysis.immediateActions.map((action) => <li key={action}>- {action}</li>)}
                  </ul>
                </section>
                <section>
                  <h3 className="text-sm font-bold">Public alert</h3>
                  <p className="mt-3 rounded-2xl border border-line bg-[#fbfdfc] p-4 text-sm leading-6 text-muted">{report.analysis.publicAlert}</p>
                </section>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</dt><dd className="mt-1 text-sm leading-6 text-ink">{value}</dd></div>;
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-line bg-[#fbfdfc] p-4"><div className="flex items-center gap-2 text-brand">{icon}<p className="text-xs font-bold uppercase tracking-[0.1em]">{label}</p></div><p className="mt-2 text-sm font-bold leading-5">{value}</p></div>;
}

function StatusBadge({ status }: { status: ReportStatus }) {
  const tone = status === "verified-resolved" ? "safe" : status === "overdue" || status === "disputed" ? "urgent" : "caution";
  return <Badge tone={tone}>{status.replaceAll("-", " ")}</Badge>;
}

function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const tone = urgency === "low" ? "neutral" : urgency === "medium" ? "caution" : "urgent";
  return <Badge tone={tone}>{urgency} urgency</Badge>;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatIncidentTime(value: string) {
  if (!value.includes("T")) return value;
  return formatDateTime(value);
}
