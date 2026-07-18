"use client";

import { Building2, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Eye, Filter, MapPin, RefreshCw, ShieldAlert, ShieldCheck, Trash2, Venus } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EmergencyReport, ReportStatus, UrgencyLevel } from "@/types/report";

type ModeratorReport = {
  id: string; description: string; locationLabel: string; latitude: number | null; longitude: number | null;
  duration: string; affectedPeople: number | null; extraDetails: string | null; attachmentCount: number;
  category: string | null; urgency: UrgencyLevel | null; routeName: string | null; status: ReportStatus;
  createdAt: string; updatedAt: string; emailRecipient: string | null; gmailMessageId: string | null;
};
type PresetRange = "all" | "7" | "14" | "30" | "custom";
type Tab = "civic" | "emergency";

const statuses: ReportStatus[] = ["acknowledged", "assigned", "in-progress", "department-resolved", "verification-pending", "verified-resolved", "disputed", "reopened", "overdue"];

export function ModeratorWorkspace() {
  const [accessKey, setAccessKey] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("emergency");
  const [reports, setReports] = useState<ModeratorReport[]>([]);
  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>([]);
  const [selected, setSelected] = useState<ModeratorReport | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyReport | null>(null);
  const [status, setStatus] = useState<ReportStatus>("acknowledged");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [civicSelection, setCivicSelection] = useState<string[]>([]);
  const [emergencySelection, setEmergencySelection] = useState<string[]>([]);
  const [deleteRequest, setDeleteRequest] = useState<{ kind: "civic" | "emergency"; ids: string[] } | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadReports() {
    setLoading(true);
    try {
      const [civicResponse, emergencyResponse] = await Promise.all([
        fetch("/api/moderator/reports", { cache: "no-store" }),
        fetch("/api/moderator/emergencies", { cache: "no-store" }),
      ]);
      const civicPayload = await civicResponse.json() as { reports?: ModeratorReport[]; error?: string };
      const emergencyPayload = await emergencyResponse.json() as { reports?: EmergencyReport[]; error?: string };
      if (!civicResponse.ok) throw new Error(civicPayload.error ?? "Could not load civic reports.");
      if (!emergencyResponse.ok) throw new Error(emergencyPayload.error ?? "Could not load emergency reports.");
      const nextCivic = civicPayload.reports ?? [];
      const nextEmergency = emergencyPayload.reports ?? [];
      setReports(nextCivic);
      setEmergencyReports(nextEmergency);
      setSelected((current) => current ? nextCivic.find((report) => report.id === current.id) ?? null : null);
      setSelectedEmergency((current) => current ? nextEmergency.find((report) => report.id === current.id) ?? null : null);
      setCivicSelection((current) => current.filter((id) => nextCivic.some((report) => report.id === id)));
      setEmergencySelection((current) => current.filter((id) => nextEmergency.some((report) => report.id === id)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load moderator data.");
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

  async function publishStatus(ids: string[], nextStatus: ReportStatus, nextNote: string) {
    if (!ids.length) return;
    try {
      await Promise.all(ids.map(async (reportId) => {
        const response = await fetch(`/api/moderator/reports/${encodeURIComponent(reportId)}/status`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus, note: nextNote }),
        });
        const payload = await response.json() as { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Status update failed.");
      }));
      setMessage(`${ids.length} civic report${ids.length === 1 ? "" : "s"} updated.`);
      setCivicSelection([]);
      setNote("");
      await loadReports();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Status update failed.");
    }
  }

  async function confirmDelete() {
    if (!deleteRequest) return;
    setDeleting(true);
    try {
      const endpoint = deleteRequest.kind === "civic" ? "/api/moderator/reports" : "/api/moderator/emergencies";
      await Promise.all(deleteRequest.ids.map(async (reportId) => {
        const response = await fetch(`${endpoint}/${encodeURIComponent(reportId)}`, { method: "DELETE" });
        const payload = await response.json() as { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Delete failed.");
      }));
      const label = deleteRequest.kind === "civic" ? "Civic" : "Emergency";
      setMessage(`${label} report${deleteRequest.ids.length === 1 ? "" : "s"} deleted.`);
      setSelected(null);
      setSelectedEmergency(null);
      setCivicSelection([]);
      setEmergencySelection([]);
      setDeleteRequest(null);
      await loadReports();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  function selectCivic(report: ModeratorReport) {
    setSelected(report);
    setStatus(report.status === "ready-to-analyze" || report.status === "delivery-confirmed" ? "acknowledged" : report.status);
    setNote("");
  }

  return <>
    <main className="min-h-screen bg-canvas p-6 text-ink sm:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Protected workspace</p>
        <h1 className="mt-3 flex items-center gap-2 font-display text-3xl font-bold"><ShieldCheck className="text-brand" /> Moderator controls</h1>
        {!signedIn ? <LoginCard accessKey={accessKey} message={message} onChange={setAccessKey} onLogin={() => void login()} /> : <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-line bg-surface p-3">
            <div className="flex rounded-2xl bg-[#eef6f3] p-1">
              <TabButton active={activeTab === "emergency"} onClick={() => setActiveTab("emergency")}><ShieldAlert size={16} /> Emergency reports</TabButton>
              <TabButton active={activeTab === "civic"} onClick={() => setActiveTab("civic")}><Building2 size={16} /> Civic reports</TabButton>
            </div>
            <Button size="sm" variant="outline" onClick={() => void loadReports()}><RefreshCw size={15} /> {loading ? "Loading…" : "Refresh"}</Button>
          </div>
          {activeTab === "emergency" ? <EmergencyModeration reports={emergencyReports} selected={selectedEmergency} selectedIds={emergencySelection} onDelete={(ids) => setDeleteRequest({ kind: "emergency", ids })} onSelect={setSelectedEmergency} onSelectionChange={setEmergencySelection} /> : <CivicModeration
            reports={reports} selected={selected} selectedIds={civicSelection} status={status} note={note}
            onDelete={(ids) => setDeleteRequest({ kind: "civic", ids })}
            onNoteChange={setNote} onSelect={selectCivic} onSelectionChange={setCivicSelection}
            onStatusChange={setStatus} onUpdate={() => void publishStatus(selected ? [selected.id] : [], status, note)}
            onBulkUpdate={(nextStatus, nextNote) => void publishStatus(civicSelection, nextStatus, nextNote)}
          />}
          {message ? <p className="mt-5 rounded-xl bg-brand-soft px-3 py-2 text-sm font-semibold text-brand" role="status">{message}</p> : null}
        </div>}
      </div>
    </main>
    {deleteRequest ? <DeleteDialog kind={deleteRequest.kind} reportCount={deleteRequest.ids.length} deleting={deleting} onCancel={() => setDeleteRequest(null)} onDelete={() => void confirmDelete()} /> : null}
  </>;
}

function LoginCard({ accessKey, message, onChange, onLogin }: { accessKey: string; message: string; onChange: (value: string) => void; onLogin: () => void }) {
  return <Card className="mt-6 max-w-xl rounded-3xl"><CardContent className="p-6"><p className="text-sm leading-6 text-muted">Sign in with the server-configured moderator access key.</p><input className="mt-5 h-12 w-full rounded-xl border border-line px-3" type="password" value={accessKey} onChange={(event) => onChange(event.target.value)} placeholder="Moderator access key" /><Button className="mt-3" onClick={onLogin}>Sign in</Button>{message ? <p className="mt-4 text-sm font-semibold text-danger">{message}</p> : null}</CardContent></Card>;
}

function EmergencyModeration({ reports, selected, selectedIds, onDelete, onSelect, onSelectionChange }: { reports: EmergencyReport[]; selected: EmergencyReport | null; selectedIds: string[]; onDelete: (ids: string[]) => void; onSelect: (report: EmergencyReport) => void; onSelectionChange: (ids: string[]) => void }) {
  const [city, setCity] = useState("all");
  const cities = useMemo(() => citiesFor(reports), [reports]);
  const filtered = useMemo(() => reports.filter((report) => city === "all" || cityForLocation(report.locationLabel) === city), [city, reports]);
  const womenReports = reports.filter((report) => report.type.toLowerCase().includes("women")).length;
  const allFilteredSelected = filtered.length > 0 && filtered.every((report) => selectedIds.includes(report.id));
  function toggle(id: string) { onSelectionChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]); }
  function toggleAll() { onSelectionChange(allFilteredSelected ? selectedIds.filter((id) => !filtered.some((report) => report.id === id)) : [...new Set([...selectedIds, ...filtered.map((report) => report.id)])]); }
  return <div className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
    <Card className="rounded-3xl"><CardContent className="p-5">
      <div className="grid gap-3 sm:grid-cols-3"><Metric label="Total emergencies" value={String(reports.length)} /><Metric label="Women safety" value={String(womenReports)} tone="women" /><Metric label="Not marked safe" value={String(reports.filter((report) => !report.isSafe).length)} tone="danger" /></div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3"><div><p className="font-display text-xl font-bold">Lodged emergency reports</p><p className="mt-1 text-sm text-muted">Newest first · {filtered.length} shown</p></div><CitySelect cities={cities} value={city} onChange={setCity} /></div>
      {selectedIds.length ? <div className="mt-4 rounded-2xl border border-[#efc7bf] bg-[#fff8f6] p-3"><p className="text-sm font-bold text-danger">{selectedIds.length} emergency report{selectedIds.length === 1 ? "" : "s"} selected</p><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="danger" onClick={() => onDelete(selectedIds)}><Trash2 size={14} /> Delete selected</Button><button className="text-xs font-bold text-danger underline underline-offset-4" type="button" onClick={() => onSelectionChange([])}>Clear selection</button></div></div> : null}
      <div className="mt-5 flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-xs font-bold text-muted"><input className="size-4 accent-[#c73c31]" type="checkbox" checked={allFilteredSelected} onChange={toggleAll} /> Select filtered</label></div>
      <div className="mt-3 max-h-[31rem] space-y-2 overflow-y-auto pr-1">{filtered.length ? filtered.map((report) => <article className={`flex gap-3 rounded-2xl border p-3 transition ${selected?.id === report.id ? "border-danger bg-[#fff4f1]" : "border-line bg-[#fbfdfc] hover:border-danger/40"}`} key={report.id}><input aria-label={`Select ${report.id}`} className="mt-1 size-4 shrink-0 accent-[#c73c31]" type="checkbox" checked={selectedIds.includes(report.id)} onChange={() => toggle(report.id)} /><button className="min-w-0 flex-1 text-left" type="button" onClick={() => onSelect(report)}><div className="flex items-center justify-between gap-2"><span className="font-mono text-xs font-bold text-danger">{report.id}</span><Badge tone={report.isSafe ? "safe" : "urgent"}>{report.isSafe ? "safe now" : "needs review"}</Badge></div><p className="mt-2 flex items-center gap-1.5 text-sm font-bold">{report.type.toLowerCase().includes("women") ? <Venus size={15} className="text-[#a22a58]" /> : <ShieldAlert size={15} className="text-danger" />}{report.type}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{report.locationLabel}</p><p className="mt-2 text-xs font-semibold text-muted">{formatDate(report.createdAt)}</p></button></article>) : <p className="rounded-xl bg-[#fbfdfc] p-4 text-sm text-muted">No emergency reports match this city.</p>}</div>
    </CardContent></Card>
    <Card className="rounded-3xl"><CardContent className="p-6 sm:p-7">{selected ? <EmergencyDetail report={selected} onDelete={() => onDelete([selected.id])} /> : <EmptyState icon={<ShieldAlert className="mx-auto text-danger" size={30} />} title="Select an emergency report" detail="Review location, details, and safety status from lodged emergency alerts." />}</CardContent></Card>
  </div>;
}

function EmergencyDetail({ report, onDelete }: { report: EmergencyReport; onDelete: () => void }) {
  const mapsUrl = mapsLink(report.latitude, report.longitude);
  return <>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-danger">{report.id}</p><h2 className="mt-2 flex items-center gap-2 font-display text-2xl font-bold">{report.type.toLowerCase().includes("women") ? <Venus className="text-[#a22a58]" size={22} /> : <ShieldAlert className="text-danger" size={22} />}{report.type}</h2></div><div className="flex items-center gap-2"><Badge tone={report.isSafe ? "safe" : "urgent"}>{report.isSafe ? "User marked safe" : "User not marked safe"}</Badge><Button variant="danger" size="sm" onClick={onDelete}><Trash2 size={15} /> Delete</Button></div></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2"><Info label="Lodged at" value={formatDate(report.createdAt)} /><Info label="Emergency type" value={report.type} /><Info label="Location" value={report.locationLabel} /><Info label="Coordinates" value={coordinateText(report.latitude, report.longitude)} /><Info label="Details" value={report.details || "No short detail added."} /><Info label="Safety checkbox" value={report.isSafe ? "User said they are away from immediate danger." : "User did not confirm they are safe."} /></div>
    {mapsUrl ? <MapLink href={mapsUrl} label="Open location on Google Maps" tone="danger" /> : null}
    <div className="mt-6 rounded-2xl border border-[#efc7bf] bg-[#fff8f6] p-4 text-sm leading-6 text-[#7e342d]"><p className="font-bold">Moderator note</p><p className="mt-1">This is a lodged emergency alert for review and situational awareness. CivicShield does not claim emergency services were contacted.</p></div>
  </>;
}

function CivicModeration({ reports, selected, selectedIds, status, note, onDelete, onBulkUpdate, onNoteChange, onSelect, onSelectionChange, onStatusChange, onUpdate }: { reports: ModeratorReport[]; selected: ModeratorReport | null; selectedIds: string[]; status: ReportStatus; note: string; onDelete: (ids: string[]) => void; onBulkUpdate: (status: ReportStatus, note: string) => void; onNoteChange: (note: string) => void; onSelect: (report: ModeratorReport) => void; onSelectionChange: (ids: string[]) => void; onStatusChange: (status: ReportStatus) => void; onUpdate: () => void }) {
  const [range, setRange] = useState<PresetRange>("all");
  const [city, setCity] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const cities = useMemo(() => citiesFor(reports), [reports]);
  const filtered = useMemo(() => reports.filter((report) => matchesFilters(report, city, range, fromDate, toDate)), [city, fromDate, range, reports, toDate]);
  const allFilteredSelected = filtered.length > 0 && filtered.every((report) => selectedIds.includes(report.id));
  function toggle(id: string) { onSelectionChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]); }
  function toggleAll() { onSelectionChange(allFilteredSelected ? selectedIds.filter((id) => !filtered.some((report) => report.id === id)) : [...new Set([...selectedIds, ...filtered.map((report) => report.id)])]); }
  return <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
    <Card className="rounded-3xl"><CardContent className="p-5">
      <div><p className="font-display text-xl font-bold">Civic reports by date</p><p className="mt-1 text-sm text-muted">Newest first · {filtered.length} shown</p></div>
      <div className="mt-5 rounded-2xl border border-line bg-[#fbfdfc] p-3"><div className="flex items-center gap-2"><Filter size={16} className="text-brand" /><p className="text-sm font-bold">Filter reports</p></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><label className="text-xs font-bold text-muted">Date range<select className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-2 text-sm font-normal text-ink" value={range} onChange={(event) => setRange(event.target.value as PresetRange)}><option value="all">All time</option><option value="7">Past 7 days</option><option value="14">Past 2 weeks</option><option value="30">Past month</option><option value="custom">Custom range</option></select></label><CitySelect cities={cities} value={city} onChange={setCity} /></div>{range === "custom" ? <DateRangePicker fromDate={fromDate} toDate={toDate} onChange={({ fromDate: start, toDate: end }) => { setFromDate(start); setToDate(end); }} /> : null}</div>
      {selectedIds.length ? <BulkActions count={selectedIds.length} onDelete={() => onDelete(selectedIds)} onInProgress={() => onBulkUpdate("in-progress", "Moderator bulk update: investigation is in progress.")} onResolved={() => onBulkUpdate("department-resolved", "Moderator bulk update: department resolution recorded; community verification is pending.")} /> : null}
      <div className="mt-5 flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-xs font-bold text-muted"><input className="size-4 accent-[#076b5a]" type="checkbox" checked={allFilteredSelected} onChange={toggleAll} /> Select filtered</label>{selectedIds.length ? <button className="text-xs font-bold text-brand underline underline-offset-4" type="button" onClick={() => onSelectionChange([])}>Clear selection</button> : null}</div>
      <div className="mt-3 max-h-[31rem] space-y-2 overflow-y-auto pr-1">{filtered.length ? filtered.map((report) => <article className={`flex gap-3 rounded-2xl border p-3 transition ${selected?.id === report.id ? "border-brand bg-brand-soft" : "border-line bg-[#fbfdfc] hover:border-brand/40"}`} key={report.id}><input aria-label={`Select ${report.id}`} className="mt-1 size-4 shrink-0 accent-[#076b5a]" type="checkbox" checked={selectedIds.includes(report.id)} onChange={() => toggle(report.id)} /><button className="min-w-0 flex-1 text-left" type="button" onClick={() => onSelect(report)}><div className="flex items-center justify-between gap-2"><span className="font-mono text-xs font-bold text-brand">{report.id}</span><Badge tone={report.status === "verified-resolved" ? "safe" : "caution"}>{report.status.replaceAll("-", " ")}</Badge></div><p className="mt-2 text-sm font-bold">{report.category ?? "Unclassified issue"}</p><p className="mt-1 text-xs text-muted">{cityForLocation(report.locationLabel)} · {formatDate(report.createdAt)}</p></button></article>) : <p className="rounded-xl bg-[#fbfdfc] p-4 text-sm text-muted">No reports match these filters.</p>}</div>
    </CardContent></Card>
    <Card className="rounded-3xl"><CardContent className="p-6 sm:p-7">{selected ? <CivicDetail report={selected} status={status} note={note} onDelete={() => onDelete([selected.id])} onNoteChange={onNoteChange} onStatusChange={onStatusChange} onUpdate={onUpdate} /> : <EmptyState icon={<Eye className="mx-auto text-brand" size={28} />} title="Select a civic report" detail="Read the full private report before publishing an action." />}</CardContent></Card>
  </div>;
}

function BulkActions({ count, onDelete, onInProgress, onResolved }: { count: number; onDelete: () => void; onInProgress: () => void; onResolved: () => void }) {
  return <div className="mt-4 rounded-2xl border border-[#b8dfd3] bg-brand-soft p-3"><p className="text-sm font-bold text-brand">{count} report{count === 1 ? "" : "s"} selected</p><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={onInProgress}>Mark in progress</Button><Button size="sm" variant="outline" onClick={onResolved}>Mark department resolved</Button><Button size="sm" variant="danger" onClick={onDelete}><Trash2 size={14} /> Delete selected</Button></div></div>;
}

function CivicDetail({ report, status, note, onDelete, onNoteChange, onStatusChange, onUpdate }: { report: ModeratorReport; status: ReportStatus; note: string; onDelete: () => void; onNoteChange: (note: string) => void; onStatusChange: (status: ReportStatus) => void; onUpdate: () => void }) {
  const mapsUrl = mapsLink(report.latitude, report.longitude);
  return <><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-brand">{report.id}</p><h2 className="mt-2 font-display text-2xl font-bold">{report.category ?? "Civic issue"}</h2></div><div className="flex items-center gap-2">{mapsUrl ? <a className="grid size-9 place-items-center rounded-xl border border-line bg-white text-brand transition hover:bg-brand-soft" href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Open civic report location in Google Maps" title="Open in Google Maps"><MapPin size={16} /><ExternalLink className="sr-only" size={12} /></a> : null}<Button variant="danger" size="sm" onClick={onDelete}><Trash2 size={15} /> Delete false report</Button></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Info label="Submitted" value={formatDate(report.createdAt)} /><Info label="Location" value={report.locationLabel} /><Info label="Coordinates" value={coordinateText(report.latitude, report.longitude)} /><Info label="Issue description" value={report.description} /><Info label="Duration" value={report.duration} /><Info label="People affected" value={report.affectedPeople ? String(report.affectedPeople) : "Not provided"} /><Info label="Extra details" value={report.extraDetails || "None"} /><Info label="Evidence" value={`${report.attachmentCount} file(s), stored privately`} /><Info label="Recipient" value={report.emailRecipient || "Not sent"} /></div><div className="mt-6 border-t border-line pt-6"><p className="eyebrow">Publish verified action</p><select className="mt-3 h-12 w-full rounded-xl border border-line px-3" value={status} onChange={(event) => onStatusChange(event.target.value as ReportStatus)}>{statuses.map((item) => <option key={item} value={item}>{item.replaceAll("-", " ")}</option>)}</select><textarea className="mt-3 min-h-28 w-full rounded-xl border border-line p-3" value={note} onChange={(event) => onNoteChange(event.target.value)} maxLength={280} placeholder="Public status note (required, 280 characters maximum)" /><Button className="mt-3" disabled={!note.trim()} onClick={onUpdate}><Eye size={16} /> Publish status update</Button></div></>;
}

function CitySelect({ cities, value, onChange }: { cities: string[]; value: string; onChange: (value: string) => void }) {
  return <label className="min-w-44 text-xs font-bold text-muted">City<select className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-2 text-sm font-normal text-ink" value={value} onChange={(event) => onChange(event.target.value)}><option value="all">All reported cities</option>{cities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
}

function DateRangePicker({ fromDate, toDate, onChange }: { fromDate: string; toDate: string; onChange: (value: { fromDate: string; toDate: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(fromDate ? new Date(`${fromDate}T00:00:00`) : new Date()));
  const today = endOfToday(new Date());
  const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
  const to = toDate ? new Date(`${toDate}T00:00:00`) : null;
  function select(day: Date) { if (day > today) return; const value = dateKey(day); if (!fromDate || toDate || day < (from ?? day)) return onChange({ fromDate: value, toDate: "" }); onChange({ fromDate, toDate: value }); setOpen(false); }
  return <div className="relative mt-2"><button className="flex h-10 w-full items-center justify-between rounded-lg border border-line bg-white px-3 text-left text-sm font-semibold" type="button" onClick={() => setOpen((value) => !value)}><span className="flex items-center gap-2"><CalendarDays className="text-brand" size={16} />{fromDate ? `${displayDate(fromDate)}${toDate ? ` — ${displayDate(toDate)}` : " — choose end date"}` : "Choose date range"}</span><span className="text-xs text-muted">Calendar</span></button>{open ? <div className="absolute left-0 top-full z-30 mt-2 w-[22rem] max-w-[calc(100vw-4rem)] rounded-2xl border border-line bg-white p-4 shadow-surface"><div className="flex items-center justify-between"><button className="grid size-9 place-items-center rounded-lg border border-line" type="button" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft size={17} /></button><p className="font-display text-sm font-bold">{month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p><button className="grid size-9 place-items-center rounded-lg border border-line disabled:opacity-30" disabled={startOfMonth(month) >= startOfMonth(today)} type="button" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight size={17} /></button></div><p className="mt-2 text-xs text-muted">Choose start and end dates. Future dates are disabled.</p><div className="mt-3 grid grid-cols-7 gap-1 text-center text-[0.68rem] font-bold text-muted">{"SMTWTFS".split("").map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1">{monthDays(month).map((day, index) => { if (!day) return <span key={`blank-${index}`} className="aspect-square" />; const disabled = day > today; const selected = Boolean((from && sameDate(day, from)) || (to && sameDate(day, to))); const between = Boolean(from && to && day > from && day < to); return <button className={`aspect-square rounded-lg text-sm font-bold ${selected ? "bg-brand text-white" : disabled ? "cursor-not-allowed text-[#b8c2bf]" : between ? "bg-brand-soft text-brand" : "bg-[#fbfdfc] hover:bg-brand-soft"}`} disabled={disabled} key={dateKey(day)} type="button" onClick={() => select(day)}>{day.getDate()}</button>; })}</div><button className="mt-3 text-xs font-bold text-brand underline underline-offset-4" type="button" onClick={() => onChange({ fromDate: "", toDate: "" })}>Clear date range</button></div> : null}</div>;
}

function DeleteDialog({ kind, reportCount, deleting, onCancel, onDelete }: { kind: "civic" | "emergency"; reportCount: number; deleting: boolean; onCancel: () => void; onDelete: () => void }) {
  const label = `${reportCount} ${kind} report${reportCount === 1 ? "" : "s"}`;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#132421]/55 p-5" role="dialog" aria-modal="true" aria-labelledby="delete-title"><Card className="w-full max-w-lg rounded-3xl shadow-surface"><CardContent className="p-6 sm:p-7"><span className="grid size-11 place-items-center rounded-2xl bg-[#fff1ef] text-danger"><Trash2 size={21} /></span><p className="eyebrow mt-5 text-danger">Permanent action</p><h2 className="mt-2 font-display text-2xl font-bold" id="delete-title">Delete {label}?</h2><p className="mt-3 text-sm leading-6 text-muted">This permanently removes {label}, including any related public timeline data. This cannot be undone.</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" disabled={deleting} onClick={onCancel}>Keep reports</Button><Button variant="danger" disabled={deleting} onClick={onDelete}><Trash2 size={16} /> {deleting ? "Deleting…" : "Delete permanently"}</Button></div></CardContent></Card></div>;
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) { return <button className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${active ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`} onClick={onClick} type="button">{children}</button>; }
function Metric({ label, tone = "brand", value }: { label: string; tone?: "brand" | "danger" | "women"; value: string }) { const color = tone === "danger" ? "text-danger" : tone === "women" ? "text-[#a22a58]" : "text-brand"; return <div className="rounded-2xl border border-line bg-[#fbfdfc] p-4"><p className="min-h-10 text-xs font-bold uppercase leading-5 tracking-[0.1em] text-muted">{label}</p><p className={`mt-2 font-display text-3xl font-bold ${color}`}>{value}</p></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{value}</p></div>; }
function EmptyState({ detail, icon, title }: { detail: string; icon: React.ReactNode; title: string }) { return <div className="grid min-h-72 place-items-center text-center"><div>{icon}<p className="mt-4 font-display text-xl font-bold">{title}</p><p className="mt-2 text-sm text-muted">{detail}</p></div></div>; }
function MapLink({ href, label, tone = "brand" }: { href: string; label: string; tone?: "brand" | "danger" }) { return <a className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white ${tone === "danger" ? "bg-danger" : "bg-brand"}`} href={href} target="_blank" rel="noreferrer"><MapPin size={16} /> {label} <ExternalLink size={14} /></a>; }
function mapsLink(latitude: number | null, longitude: number | null) { return typeof latitude === "number" && typeof longitude === "number" ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}` : ""; }
function coordinateText(latitude: number | null, longitude: number | null) { return typeof latitude === "number" && typeof longitude === "number" ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : "Not available"; }
function formatDate(value: string) { return new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }); }
function matchesFilters(report: ModeratorReport, city: string, range: PresetRange, fromDate: string, toDate: string) { if (city !== "all" && cityForLocation(report.locationLabel) !== city) return false; const date = new Date(report.createdAt); if (range === "custom") return (!fromDate || date >= new Date(`${fromDate}T00:00:00`)) && (!toDate || date <= new Date(`${toDate}T23:59:59.999`)); if (range === "all") return true; const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - Number(range)); return date >= cutoff; }
function citiesFor(reports: Array<{ locationLabel: string }>) { return [...new Set(reports.map((report) => cityForLocation(report.locationLabel)))].sort((a, b) => a.localeCompare(b)); }
function cityForLocation(label: string) { const lower = label.toLowerCase(); if (/(kolkata metropolitan area|kolkata|new town|bidhannagar|rajarhat)/.test(lower)) return "Kolkata Metropolitan Area"; if (lower.includes("asansol")) return "Asansol"; if (lower.includes("durgapur")) return "Durgapur"; const parts = label.split(",").map((part) => part.trim()).filter(Boolean); const stateIndex = parts.findIndex((part) => /\b(Andhra Pradesh|Assam|Bihar|Chhattisgarh|Delhi|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Odisha|Punjab|Rajasthan|Tamil Nadu|Telangana|Uttar Pradesh|Uttarakhand|West Bengal)\b/i.test(part)); return parts[Math.max(0, stateIndex - 1)] || parts[0] || "Unspecified city"; }
function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function addMonths(date: Date, amount: number) { return new Date(date.getFullYear(), date.getMonth() + amount, 1); }
function monthDays(month: Date) { const first = startOfMonth(month); const last = new Date(month.getFullYear(), month.getMonth() + 1, 0); const days: Array<Date | null> = Array.from({ length: first.getDay() }, () => null); for (let day = 1; day <= last.getDate(); day += 1) days.push(new Date(month.getFullYear(), month.getMonth(), day)); return days; }
function endOfToday(date: Date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999); }
function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function sameDate(first: Date, second: Date) { return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate(); }
function displayDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
