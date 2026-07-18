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

    function loadWithCurrentLocation() {
      if (!navigator.geolocation) {
        loadReports();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => loadReports({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        () => loadReports(),
        { enableHighAccuracy: true, maximumAge: 120000, timeout: 7000 },
      );
    }

    loadWithCurrentLocation();
    window.addEventListener("civicshield:emergency-created", loadWithCurrentLocation);

    return () => {
      window.removeEventListener("civicshield:emergency-created", loadWithCurrentLocation);
      controller.abort();
    };
  }, []);

  if (!reports.length) return null;

  return (
    <div className="border-b border-[#f0cfc8] bg-[#fff4f1] text-[#7c2922]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-2 text-xs font-bold sm:text-sm">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-danger">
          <AlertTriangle aria-hidden="true" size={14} /> Priority alerts
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="emergency-marquee inline-flex gap-8 whitespace-nowrap">
            {[...reports, ...reports].map((report, index) => (
              <Link className="inline-flex items-center gap-1.5 hover:underline" href={`/emergency?type=${getEmergencyTypeParam(report.type)}`} key={`${report.id}-${index}`}>
                <MapPin aria-hidden="true" size={13} />
                <span className={getPriorityClass(report.priority)}>{(report.priority ?? "medium").toUpperCase()}</span>
                {report.type} lodged near {report.locationLabel} · {formatRelative(report.createdAt)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getEmergencyTypeParam(type: string) {
  const normalized = type.toLowerCase();
  if (normalized.includes("women")) return "women";
  if (normalized.includes("fire")) return "fire";
  if (normalized.includes("medical")) return "medical";
  if (normalized.includes("wire") || normalized.includes("electric")) return "electrical";
  if (normalized.includes("accident")) return "accident";
  return "unsafe";
}

function getPriorityClass(priority?: EmergencyReport["priority"]) {
  if (priority === "critical") return "rounded-full bg-danger px-2 py-0.5 text-white";
  if (priority === "high") return "rounded-full bg-[#fff0ed] px-2 py-0.5 text-danger";
  if (priority === "medium") return "rounded-full bg-[#fff6df] px-2 py-0.5 text-[#8a550e]";
  return "rounded-full bg-white px-2 py-0.5 text-muted";
}

function formatRelative(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
