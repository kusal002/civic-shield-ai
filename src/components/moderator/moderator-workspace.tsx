"use client";

import { AlertTriangle, Building2, Eye, MapPin, RefreshCw, ShieldAlert, ShieldCheck, Trash2, Venus } from "lucide-react";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Eye, Filter, ShieldCheck, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EmergencyReport, ReportStatus, UrgencyLevel } from "@/types/report";

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
  const [activeTab, setActiveTab] = useState<"civic" | "emergency">("emergency");
  const [reports, setReports] = useState<ModeratorReport[]>([]);
  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>([]);
  const [selected, setSelected] = useState<ModeratorReport | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyReport | null>(null);
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
      const [civicResponse, emergencyResponse] = await Promise.all([
        fetch("/api/moderator/reports", { cache: "no-store" }),
        fetch("/api/moderator/emergencies", { cache: "no-store" }),
      ]);
      const civicPayload = await civicResponse.json() as { reports?: ModeratorReport[]; error?: string };
      const emergencyPayload = await emergencyResponse.json() as { reports?: EmergencyReport[]; error?: string };
      if (!civicResponse.ok) throw new Error(civicPayload.error ?? "Could not load civic reports.");
      if (!emergencyResponse.ok) throw new Error(emergencyPayload.error ?? "Could not load emergency reports.");
      setReports(civicPayload.reports ?? []);
      setEmergencyReports(emergencyPayload.reports ?? []);
      setSelected((current) => current ? (civicPayload.reports ?? []).find((report) => report.id === current.id) ?? null : null);
      setSelectedEmergency((current) => current ? (emergencyPayload.reports ?? []).find((report) => report.id === current.id) ?? null : null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load moderator data.");
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setMessage("");
    const response = await fetch("/api/moderator/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessKey }),
    });
    const payload = await response.json() as { error?: string };
    if (!response.ok) {
      setMessage(payload.error ?? "Could not sign in.");
      return;
    }
    setSignedIn(true);
    setAccessKey("");
    await loadReports();
  }

  async function update() {
    if (!selected) return;
    const response = await fetch(`/api/moderator/reports/${encodeURIComponent(selected.id)}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });
    const payload = await response.json() as { error?: string };
    if (!response.ok) {
      setMessage(payload.error ?? "Update failed.");
      return;
    }
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
    if (!response.ok) {
      setMessage(payload.error ?? "Delete failed.");
      return;
    }
    setDeleteOpen(false);
    setSelected(null);
    setMessage("Report deleted.");
    await loadReports();
  }

  return (
    <>
      <main className="min-h-screen bg-canvas p-6 text-ink sm:p-10">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Protected workspace</p>
          <h1 className="mt-3 flex items-center gap-2 font-display text-3xl font-bold">
            <ShieldCheck className="text-brand" /> Moderator controls
          </h1>

          {!signedIn ? (
            <Card className="mt-6 max-w-xl rounded-3xl">
              <CardContent className="p-6">
                <p className="text-sm leading-6 text-muted">Sign in with the server-configured moderator access key.</p>
                <input className="mt-5 h-12 w-full rounded-xl border border-line px-3" type="password" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} placeholder="Moderator access key" />
                <Button className="mt-3" onClick={() => void login()}>Sign in</Button>
                {message ? <p className="mt-4 text-sm font-semibold text-danger">{message}</p> : null}
              </CardContent>
            </Card>
          ) : (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-line bg-surface p-3">
                <div className="flex rounded-2xl bg-[#eef6f3] p-1">
                  <TabButton active={activeTab === "emergency"} onClick={() => setActiveTab("emergency")}>
                    <ShieldAlert size={16} /> Emergency lodged reports
                  </TabButton>
                  <TabButton active={activeTab === "civic"} onClick={() => setActiveTab("civic")}>
                    <Building2 size={16} /> Civic reports
                  </TabButton>
                </div>
                <Button size="sm" variant="outline" onClick={() => void loadReports()}>
                  <RefreshCw size={15} /> {loading ? "Loading..." : "Refresh"}
                </Button>
              </div>

              {activeTab === "emergency" ? (
                <EmergencyModeration reports={emergencyReports} selected={selectedEmergency} onSelect={setSelectedEmergency} />
              ) : (
                <CivicModeration
                  reports={reports}
                  selected={selected}
                  status={status}
                  note={note}
                  onDelete={() => setDeleteOpen(true)}
                  onNoteChange={setNote}
                  onSelect={(report) => {
                    setSelected(report);
                    setStatus(report.status === "ready-to-analyze" || report.status === "delivery-confirmed" ? "acknowledged" : report.status);
                    setNote("");
                  }}
                  onStatusChange={setStatus}
                  onUpdate={() => void update()}
                />
              )}
              {message ? <p className="mt-5 text-sm font-semibold text-brand">{message}</p> : null}
            </div>
          )}
        </div>
      </main>
      {deleteOpen && selected ? <DeleteDialog reportId={selected.id} deleting={deleting} onCancel={() => setDeleteOpen(false)} onDelete={() => void removeReport()} /> : null}
    </>
  );
}

function EmergencyModeration({ reports, selected, onSelect }: { reports: EmergencyReport[]; selected: EmergencyReport | null; onSelect: (report: EmergencyReport) => void }) {
  const womenReports = reports.filter((report) => report.type.toLowerCase().includes("women")).length;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <Card className="rounded-3xl">
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Total emergencies" value={String(reports.length)} />
            <Metric label="Women safety" value={String(womenReports)} tone="women" />
            <Metric label="Unsafe / not safe" value={String(reports.filter((report) => !report.isSafe).length)} tone="danger" />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="font-display text-xl font-bold">Lodged emergency reports</p>
              <p className="mt-1 text-sm text-muted">Newest first from Supabase</p>
            </div>
          </div>
          <div className="mt-5 max-h-[34rem] space-y-2 overflow-y-auto pr-1">
            {reports.length ? reports.map((report) => (
              <button className={`w-full rounded-2xl border p-3 text-left transition ${selected?.id === report.id ? "border-danger bg-[#fff4f1]" : "border-line bg-[#fbfdfc] hover:border-danger/40"}`} key={report.id} onClick={() => onSelect(report)}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-danger">{report.id}</span>
                  <Badge tone={report.isSafe ? "safe" : "urgent"}>{report.isSafe ? "safe now" : "needs review"}</Badge>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-sm font-bold">
                  {report.type.toLowerCase().includes("women") ? <Venus size={15} className="text-[#a22a58]" /> : <ShieldAlert size={15} className="text-danger" />}
                  {report.type}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{report.locationLabel}</p>
                <p className="mt-2 text-xs font-semibold text-muted">{formatDate(report.createdAt)}</p>
              </button>
            )) : <p className="rounded-xl bg-[#fbfdfc] p-4 text-sm text-muted">No emergency reports found.</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="p-6 sm:p-7">
          {selected ? <EmergencyDetail report={selected} /> : (
            <div className="grid min-h-96 place-items-center text-center">
              <div>
                <ShieldAlert className="mx-auto text-danger" size={30} />
                <p className="mt-4 font-display text-xl font-bold">Select an emergency report</p>
                <p className="mt-2 text-sm text-muted">Review location, details, and safety status from lodged emergency alerts.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmergencyDetail({ report }: { report: EmergencyReport }) {
  const mapsUrl = report.latitude && report.longitude ? `https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}` : "";

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold text-danger">{report.id}</p>
          <h2 className="mt-2 flex items-center gap-2 font-display text-2xl font-bold">
            {report.type.toLowerCase().includes("women") ? <Venus className="text-[#a22a58]" size={22} /> : <ShieldAlert className="text-danger" size={22} />}
            {report.type}
          </h2>
        </div>
        <Badge tone={report.isSafe ? "safe" : "urgent"}>{report.isSafe ? "User marked safe" : "User not marked safe"}</Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Info label="Lodged at" value={formatDate(report.createdAt)} />
        <Info label="Emergency type" value={report.type} />
        <Info label="Location" value={report.locationLabel} />
        <Info label="Coordinates" value={report.latitude && report.longitude ? `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}` : "Not available"} />
        <Info label="Details" value={report.details || "No short detail added."} />
        <Info label="Safety checkbox" value={report.isSafe ? "User said they are away from immediate danger." : "User did not confirm they are safe."} />
      </div>

      {mapsUrl ? (
        <a className="mt-6 inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-bold text-white" href={mapsUrl} target="_blank" rel="noreferrer">
          <MapPin size={16} /> Open location on map
        </a>
      ) : null}

      <div className="mt-6 rounded-2xl border border-[#efc7bf] bg-[#fff8f6] p-4 text-sm leading-6 text-[#7e342d]">
        <p className="font-bold">Moderator note</p>
        <p className="mt-1">This is a lodged emergency alert for review and situational awareness. CivicShield does not claim emergency services were contacted.</p>
      </div>
    </>
  );
}

function CivicModeration({
  reports,
  selected,
  status,
  note,
  onDelete,
  onNoteChange,
  onSelect,
  onStatusChange,
  onUpdate,
}: {
  reports: ModeratorReport[];
  selected: ModeratorReport | null;
  status: ReportStatus;
  note: string;
  onDelete: () => void;
  onNoteChange: (note: string) => void;
  onSelect: (report: ModeratorReport) => void;
  onStatusChange: (status: ReportStatus) => void;
  onUpdate: () => void;
}) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="rounded-3xl">
        <CardContent className="p-5">
          <div>
            <p className="font-display text-xl font-bold">Civic reports by date</p>
            <p className="mt-1 text-sm text-muted">Newest first</p>
          </div>
          <div className="mt-5 max-h-[34rem] space-y-2 overflow-y-auto pr-1">
            {reports.length ? reports.map((report) => (
              <button className={`w-full rounded-2xl border p-3 text-left transition ${selected?.id === report.id ? "border-brand bg-brand-soft" : "border-line bg-[#fbfdfc] hover:border-brand/40"}`} key={report.id} onClick={() => onSelect(report)}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-brand">{report.id}</span>
                  <Badge tone={report.status === "verified-resolved" ? "safe" : "caution"}>{report.status.replaceAll("-", " ")}</Badge>
                </div>
                <p className="mt-2 text-sm font-bold">{report.category ?? "Unclassified issue"}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(report.createdAt)}</p>
              </button>
            )) : <p className="rounded-xl bg-[#fbfdfc] p-4 text-sm text-muted">No reports found.</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="p-6 sm:p-7">
          {selected ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-bold text-brand">{selected.id}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold">{selected.category ?? "Civic issue"}</h2>
                </div>
                <Button variant="danger" size="sm" onClick={onDelete}><Trash2 size={15} /> Delete false report</Button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Info label="Submitted" value={formatDate(selected.createdAt)} />
                <Info label="Location" value={selected.locationLabel} />
                <Info label="Issue description" value={selected.description} />
                <Info label="Extra details" value={selected.extraDetails || "None"} />
                <Info label="Evidence" value={`${selected.attachmentCount} file(s), stored privately`} />
                <Info label="Recipient" value={selected.emailRecipient || "Not sent"} />
              </div>
              <div className="mt-6 border-t border-line pt-6">
                <p className="eyebrow">Publish verified action</p>
                <select className="mt-3 h-12 w-full rounded-xl border border-line px-3" value={status} onChange={(event) => onStatusChange(event.target.value as ReportStatus)}>
                  {statuses.map((item) => <option key={item} value={item}>{item.replaceAll("-", " ")}</option>)}
                </select>
                <textarea className="mt-3 min-h-28 w-full rounded-xl border border-line p-3" value={note} onChange={(event) => onNoteChange(event.target.value)} maxLength={280} placeholder="Public status note (required, 280 characters maximum)" />
                <Button className="mt-3" disabled={!note.trim()} onClick={onUpdate}><Eye size={16} /> Publish status update</Button>
              </div>
            </>
          ) : (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <Eye className="mx-auto text-brand" size={28} />
                <p className="mt-4 font-display text-xl font-bold">Select a civic report</p>
                <p className="mt-2 text-sm text-muted">Read the full private report before publishing an action.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${active ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`} onClick={onClick} type="button">{children}</button>;
}

