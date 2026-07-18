import { NextResponse } from "next/server";

import { createFallbackAnalysis } from "@/lib/ai/fallback-analysis";
import type { CivicReport, SafetyAnalysis } from "@/types/report";

export async function POST(request: Request) {
  const body = (await request.json()) as { report?: CivicReport; variation?: number };
  if (!body.report) {
    return NextResponse.json({ error: "A report is required." }, { status: 400 });
  }

  const fallback = createFallbackAnalysis(body.report, body.variation);
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json(fallback);

  try {
    const prompt = `You are CivicShield AI, a public-safety reporting assistant. Return only valid JSON with this exact schema: ${JSON.stringify({
      category: "string",
      urgency: "low | medium | high | critical",
      riskSummary: "string",
      immediateActions: ["string"],
      publicAlert: "string",
      formalComplaint: "string",
      emailSubject: "string",
      emailBody: "string",
    })}. Do not claim to contact authorities, do not give medical/legal advice, and say call 112 only if there is immediate danger. Use this preselected route without changing it: ${JSON.stringify(fallback.route)}. Citizen report: ${JSON.stringify(body.report)}.`;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) throw new Error("Groq request failed");
    const payload = await response.json();
    const parsed = JSON.parse(payload.choices?.[0]?.message?.content ?? "{}") as Partial<SafetyAnalysis>;
    if (!parsed.category || !parsed.urgency || !parsed.emailBody || !Array.isArray(parsed.immediateActions)) throw new Error("Invalid AI response");
    return NextResponse.json({ ...fallback, ...parsed, route: fallback.route, generatedBy: "groq" });
  } catch {
    return NextResponse.json(fallback);
  }
}
