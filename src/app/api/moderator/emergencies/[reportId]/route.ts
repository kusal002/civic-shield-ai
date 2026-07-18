import { NextResponse } from "next/server";

import { hasModeratorSession } from "@/lib/moderator/auth";
import { deleteModeratorEmergencyReport } from "@/lib/supabase/emergency";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  if (!hasModeratorSession(request.headers.get("cookie"))) return NextResponse.json({ error: "Moderator sign-in required." }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Emergency tracking is not configured." }, { status: 503 });
  const { reportId } = await params;
  try {
    await deleteModeratorEmergencyReport(reportId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Emergency report could not be deleted." }, { status: 500 });
  }
}
