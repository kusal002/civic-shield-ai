import { NextResponse } from "next/server";

import { savePersistentAnalysis } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { SafetyAnalysis } from "@/types/report";

export async function POST(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Persistent reporting is not configured." }, { status: 503 });
  const { reportId } = await params;
  const body = (await request.json()) as { analysis?: SafetyAnalysis };
  if (!body.analysis) return NextResponse.json({ error: "Analysis is required." }, { status: 400 });
  try {
    await savePersistentAnalysis(reportId, body.analysis);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis could not be saved." }, { status: 500 });
  }
}
