"use client";

import { AlertTriangle, BellRing, Clock3, MapPin, ShieldCheck, Sparkles, Venus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EmergencyReport, PublicCivicReport } from "@/types/report";

type Coordinates = { latitude: number; longitude: number };

const VISIT_STORAGE_KEY = "civicshield:visited-places";

export function LocationSafetySnapshot({ compact = false }: { compact?: boolean }) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [visitCount, setVisitCount] = useState(0);
  const [civicReports, setCivicReports] = useState<PublicCivicReport[]>([]);
  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>([]);
  const [status, setStatus] = useState<"requesting" | "loading" | "ready" | "blocked">("requesting");

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoordinates(nextCoordinates);
        setVisitCount(trackVisit(nextCoordinates));
      },
      () => setStatus("blocked"),
      { enableHighAccuracy: true, maximumAge: 120000, timeout: 8000 },
    );
  }, []);

  useEffect(() => {
    if (!coordinates) return;
    const currentCoordinates = coordinates;
    const controller = new AbortController();

    async function loadLocationName() {
      try {
        const response = await fetch(`/api/geocode?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}`, { signal: controller.signal });
        const payload = await response.json() as { label?: string };
        if (response.ok && payload.label) setLocationLabel(payload.label);
      } catch {
        setLocationLabel("");
      }
    }

    loadLocationName();
    return () => controller.abort();
  }, [coordinates]);

  useEffect(() => {
    if (!coordinates) return;
    const currentCoordinates = coordinates;
    const controller = new AbortController();

    async function loadNearbySignals() {
      setStatus("loading");
      try {
        const [civicResponse, emergencyResponse] = await Promise.all([
          fetch(`/api/public-reports?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}&radiusKm=5`, { signal: controller.signal }),
          fetch(`/api/emergency-reports?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}&radiusKm=5`, { signal: controller.signal }),
        ]);
        const civicPayload = await civicResponse.json() as { reports?: PublicCivicReport[] };
        const emergencyPayload = await emergencyResponse.json() as { reports?: EmergencyReport[] };
        setCivicReports(filterLast24Hours(civicPayload.reports ?? []));
        setEmergencyReports(filterLast24Hours(emergencyPayload.reports ?? []));
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("ready");
      }
    }

    loadNearbySignals();
    return () => controller.abort();
  }, [coordinates]);

  const totalSignals = civicReports.length + emergencyReports.length;
  const isNewPlace = visitCount <= 1;
  const locationName = locationLabel || (coordinates ? "Current detected location" : "Location check needed");
  const womenSignals = emergencyReports.filter((report) => report.type.toLowerCase().includes("women"));
  const safetyTone = totalSignals > 0 ? "caution" : "safe";

  const headline = useMemo(() => {
    if (status === "blocked") return "Turn on location to unlock nearby safety";
    if (status !== "ready") return "Checking your current location";
    if (totalSignals > 0 && isNewPlace) return "You are new here. Look out for these recent signals.";
    if (totalSignals > 0) return "Recent safety signals near this location.";
    if (isNewPlace) return "You are new here, and the last 24 hours look calm.";
    return "This location looks calm right now.";
  }, [isNewPlace, status, totalSignals]);

  return (
    <section className={`relative overflow-hidden rounded-[1.75rem] border bg-white shadow-surface ${compact ? "border-line p-5" : "max-h-[44rem] border-white/80"}`}>
      <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#ddf5ed]" />
      <div className={compact ? "" : "border-b border-line bg-[#fbfdfc] px-6 py-5"}>
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Live place safety</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">CivicShield around you</h2>
          </div>
          <Badge tone={safetyTone}>{totalSignals ? `${totalSignals} recent` : "Clear"}</Badge>
        </div>
        <div className="relative mt-4 rounded-2xl border border-line bg-white p-4">
          <p className="flex items-start gap-2 text-sm font-bold leading-6 text-ink">
            <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-brand" size={16} />
            {locationName}
          </p>
          {coordinates ? (
            <p className="mt-1 text-xs text-muted">{visitCount > 1 ? `Visited ${visitCount} times from this browser` : "First detected visit from this browser"}</p>
          ) : null}
        </div>
      </div>

      <div className={compact ? "relative mt-5" : "relative space-y-5 p-6"}>
        <div className={`rounded-2xl border p-4 ${totalSignals ? "border-[#f0d0c9] bg-[#fff8f6]" : "border-[#cbe8dd] bg-[#effaf5]"}`}>
          <div className="flex items-start gap-3">
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${totalSignals ? "bg-[#ffe4df] text-danger" : "bg-white text-brand"}`}>
              {totalSignals ? <BellRing aria-hidden="true" size={19} /> : <ShieldCheck aria-hidden="true" size={19} />}
            </span>
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.12em] ${totalSignals ? "text-danger" : "text-brand"}`}>
                {status === "ready" ? "24-hour safety read" : "Safety read"}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold leading-6">{headline}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {totalSignals ? "Review recent civic complaints and emergency reports before moving through the area." : "No nearby civic or emergency reports were lodged in the last 24 hours within 5 km."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <SignalTile icon={<AlertTriangle aria-hidden="true" size={16} />} label="Civic complaints" value={civicReports.length} />
          <SignalTile icon={<BellRing aria-hidden="true" size={16} />} label="Emergencies" value={emergencyReports.length} />
          <SignalTile icon={<Venus aria-hidden="true" size={16} />} label="Women safety" value={womenSignals.length} />
        </div>

        {totalSignals ? (
          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {emergencyReports.slice(0, 3).map((report) => <SignalRow key={report.id} title={report.type} detail={report.locationLabel} time={report.createdAt} tone="danger" />)}
            {civicReports.slice(0, 3).map((report) => <SignalRow key={report.id} title={report.category ?? "Civic complaint"} detail={report.locationLabel} time={report.createdAt} tone="brand" />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#cbe8dd] bg-[#f7fcfa] p-4 text-sm leading-6 text-[#31544b]">
            <p className="font-bold">You are good to go.</p>
            <p className="mt-1">Stay aware, keep location sharing handy, and use women safety help if the surroundings feel unsafe.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="min-w-0 px-2 text-xs sm:px-3 sm:text-sm">
            <Link href="/dashboard"><Sparkles aria-hidden="true" size={16} /> Open safety dashboard</Link>
          </Button>
          <Button asChild className="min-w-0 px-2 text-xs sm:px-3 sm:text-sm bg-[#a22a58] hover:bg-[#872047]">
            <Link href="/emergency?type=women"><Venus aria-hidden="true" size={16} /> Women safety</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SignalTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-[#fbfdfc] p-3">
      <div className="flex items-center gap-2 text-brand">{icon}<p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted">{label}</p></div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function SignalRow({ title, detail, time, tone }: { title: string; detail: string; time: string; tone: "danger" | "brand" }) {
  return (
    <article className="rounded-2xl border border-line bg-[#fbfdfc] p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-bold ${tone === "danger" ? "text-danger" : "text-brand"}`}>{title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{detail}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[0.68rem] font-bold text-muted">{formatRelative(time)}</span>
      </div>
    </article>
  );
}

function filterLast24Hours<T extends { createdAt: string }>(items: T[]) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return items.filter((item) => new Date(item.createdAt).getTime() >= cutoff);
}

function trackVisit(coordinates: Coordinates) {
  const key = `${coordinates.latitude.toFixed(2)},${coordinates.longitude.toFixed(2)}`;
  try {
    const visits = JSON.parse(localStorage.getItem(VISIT_STORAGE_KEY) ?? "{}") as Record<string, number>;
    const nextCount = (visits[key] ?? 0) + 1;
    localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify({ ...visits, [key]: nextCount }));
    return nextCount;
  } catch {
    return 1;
  }
}

function formatRelative(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return <Clock3 aria-hidden="true" size={12} />;
}
