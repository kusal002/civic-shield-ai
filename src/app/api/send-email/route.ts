import { NextResponse } from "next/server";

import { GMAIL_TOKEN_COOKIE } from "@/lib/gmail/config";

function encodeMessage({ to, subject, body }: { to: string; subject: string; body: string }) {
  const message = [`To: ${to}`, `Subject: ${subject}`, "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "", body].join("\r\n");
  return Buffer.from(message).toString("base64url");
}

export async function POST(request: Request) {
  const token = request.headers.get("cookie")?.match(new RegExp(`${GMAIL_TOKEN_COOKIE}=([^;]+)`))?.[1];
  if (!token) return NextResponse.json({ error: "Connect Gmail before sending." }, { status: 401 });
  const { to, subject, body } = await request.json() as { to?: string; subject?: string; body?: string };
  if (!to || !/^\S+@\S+\.\S+$/.test(to) || !subject || !body) return NextResponse.json({ error: "Provide a valid recipient, subject, and message." }, { status: 400 });

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: encodeMessage({ to, subject, body }) }),
  });
  const data = await response.json() as { id?: string; error?: { message?: string } };
  if (!response.ok) return NextResponse.json({ error: data.error?.message ?? "Gmail could not send this message." }, { status: response.status });
  return NextResponse.json({ id: data.id });
}
