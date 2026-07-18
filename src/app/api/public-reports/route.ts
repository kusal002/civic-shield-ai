import { NextResponse } from "next/server";

import { getNearbyPublicReports, getPublicReports } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Public tracking is not configured." }, { status: 503 });

  const url = new URL(request.url);
  const latitude = Number(url.searchParams.get("lat"));
  const longitude = Number(url.searchParams.get("lon"));
  const radiusKm = Number(url.searchParams.get("radiusKm") ?? 10);

  try {
    const reports = Number.isFinite(latitude) && Number.isFinite(longitude)
      ? await getNearbyPublicReports(latitude, longitude, Number.isFinite(radiusKm) ? radiusKm : 10)
      : await getPublicReports();
    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Reports could not be loaded." }, { status: 500 });
  }
}
