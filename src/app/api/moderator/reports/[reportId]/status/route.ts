import { NextResponse } from "next/server";

import { hasModeratorSession } from "@/lib/moderator/auth";
import { updateReportStatus } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { ReportStatus } from "@/types/report";

const statuses: ReportStatus[] = ["acknowledged", "assigned", "in-progress", "department-resolved", "verification-pending", "verified-resolved", "disputed", "reopened", "overdue"];

export async function POST(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  if (!hasModeratorSession(request.headers.get("cookie"))) return NextResponse.json({ error: "Moderator sign-in required." }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Persistent tracking is not configured." }, { status: 503 });
  const { reportId } = await params;
  const body = (await request.json()) as { status?: ReportStatus; note?: string };
  if (!body.status || !statuses.includes(body.status) || !body.note?.trim() || body.note.trim().length > 280) return NextResponse.json({ error: "Provide a valid status and a note under 280 characters." }, { status: 400 });
  try { await updateReportStatus(reportId, body.status, body.note.trim()); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Status could not be updated." }, { status: 500 }); }
}
