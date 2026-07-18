import { NextResponse } from "next/server";

import { GMAIL_STATE_COOKIE, GMAIL_TOKEN_COOKIE, getGoogleOAuthConfig, safeReturnPath } from "@/lib/gmail/config";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const [state, encodedReturnTo] = (url.searchParams.get("state") ?? "").split(".");
  const returnTo = safeReturnPath(encodedReturnTo ? decodeURIComponent(encodedReturnTo) : null);
  const cookieState = request.headers.get("cookie")?.match(new RegExp(`${GMAIL_STATE_COOKIE}=([^;]+)`))?.[1];
  const code = url.searchParams.get("code");
  if (!code || !state || state !== cookieState) return NextResponse.redirect(new URL(`${returnTo}?gmail=connection-failed`, request.url));

  try {
    const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
    });
    const token = await tokenResponse.json() as { access_token?: string; expires_in?: number };
    if (!tokenResponse.ok || !token.access_token) throw new Error("Token exchange failed");
    const response = NextResponse.redirect(new URL(`${returnTo}?gmail=connected`, request.url));
    response.cookies.set(GMAIL_TOKEN_COOKIE, token.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: Math.max(60, token.expires_in ?? 3600),
      path: "/",
    });
    response.cookies.delete(GMAIL_STATE_COOKIE);
    return response;
  } catch {
    return NextResponse.redirect(new URL(`${returnTo}?gmail=connection-failed`, request.url));
  }
}
