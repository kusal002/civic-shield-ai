"use client";

import { MapPin, ShieldAlert } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function QuickIncidentRecord() {
  const [type, setType] = useState("Unsafe area");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [isSafe, setIsSafe] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!location.trim()) return setStatus("Add a location or landmark before saving.");
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/emergency-reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ report: { type, locationLabel: location.trim(), details: details.trim() || null, isSafe } }) });
      const result = await response.json() as { emergencyId?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "The incident record could not be saved.");
      setStatus(`Incident record saved: ${result.emergencyId ?? "recorded"}`);
      setDetails("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The incident record could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="rounded-3xl border border-[#efc7bf] bg-white p-5 shadow-surface sm:p-6">
    <p className="eyebrow text-danger">Emergency note</p>
    <h2 className="mt-2 font-display text-xl font-bold tracking-tight">Raise a quick incident record</h2>
    <p className="mt-2 text-sm leading-6 text-muted">This creates a CivicShield record. For immediate danger, call 112 first.</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-[0.7fr_1.3fr]">
      <select className="h-11 rounded-xl border border-line bg-[#fbfdfc] px-3 text-sm font-semibold outline-none focus:border-danger" value={type} onChange={(event) => setType(event.target.value)}><option>Unsafe area</option><option>Women safety</option><option>Accident</option><option>Fire</option><option>Medical</option><option>Live wire</option></select>
      <label className="flex items-center gap-2 rounded-xl border border-line bg-[#fbfdfc] px-3"><MapPin className="text-muted" size={16} /><input className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location or landmark" /></label>
    </div>
    <input className="mt-2 h-11 w-full rounded-xl border border-line bg-[#fbfdfc] px-3 text-sm outline-none focus:border-danger" value={details} onChange={(event) => setDetails(event.target.value)} placeholder="One short detail (optional)" />
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><label className="flex items-center gap-2 text-xs font-semibold text-muted"><input checked={isSafe} className="size-4 accent-[#be3b31]" onChange={(event) => setIsSafe(event.target.checked)} type="checkbox" /> I am away from immediate danger</label><Button type="button" variant="danger" disabled={saving} onClick={() => void save()}>{saving ? "Saving…" : <><ShieldAlert size={16} /> Save record</>}</Button></div>
    {status ? <p className={`mt-3 text-sm font-semibold ${status.startsWith("Incident") ? "text-brand" : "text-danger"}`} role="status">{status}</p> : null}
  </section>;
}
