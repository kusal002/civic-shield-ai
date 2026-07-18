import { NextResponse } from "next/server";

import { hasModeratorSession } from "@/lib/moderator/auth";
import { getModeratorReports } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!hasModeratorSession(request.headers.get("cookie"))) return NextResponse.json({ error: "Moderator sign-in required." }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Persistent tracking is not configured." }, { status: 503 });
  try { return NextResponse.json({ reports: await getModeratorReports() }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Reports could not be loaded." }, { status: 500 }); }
}
