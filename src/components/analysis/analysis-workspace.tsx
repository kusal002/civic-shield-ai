"use client";

import { AlertTriangle, ArrowLeft, CheckCircle2, ClipboardCheck, Copy, FileText, LoaderCircle, Mail, MapPin, RefreshCw, Send, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getLocalReport, saveReportAnalysis } from "@/lib/storage/reports";
import type { CivicReport, SafetyAnalysis } from "@/types/report";

export function AnalysisWorkspace({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<CivicReport | null>(() => getLocalReport(reportId));
  const [analysis, setAnalysis] = useState<SafetyAnalysis | null>(() => getLocalReport(reportId)?.analysis ?? null);
  const [loading, setLoading] = useState(() => Boolean(getLocalReport(reportId) && !getLocalReport(reportId)?.analysis));
  const [error, setError] = useState(() => getLocalReport(reportId) ? "" : "This local report was not found in this browser.");

  async function generateReport(nextReport: CivicReport, variation = 0) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ report: nextReport, variation }) });
      if (!response.ok) throw new Error("Analysis could not be prepared.");
      const result = (await response.json()) as SafetyAnalysis;
      const updated = saveReportAnalysis(nextReport.id, result);
      setAnalysis(result);
      if (updated) setReport(updated);
    } catch {
      setError("CivicShield could not prepare this analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!report || analysis) return;
    const reportToAnalyze = report;
    async function loadAnalysis() {
      await generateReport(reportToAnalyze);
    }
    void loadAnalysis();
  }, [report, analysis]);

  if (loading) return <LoadingState />;
  if (error || !report || !analysis) return <MissingState message={error || "This report could not be opened."} />;

  const isEmergency = analysis.urgency === "critical";
  return (
    <main className="min-h-screen bg-canvas px-5 py-8 text-ink sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand" href="/report"><ArrowLeft aria-hidden="true" size={16} /> Back to reporter</Link>
        {isEmergency ? <section className="mt-6 rounded-3xl border border-[#efbdb6] bg-[#fff4f1] p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><Badge tone="urgent" className="gap-1.5"><ShieldAlert aria-hidden="true" size={14} /> Possible immediate danger</Badge><h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Move to safety. Do not wait for a report.</h1><p className="mt-2 max-w-2xl leading-7 text-[#7e342d]">This analysis suggests an immediate safety risk. Call emergency services first, then return only when it is safe.</p></div><Button asChild variant="danger" size="lg"><a href="tel:112">Call 112 now</a></Button></div></section> : null}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_25rem]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-3xl"><CardHeader className="border-b border-line bg-[#fbfdfc] p-6 sm:p-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="eyebrow">AI-assisted safety brief</p><h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{analysis.category}</h1><p className="mt-3 max-w-2xl leading-7 text-muted">{analysis.riskSummary}</p></div><UrgencyBadge urgency={analysis.urgency} /></div></CardHeader><CardContent className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8"><InfoBlock icon={<MapPin aria-hidden="true" size={18} />} label="Confirmed location" value={report.incidentLocation?.label ?? report.location} /><InfoBlock icon={<ClipboardCheck aria-hidden="true" size={18} />} label="Suggested department" value={analysis.route.name} /><InfoBlock icon={<FileText aria-hidden="true" size={18} />} label="Attachments saved locally" value={`${report.attachments?.length ?? 0} file(s) on this device`} /><InfoBlock icon={<Sparkles aria-hidden="true" size={18} />} label="Analysis source" value={analysis.generatedBy === "groq" ? "Groq free-tier AI" : "Local safety fallback"} /></CardContent></Card>

            <Card className="rounded-3xl"><CardContent className="p-6 sm:p-8"><p className="eyebrow">What to do now</p><div className="mt-5 space-y-3">{analysis.immediateActions.map((action) => <div key={action} className="flex gap-3 rounded-2xl border border-line bg-[#fbfdfc] p-4 text-sm leading-6"><CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-brand" size={17} />{action}</div>)}</div></CardContent></Card>

            <Card className="rounded-3xl"><CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0"><div className="flex items-center justify-between gap-3"><div><p className="eyebrow">Formal complaint</p><h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Ready for review</h2></div><CopyButton text={analysis.formalComplaint} /></div></CardHeader><CardContent className="p-6 sm:p-8"><pre className="whitespace-pre-wrap rounded-2xl border border-line bg-[#fbfdfc] p-4 font-sans text-sm leading-6 text-[#426058]">{analysis.formalComplaint}</pre></CardContent></Card>

            <MailComposer key={analysis.emailBody} analysis={analysis} reportId={report.id} onRegenerate={() => void generateReport(report, Date.now())} />
          </div>
          <aside className="space-y-5"><Card className="rounded-3xl"><CardContent className="p-6"><p className="eyebrow">Report reference</p><p className="mt-2 font-display text-2xl font-bold">{report.id}</p><p className="mt-4 text-sm leading-6 text-muted">Saved locally on {new Date(report.createdAt).toLocaleString()}.</p></CardContent></Card><Card className="rounded-3xl border-[#ead9b8] bg-[#fffaf0]"><CardContent className="p-6"><Badge tone="caution" className="gap-1.5"><AlertTriangle aria-hidden="true" size={14} /> Honest routing</Badge><p className="mt-4 text-sm leading-6 text-[#725019]">CivicShield suggests the responsible department but does not claim it has received your report. You select and confirm the official email recipient before sending.</p></CardContent></Card></aside>
        </div>
      </div>
    </main>
  );
}

function MailComposer({ analysis, onRegenerate, reportId }: { analysis: SafetyAnalysis; onRegenerate: () => void; reportId: string }) {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState(analysis.emailSubject);
  const [body, setBody] = useState(analysis.emailBody);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gmailStatus, setGmailStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [sendStatus, setSendStatus] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/gmail/status")
      .then((response) => response.json())
      .then((data: { connected?: boolean }) => { if (active) setGmailStatus(data.connected ? "connected" : "disconnected"); })
      .catch(() => { if (active) setGmailStatus("disconnected"); });
    return () => { active = false; };
  }, []);

  function openMail() {
    if (!recipient || !confirmed) return;
    window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function copyDraft() {
    await navigator.clipboard.writeText(`To: ${recipient}\nSubject: ${subject}\n\n${body}`);
    setCopied(true);
  }

  async function sendWithGmail() {
    if (!recipient || !confirmed) return;
    setSendStatus("Sending through your connected Gmail…");
    try {
      const response = await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: recipient, subject, body }) });
      const result = await response.json() as { id?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Email could not be sent.");
      setSendStatus(`Sent from Gmail. Message ID: ${result.id}`);
    } catch (error) {
      setSendStatus(error instanceof Error ? error.message : "Email could not be sent.");
    }
  }

  const disabled = !recipient || !confirmed;
  return (
    <Card className="rounded-3xl border-[#c7e7dc]">
      <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
        <p className="eyebrow">Department email draft</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Review before you send</h2>
        <p className="mt-2 text-sm leading-6 text-muted">CivicShield selected <strong>{analysis.route.name}</strong>. Add the verified official recipient for your city, then approve the final email yourself.</p>
      </CardHeader>
      <CardContent className="space-y-4 p-6 sm:p-8">
        <label className="block text-sm font-bold text-ink">Official department email<input className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-3 text-sm font-normal focus:border-brand focus:outline-none" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="verified-department@example.gov.in" type="email" /></label>
        <label className="block text-sm font-bold text-ink">Subject<input className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-3 text-sm font-normal focus:border-brand focus:outline-none" value={subject} onChange={(event) => setSubject(event.target.value)} /></label>
        <label className="block text-sm font-bold text-ink">Message<textarea className="mt-2 min-h-64 w-full rounded-xl border border-line bg-white px-3 py-3 text-sm font-normal leading-6 focus:border-brand focus:outline-none" value={body} onChange={(event) => setBody(event.target.value)} /></label>
        <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={onRegenerate}><RefreshCw aria-hidden="true" size={16} /> Generate another draft</Button><Button type="button" variant="outline" onClick={copyDraft}><Copy aria-hidden="true" size={16} /> {copied ? "Copied" : "Copy draft"}</Button></div>
        <label className="flex gap-3 rounded-2xl border border-line bg-[#fbfdfc] p-4 text-sm leading-6 text-muted"><input className="mt-1 size-4 accent-[#076b5a]" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />I have checked the recipient and final message. I authorize CivicShield to send this exact email from my connected Gmail account.</label>
        {gmailStatus === "connected" ? <Button type="button" size="lg" disabled={disabled} onClick={() => void sendWithGmail()}><Send aria-hidden="true" size={18} /> Confirm and send from Gmail</Button> : <Button asChild size="lg" disabled={gmailStatus === "checking"}><Link href={`/api/auth/gmail/connect?returnTo=${encodeURIComponent(`/analysis/${reportId}`)}`}><Mail aria-hidden="true" size={18} /> {gmailStatus === "checking" ? "Checking Gmail…" : "Connect Gmail to send"}</Link></Button>}
        <Button type="button" variant="outline" disabled={disabled} onClick={openMail}>Open in my email app instead</Button>
        {sendStatus ? <p className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand" role="status">{sendStatus}</p> : null}
        <p className="text-xs leading-5 text-muted">Attachments remain stored on this device. Gmail API attachment delivery will be added with the permanent cloud-storage milestone.</p>
      </CardContent>
    </Card>
  );
}

function UrgencyBadge({ urgency }: { urgency: SafetyAnalysis["urgency"] }) { const tone = urgency === "critical" || urgency === "high" ? "urgent" : urgency === "medium" ? "caution" : "safe"; return <Badge tone={tone}>{urgency} urgency</Badge>; }
function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex gap-3"><span className="mt-0.5 text-brand">{icon}</span><div><p className="text-xs font-bold uppercase tracking-[0.11em] text-muted">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-ink">{value}</p></div></div>; }
function CopyButton({ text }: { text: string }) { const [copied, setCopied] = useState(false); return <Button type="button" size="sm" variant="outline" onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); }}>{copied ? "Copied" : <><Copy aria-hidden="true" size={14} /> Copy</>}</Button>; }
function LoadingState() { return <main className="grid min-h-screen place-items-center bg-canvas p-6"><div className="text-center"><LoaderCircle className="mx-auto animate-spin text-brand" size={32} /><p className="mt-4 font-display text-xl font-bold">Preparing your civic safety brief…</p><p className="mt-2 text-sm text-muted">This uses Groq when a free API key is configured, with a local fallback for reliability.</p></div></main>; }
function MissingState({ message }: { message: string }) { return <main className="grid min-h-screen place-items-center bg-canvas p-6"><Card className="max-w-lg rounded-3xl"><CardContent className="p-8"><AlertTriangle className="text-danger" size={28} /><h1 className="mt-4 font-display text-2xl font-bold">Report unavailable</h1><p className="mt-3 leading-7 text-muted">{message}</p><Button asChild className="mt-6"><Link href="/report">Create a report</Link></Button></CardContent></Card></main>; }
