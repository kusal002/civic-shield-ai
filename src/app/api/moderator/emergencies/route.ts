import { NextResponse } from "next/server";

import { hasModeratorSession } from "@/lib/moderator/auth";
import { getModeratorEmergencyReports } from "@/lib/supabase/emergency";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!hasModeratorSession(request.headers.get("cookie"))) {
    return NextResponse.json({ error: "Moderator sign-in required." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Emergency tracking is not configured." }, { status: 503 });
  }

  try {
    return NextResponse.json({ reports: await getModeratorEmergencyReports() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Emergency reports could not be loaded." }, { status: 500 });
  }
}
