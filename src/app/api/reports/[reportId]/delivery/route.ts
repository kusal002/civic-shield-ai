import { NextResponse } from "next/server";

import { markPersistentDelivery } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Persistent reporting is not configured." }, { status: 503 });
  const { reportId } = await params;
  const body = (await request.json()) as { recipient?: string; messageId?: string };
  if (!body.recipient) return NextResponse.json({ error: "Recipient is required." }, { status: 400 });
  try {
    await markPersistentDelivery(reportId, body.recipient, body.messageId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Delivery status could not be saved." }, { status: 500 });
  }
}
