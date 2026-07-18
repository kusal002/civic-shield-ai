import { NextResponse } from "next/server";

import { createEmergencyReport, getEmergencyReports } from "@/lib/supabase/emergency";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ reports: [] });

  const url = new URL(request.url);
  const latitude = Number(url.searchParams.get("lat"));
  const longitude = Number(url.searchParams.get("lon"));
  const radiusKm = Number(url.searchParams.get("radiusKm") ?? 5);

  try {
    const reports = await getEmergencyReports({
      latitude: Number.isFinite(latitude) ? latitude : undefined,
      longitude: Number.isFinite(longitude) ? longitude : undefined,
      radiusKm: Number.isFinite(radiusKm) ? radiusKm : 5,
      limit: 12,
    });
    return NextResponse.json({ reports });
  } catch {
    return NextResponse.json({ reports: [] });
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Emergency reporting is not configured." }, { status: 503 });

  const body = await request.json() as {
    report?: {
      type?: string;
      locationLabel?: string;
      latitude?: number | null;
      longitude?: number | null;
      details?: string | null;
      isSafe?: boolean;
    };
  };
  const report = body.report;
  if (!report?.type || !report.locationLabel) {
    return NextResponse.json({ error: "Emergency type and location are required." }, { status: 400 });
  }

  try {
    const emergencyId = await createEmergencyReport({
      type: report.type,
      locationLabel: report.locationLabel,
      latitude: report.latitude,
      longitude: report.longitude,
      details: report.details,
      isSafe: Boolean(report.isSafe),
    });
    return NextResponse.json({ emergencyId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Emergency report could not be saved." }, { status: 500 });
  }
}