function Metric({ label, tone = "brand", value }: { label: string; tone?: "brand" | "danger" | "women"; value: string }) {
  const color = tone === "danger" ? "text-danger" : tone === "women" ? "text-[#a22a58]" : "text-brand";
  return <div className="rounded-2xl border border-line bg-[#fbfdfc] p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p><p className={`mt-2 font-display text-3xl font-bold ${color}`}>{value}</p></div>;
}

function DeleteDialog({ reportId, deleting, onCancel, onDelete }: { reportId: string; deleting: boolean; onCancel: () => void; onDelete: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#132421]/55 p-5" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <Card className="w-full max-w-lg rounded-3xl shadow-surface">
        <CardContent className="p-6 sm:p-7">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#fff1ef] text-danger"><Trash2 size={21} /></span>
          <p className="eyebrow mt-5 text-danger">Permanent action</p>
          <h2 className="mt-2 font-display text-2xl font-bold" id="delete-title">Delete this report?</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Deleting <strong className="text-ink">{reportId}</strong> permanently removes the report, its public timeline, and community-verification signals. This cannot be undone.</p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" disabled={deleting} onClick={onCancel}>Keep report</Button>
            <Button variant="danger" disabled={deleting} onClick={onDelete}><Trash2 size={16} /> {deleting ? "Deleting..." : "Delete permanently"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{value}</p></div>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}
