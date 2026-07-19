import { NextResponse } from "next/server";

import { hasModeratorSession } from "@/lib/moderator/auth";
import { getModeratorCivicSenseSubmissions } from "@/lib/supabase/civic-sense";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!hasModeratorSession(request.headers.get("cookie"))) return NextResponse.json({ error: "Moderator sign-in required." }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Civic Sense queue is not configured." }, { status: 503 });
  try {
    return NextResponse.json({ submissions: await getModeratorCivicSenseSubmissions() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Civic Sense submissions could not be loaded." }, { status: 500 });
  }
}
