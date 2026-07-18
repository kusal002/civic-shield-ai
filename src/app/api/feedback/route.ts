import { NextResponse } from "next/server";

import { getOwnerGmailAccessToken } from "@/lib/gmail/access-token";
import { allowRequest, rateLimitedResponse } from "@/lib/security/rate-limit";

const feedbackRecipients = ["thedipayanmaji@gmail.com", "kushalkg0000@gmail.com"];

export async function POST(request: Request) {
  const rate = allowRequest(request, "feedback", 3, 10 * 60_000);
  if (!rate.allowed) return rateLimitedResponse(rate.retryAfterSeconds);

  const payload = await request.json() as { message?: string; replyTo?: string };
  const message = payload.message?.trim();
  const replyTo = payload.replyTo?.trim();
  if (!message || message.length < 8 || message.length > 1500) return NextResponse.json({ error: "Feedback must be between 8 and 1,500 characters." }, { status: 400 });
  if (replyTo && !/^\S+@\S+\.\S+$/.test(replyTo)) return NextResponse.json({ error: "Enter a valid reply email or leave it blank." }, { status: 400 });

  const token = await getOwnerGmailAccessToken();
  if (!token) return NextResponse.json({ error: "CivicShield feedback delivery is not configured yet." }, { status: 503 });

  const body = ["New CivicShield feedback", "", message, "", `Reply email: ${replyTo || "Not provided"}`, `Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`].join("\r\n");
  const raw = Buffer.from([`To: ${feedbackRecipients.join(", ")}`, "Subject: CivicShield website feedback", "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "", body].join("\r\n")).toString("base64url");
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ raw }) });
  const result = await response.json() as { id?: string; error?: { message?: string } };
  if (!response.ok) return NextResponse.json({ error: result.error?.message ?? "Feedback could not be sent right now." }, { status: response.status });
  return NextResponse.json({ id: result.id });
}
