import { NextResponse } from "next/server";

import { hasModeratorSession } from "@/lib/moderator/auth";
import { deleteCivicSenseSubmission } from "@/lib/supabase/civic-sense";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ submissionId: string }> }) {
  if (!hasModeratorSession(request.headers.get("cookie"))) return NextResponse.json({ error: "Moderator sign-in required." }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Civic Sense queue is not configured." }, { status: 503 });
  const { submissionId } = await params;
  try {
    await deleteCivicSenseSubmission(submissionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Civic Sense post could not be deleted." }, { status: 500 });
  }
}
