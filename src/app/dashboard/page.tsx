import { Activity, ArrowLeft, CircleCheck, Clock3, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicReports } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { PublicCivicReport, ReportStatus } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const configured = isSupabaseConfigured();
  let reports: PublicCivicReport[] = [];
  let error = "";
  if (configured) {
    try { reports = await getPublicReports(); } catch { error = "The public report feed is temporarily unavailable."; }
  }

  return <main className="min-h-screen bg-canvas px-5 py-8 text-ink sm:py-10 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand" href="/"><ArrowLeft aria-hidden="true" size={16} /> Back to home</Link>
      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">Public accountability dashboard</p><h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Track civic reports honestly.</h1><p className="mt-3 max-w-2xl leading-7 text-muted">This feed shows reported issues and workflow status. It does not publish private report text, evidence, email recipients, or a false claim that an issue is solved.</p></div>
        <Button asChild><Link href="/report"><ShieldCheck aria-hidden="true" size={17} /> Report an issue</Link></Button>
      </div>

      {!configured ? <EmptyState title="Dashboard setup is incomplete" detail="Add the Supabase environment variables and run supabase/schema.sql in the Supabase SQL Editor to activate public tracking." /> : error ? <EmptyState title="Feed unavailable" detail={error} /> : reports.length === 0 ? <EmptyState title="No public reports yet" detail="Newly submitted CivicShield reports will appear here after their safety analysis is stored." /> : <>
        <div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric icon={<Activity aria-hidden="true" size={18} />} label="Public reports" value={String(reports.length)} /><Metric icon={<Clock3 aria-hidden="true" size={18} />} label="Awaiting action" value={String(reports.filter((report) => !["department-resolved", "verified-resolved"].includes(report.status)).length)} /><Metric icon={<CircleCheck aria-hidden="true" size={18} />} label="Community verified" value={String(reports.filter((report) => report.status === "verified-resolved").length)} /></div>
        <section className="mt-7 overflow-hidden rounded-3xl border border-line bg-surface"><div className="border-b border-line px-5 py-4 sm:px-6"><h2 className="font-display text-xl font-bold">Latest reports</h2></div><div className="divide-y divide-line">{reports.map((report) => <ReportRow key={report.id} report={report} />)}</div></section>
      </>}
    </div>
  </main>;
}

function ReportRow({ report }: { report: PublicCivicReport }) {
  return <article className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"><div><div className="flex flex-wrap items-center gap-2"><p className="font-mono text-xs font-bold text-brand">{report.id}</p><StatusBadge status={report.status} /></div><h2 className="mt-2 font-display text-lg font-bold">{report.category ?? "Civic issue"}</h2><p className="mt-1 flex items-start gap-1.5 text-sm leading-6 text-muted"><MapPin aria-hidden="true" className="mt-0.5 shrink-0" size={15} />{report.locationLabel}</p></div><div className="text-sm text-muted sm:text-right"><p>{new Date(report.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p><p className="mt-1 text-xs">Updated {new Date(report.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p></div></article>;
}

function StatusBadge({ status }: { status: ReportStatus }) { const tone = status === "verified-resolved" ? "safe" : status === "overdue" || status === "disputed" ? "urgent" : "caution"; return <Badge tone={tone}>{status.replaceAll("-", " ")}</Badge>; }
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <Card className="rounded-2xl"><CardContent className="flex items-center gap-3 p-5"><span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">{icon}</span><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p><p className="mt-1 font-display text-2xl font-bold">{value}</p></div></CardContent></Card>; }
function EmptyState({ title, detail }: { title: string; detail: string }) { return <Card className="mt-8 rounded-3xl"><CardContent className="p-8 text-center"><Activity className="mx-auto text-brand" size={28} /><h2 className="mt-4 font-display text-xl font-bold">{title}</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">{detail}</p></CardContent></Card>; }
