import { NextResponse } from "next/server";

import { hasModeratorSession } from "@/lib/moderator/auth";
import { deleteModeratorReport } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  if (!hasModeratorSession(request.headers.get("cookie"))) return NextResponse.json({ error: "Moderator sign-in required." }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Persistent tracking is not configured." }, { status: 503 });
  const { reportId } = await params;
  try { await deleteModeratorReport(reportId); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Report could not be deleted." }, { status: 500 }); }
}
