"use client";

import { AlertTriangle, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { EmergencyReport } from "@/types/report";

type Coordinates = { latitude: number; longitude: number };

export function EmergencyAlertMarquee() {
  const [reports, setReports] = useState<EmergencyReport[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    function loadReports(coordinates?: Coordinates) {
      const query = coordinates ? `?lat=${coordinates.latitude}&lon=${coordinates.longitude}&radiusKm=5` : "";
      fetch(`/api/emergency-reports${query}`, { signal: controller.signal })
        .then((response) => response.json())
        .then((payload: { reports?: EmergencyReport[] }) => setReports(payload.reports ?? []))
        .catch(() => setReports([]));
    }

    if (!navigator.geolocation) {
      loadReports();
      return () => controller.abort();
    }

    navigator.geolocation.getCurrentPosition(
      (position) => loadReports({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => loadReports(),
      { enableHighAccuracy: true, maximumAge: 120000, timeout: 7000 },
    );

    return () => controller.abort();
  }, []);

  if (!reports.length) return null;

  return (
    <div className="border-b border-[#f0cfc8] bg-[#fff4f1] text-[#7c2922]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-2 text-xs font-bold sm:text-sm">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-danger">
          <AlertTriangle aria-hidden="true" size={14} /> Nearby alerts
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="emergency-marquee inline-flex gap-8 whitespace-nowrap">
            {[...reports, ...reports].map((report, index) => (
              <Link className="inline-flex items-center gap-1.5 hover:underline" href={`/emergency?type=${report.type === "Women safety" ? "women" : "unsafe"}`} key={`${report.id}-${index}`}>
                <MapPin aria-hidden="true" size={13} />
                {report.type} lodged near {report.locationLabel} · {formatRelative(report.createdAt)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelative(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
