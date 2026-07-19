import { NextResponse } from "next/server";

import { hasModeratorSession } from "@/lib/moderator/auth";
import { updateCivicSenseStatus } from "@/lib/supabase/civic-sense";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { CivicSenseStatus } from "@/types/report";

const allowed: CivicSenseStatus[] = ["needs-review", "approved", "posted", "rejected"];

export async function POST(request: Request, { params }: { params: Promise<{ submissionId: string }> }) {
  if (!hasModeratorSession(request.headers.get("cookie"))) return NextResponse.json({ error: "Moderator sign-in required." }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Civic Sense queue is not configured." }, { status: 503 });
  const { submissionId } = await params;
  const body = await request.json() as { status?: CivicSenseStatus };
  if (!body.status || !allowed.includes(body.status)) return NextResponse.json({ error: "Valid status is required." }, { status: 400 });
  try {
    await updateCivicSenseStatus(submissionId, body.status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Status could not be updated." }, { status: 500 });
  }
}
