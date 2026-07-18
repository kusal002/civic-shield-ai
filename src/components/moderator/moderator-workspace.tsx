"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Eye, Filter, ShieldCheck, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportStatus, UrgencyLevel } from "@/types/report";

type ModeratorReport = {
  id: string;
  description: string;
  locationLabel: string;
  duration: string;
  affectedPeople: number | null;
  extraDetails: string | null;
  attachmentCount: number;
  category: string | null;
  urgency: UrgencyLevel | null;
  routeName: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  emailRecipient: string | null;
  gmailMessageId: string | null;
};

type PresetRange = "all" | "7" | "14" | "30" | "custom";

const statuses: ReportStatus[] = ["acknowledged", "assigned", "in-progress", "department-resolved", "verification-pending", "verified-resolved", "disputed", "reopened", "overdue"];

export function ModeratorWorkspace() {
  const [accessKey, setAccessKey] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [reports, setReports] = useState<ModeratorReport[]>([]);
  const [selected, setSelected] = useState<ModeratorReport | null>(null);
  const [status, setStatus] = useState<ReportStatus>("acknowledged");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [range, setRange] = useState<PresetRange>("all");
  const [city, setCity] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  async function loadReports() {
    setLoading(true);
    try {
      const response = await fetch("/api/moderator/reports", { cache: "no-store" });
      const payload = await response.json() as { reports?: ModeratorReport[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not load reports.");
      const nextReports = payload.reports ?? [];
      setReports(nextReports);
      setSelected((current) => current ? nextReports.find((report) => report.id === current.id) ?? null : null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load reports.");
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setMessage("");
    const response = await fetch("/api/moderator/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accessKey }) });
    const payload = await response.json() as { error?: string };
    if (!response.ok) return setMessage(payload.error ?? "Could not sign in.");
    setSignedIn(true);
    setAccessKey("");
    await loadReports();
  }

  async function update() {
    if (!selected) return;
    const response = await fetch(`/api/moderator/reports/${encodeURIComponent(selected.id)}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, note }) });
    const payload = await response.json() as { error?: string };
    if (!response.ok) return setMessage(payload.error ?? "Update failed.");
    setMessage("Status update published to the public timeline.");
    setNote("");
    await loadReports();
  }

  async function removeReport() {
    if (!selected) return;
    setDeleting(true);
    const response = await fetch(`/api/moderator/reports/${encodeURIComponent(selected.id)}`, { method: "DELETE" });
    const payload = await response.json() as { error?: string };
    setDeleting(false);
    if (!response.ok) return setMessage(payload.error ?? "Delete failed.");
    setDeleteOpen(false);
    setSelected(null);
    setMessage("Report deleted.");
    await loadReports();
  }

  const cities = useMemo(() => [...new Set(reports.map((report) => cityForLocation(report.locationLabel)))].sort((first, second) => first.localeCompare(second)), [reports]);
  const filteredReports = useMemo(() => reports.filter((report) => {
    if (city !== "all" && cityForLocation(report.locationLabel) !== city) return false;
    const createdAt = new Date(report.createdAt);
    if (range === "custom") return isWithinCustomRange(createdAt, fromDate, toDate);
    if (range === "all") return true;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(range));
    return createdAt >= cutoff;
  }), [city, fromDate, range, reports, toDate]);

  return <>
    <main className="min-h-screen bg-canvas p-6 text-ink sm:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Protected workspace</p>
        <h1 className="mt-3 flex items-center gap-2 font-display text-3xl font-bold"><ShieldCheck className="text-brand" /> Moderator controls</h1>
        {!signedIn ? <Card className="mt-6 max-w-xl rounded-3xl"><CardContent className="p-6"><p className="text-sm leading-6 text-muted">Sign in with the server-configured moderator access key.</p><input className="mt-5 h-12 w-full rounded-xl border border-line px-3" type="password" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} placeholder="Moderator access key" /><Button className="mt-3" onClick={() => void login()}>Sign in</Button>{message ? <p className="mt-4 text-sm font-semibold text-danger">{message}</p> : null}</CardContent></Card> : <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="rounded-3xl"><CardContent className="p-5">
            <div className="flex items-center justify-between"><div><p className="font-display text-xl font-bold">Reports by date</p><p className="mt-1 text-sm text-muted">Newest first · {filteredReports.length} shown</p></div><Button size="sm" variant="outline" onClick={() => void loadReports()}>{loading ? "Loading…" : "Refresh"}</Button></div>
            <div className="mt-5 rounded-2xl border border-line bg-[#fbfdfc] p-3">
              <div className="flex items-center gap-2"><Filter size={16} className="text-brand" /><p className="text-sm font-bold">Filter reports</p></div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="text-xs font-bold text-muted">Date range<select className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-2 text-sm text-ink" value={range} onChange={(event) => setRange(event.target.value as PresetRange)}><option value="all">All time</option><option value="7">Past 7 days</option><option value="14">Past 2 weeks</option><option value="30">Past month</option><option value="custom">Custom range</option></select></label>
                <label className="text-xs font-bold text-muted">City<select className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-2 text-sm text-ink" value={city} onChange={(event) => setCity(event.target.value)}><option value="all">All reported cities</option>{cities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              </div>
              {range === "custom" ? <CustomDateRangePicker fromDate={fromDate} toDate={toDate} onChange={(next) => { setFromDate(next.fromDate); setToDate(next.toDate); }} /> : null}
            </div>
            <div className="mt-5 max-h-[38rem] space-y-2 overflow-y-auto pr-1">{filteredReports.length ? filteredReports.map((report) => <button className={`w-full rounded-2xl border p-3 text-left transition ${selected?.id === report.id ? "border-brand bg-brand-soft" : "border-line bg-[#fbfdfc] hover:border-brand/40"}`} key={report.id} onClick={() => { setSelected(report); setStatus(report.status === "ready-to-analyze" || report.status === "delivery-confirmed" ? "acknowledged" : report.status); setNote(""); }}><div className="flex items-center justify-between gap-2"><span className="font-mono text-xs font-bold text-brand">{report.id}</span><Badge tone={report.status === "verified-resolved" ? "safe" : "caution"}>{report.status.replaceAll("-", " ")}</Badge></div><p className="mt-2 text-sm font-bold">{report.category ?? "Unclassified issue"}</p><p className="mt-1 text-xs text-muted">{cityForLocation(report.locationLabel)} · {formatDate(report.createdAt)}</p></button>) : <p className="rounded-xl bg-[#fbfdfc] p-4 text-sm text-muted">No reports match these filters.</p>}</div>
          </CardContent></Card>
          <Card className="rounded-3xl"><CardContent className="p-6 sm:p-7">{selected ? <><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-brand">{selected.id}</p><h2 className="mt-2 font-display text-2xl font-bold">{selected.category ?? "Civic issue"}</h2></div><Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}><Trash2 size={15} /> Delete false report</Button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Info label="Submitted" value={formatDate(selected.createdAt)} /><Info label="Location" value={selected.locationLabel} /><Info label="Issue description" value={selected.description} /><Info label="Duration" value={selected.duration} /><Info label="People affected" value={selected.affectedPeople ? String(selected.affectedPeople) : "Not provided"} /><Info label="Extra details" value={selected.extraDetails || "None"} /><Info label="Evidence" value={`${selected.attachmentCount} file(s), stored privately`} /><Info label="Recipient" value={selected.emailRecipient || "Not sent"} /></div><div className="mt-6 border-t border-line pt-6"><p className="eyebrow">Publish verified action</p><select className="mt-3 h-12 w-full rounded-xl border border-line px-3" value={status} onChange={(event) => setStatus(event.target.value as ReportStatus)}>{statuses.map((item) => <option key={item} value={item}>{item.replaceAll("-", " ")}</option>)}</select><textarea className="mt-3 min-h-28 w-full rounded-xl border border-line p-3" value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} placeholder="Public status note (required, 280 characters maximum)" /><Button className="mt-3" disabled={!note.trim()} onClick={() => void update()}><Eye size={16} /> Publish status update</Button></div></> : <div className="grid min-h-72 place-items-center text-center"><div><Eye className="mx-auto text-brand" size={28} /><p className="mt-4 font-display text-xl font-bold">Select a report</p><p className="mt-2 text-sm text-muted">Read the full private report before publishing an action.</p></div></div>}{message ? <p className="mt-5 text-sm font-semibold text-brand">{message}</p> : null}</CardContent></Card>
        </div>}
      </div>
    </main>
    {deleteOpen && selected ? <DeleteDialog reportId={selected.id} deleting={deleting} onCancel={() => setDeleteOpen(false)} onDelete={() => void removeReport()} /> : null}
  </>;
}

function DeleteDialog({ reportId, deleting, onCancel, onDelete }: { reportId: string; deleting: boolean; onCancel: () => void; onDelete: () => void }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-[#132421]/55 p-5" role="dialog" aria-modal="true" aria-labelledby="delete-title"><Card className="w-full max-w-lg rounded-3xl shadow-surface"><CardContent className="p-6 sm:p-7"><span className="grid size-11 place-items-center rounded-2xl bg-[#fff1ef] text-danger"><Trash2 size={21} /></span><p className="eyebrow mt-5 text-danger">Permanent action</p><h2 className="mt-2 font-display text-2xl font-bold" id="delete-title">Delete this report?</h2><p className="mt-3 text-sm leading-6 text-muted">Deleting <strong className="text-ink">{reportId}</strong> permanently removes the report, its public timeline, and community-verification signals. This cannot be undone.</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" disabled={deleting} onClick={onCancel}>Keep report</Button><Button variant="danger" disabled={deleting} onClick={onDelete}><Trash2 size={16} /> {deleting ? "Deleting…" : "Delete permanently"}</Button></div></CardContent></Card></div>; }

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{value}</p></div>; }

function formatDate(value: string) { return new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }); }

function isWithinCustomRange(value: Date, fromDate: string, toDate: string) {
  if (fromDate && value < new Date(`${fromDate}T00:00:00`)) return false;
  if (toDate && value > new Date(`${toDate}T23:59:59.999`)) return false;
  return true;
}

function cityForLocation(locationLabel: string) {
  const normalized = locationLabel.toLowerCase();
  if (/(kolkata metropolitan area|kolkata|new town|bidhannagar|rajarhat)/.test(normalized)) return "Kolkata Metropolitan Area";
  if (normalized.includes("asansol")) return "Asansol";
  if (normalized.includes("durgapur")) return "Durgapur";
  const parts = locationLabel.split(",").map((part) => part.trim()).filter(Boolean);
  const stateIndex = parts.findIndex((part) => /\b(Andhra Pradesh|Assam|Bihar|Chhattisgarh|Delhi|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Odisha|Punjab|Rajasthan|Tamil Nadu|Telangana|Uttar Pradesh|Uttarakhand|West Bengal)\b/i.test(part));
  return parts[Math.max(0, stateIndex - 1)] || parts[0] || "Unspecified city";
}

function CustomDateRangePicker({ fromDate, toDate, onChange }: { fromDate: string; toDate: string; onChange: (range: { fromDate: string; toDate: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(fromDate ? new Date(`${fromDate}T00:00:00`) : new Date()));
  const today = new Date();
  const selectedStart = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
  const selectedEnd = toDate ? new Date(`${toDate}T00:00:00`) : null;
  const days = getCalendarDays(visibleMonth);

  function pickDate(day: Date) {
    if (day > endOfToday(today)) return;
    const key = toDateInputValue(day);
    if (!fromDate || (fromDate && toDate) || day < (selectedStart ?? day)) {
      onChange({ fromDate: key, toDate: "" });
      return;
    }
    onChange({ fromDate, toDate: key });
    setOpen(false);
  }

  return <div className="relative mt-2">
    <button className="flex h-10 w-full items-center justify-between rounded-lg border border-line bg-white px-3 text-left text-sm font-semibold text-ink" type="button" onClick={() => setOpen((current) => !current)}><span className="flex items-center gap-2"><CalendarDays className="text-brand" size={16} /> {fromDate ? `${formatShortDate(fromDate)}${toDate ? ` — ${formatShortDate(toDate)}` : " — select end date"}` : "Choose a date range"}</span><span className="text-xs text-muted">Calendar</span></button>
    {open ? <><button className="fixed inset-0 z-40 cursor-default bg-black/20 sm:hidden" type="button" aria-label="Close date range calendar" onClick={() => setOpen(false)} /><div className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-line bg-white p-4 shadow-surface sm:absolute sm:inset-auto sm:left-0 sm:top-full sm:z-30 sm:mt-2 sm:w-[22rem] sm:rounded-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Custom date range</p><p className="mt-1 text-xs leading-5 text-muted">Choose a start date, then an end date. Future dates are unavailable.</p></div><button className="rounded-lg border border-line px-2 py-1 text-xs font-bold text-muted" type="button" onClick={() => setOpen(false)}>Close</button></div><div className="mt-4 rounded-xl border border-line bg-[#fbfdfc] p-3"><div className="flex items-center justify-between"><button className="grid size-9 place-items-center rounded-lg border border-line bg-white text-brand" type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}><ChevronLeft size={17} /></button><p className="font-display text-sm font-bold">{visibleMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p><button className="grid size-9 place-items-center rounded-lg border border-line bg-white text-brand disabled:cursor-not-allowed disabled:opacity-35" disabled={startOfMonth(visibleMonth) >= startOfMonth(today)} type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}><ChevronRight size={17} /></button></div><div className="mt-3 grid grid-cols-7 gap-1 text-center text-[0.68rem] font-bold uppercase text-muted">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1">{days.map((day, index) => { if (!day) return <span className="aspect-square" key={`blank-${index}`} />; const disabled = day > endOfToday(today); const isStart = selectedStart && sameDate(day, selectedStart); const isEnd = selectedEnd && sameDate(day, selectedEnd); const inRange = selectedStart && selectedEnd && day > selectedStart && day < selectedEnd; return <button className={`aspect-square rounded-lg text-sm font-bold transition ${isStart || isEnd ? "bg-brand text-white" : disabled ? "cursor-not-allowed bg-transparent text-[#b8c2bf]" : inRange ? "bg-brand-soft text-brand" : "bg-white hover:bg-brand-soft hover:text-brand"}`} disabled={disabled} key={toDateInputValue(day)} type="button" onClick={() => pickDate(day)}>{day.getDate()}</button>; })}</div></div><button className="mt-3 text-xs font-bold text-brand underline underline-offset-4" type="button" onClick={() => onChange({ fromDate: "", toDate: "" })}>Clear date range</button></div></> : null}
  </div>;
}

function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function addMonths(date: Date, count: number) { return new Date(date.getFullYear(), date.getMonth() + count, 1); }
function getCalendarDays(month: Date) { const first = startOfMonth(month); const last = new Date(month.getFullYear(), month.getMonth() + 1, 0); const days: Array<Date | null> = Array.from({ length: first.getDay() }, () => null); for (let day = 1; day <= last.getDate(); day += 1) days.push(new Date(month.getFullYear(), month.getMonth(), day)); return days; }
function toDateInputValue(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function sameDate(first: Date, second: Date) { return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate(); }
function endOfToday(today: Date) { return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999); }
function formatShortDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
