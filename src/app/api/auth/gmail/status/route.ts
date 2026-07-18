import { NextResponse } from "next/server";

import { GMAIL_TOKEN_COOKIE } from "@/lib/gmail/config";

export async function GET(request: Request) {
  const connected = Boolean(request.headers.get("cookie")?.match(new RegExp(`${GMAIL_TOKEN_COOKIE}=([^;]+)`))?.[1]);
  return NextResponse.json({ connected });
}
