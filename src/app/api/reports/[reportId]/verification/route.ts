import { NextResponse } from "next/server";

import { addCommunityVerification } from "@/lib/supabase/reports";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { allowRequest, rateLimitedResponse } from "@/lib/security/rate-limit";

const TOKEN_COOKIE = "civicshield_community_token";

export async function POST(request: Request, { params }: { params: Promise<{ reportId: string }> }) {
  const rate = allowRequest(request, "community-verification", 5);
  if (!rate.allowed) return rateLimitedResponse(rate.retryAfterSeconds);
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Public tracking is not configured." }, { status: 503 });
  const { reportId } = await params;
  const body = (await request.json()) as { verdict?: "verified" | "disputed" };
  if (body.verdict !== "verified" && body.verdict !== "disputed") return NextResponse.json({ error: "Choose verified or disputed." }, { status: 400 });
  const existingToken = request.headers.get("cookie")?.match(new RegExp(`${TOKEN_COOKIE}=([^;]+)`))?.[1];
  const clientToken = existingToken ?? crypto.randomUUID();
  try {
    await addCommunityVerification(reportId, clientToken, body.verdict);
    const response = NextResponse.json({ ok: true, message: "Your community verification was recorded for moderator review." });
    if (!existingToken) response.cookies.set(TOKEN_COOKIE, clientToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
    return response;
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Verification could not be saved." }, { status: 500 }); }
}
