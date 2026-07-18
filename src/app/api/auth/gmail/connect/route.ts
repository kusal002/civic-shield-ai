import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { GMAIL_STATE_COOKIE, getGoogleOAuthConfig, safeReturnPath } from "@/lib/gmail/config";

export async function GET(request: Request) {
  try {
    const { clientId, redirectUri } = getGoogleOAuthConfig();
    const url = new URL(request.url);
    const state = randomBytes(24).toString("hex");
    const returnTo = safeReturnPath(url.searchParams.get("returnTo"));
    const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", "https://www.googleapis.com/auth/gmail.send");
    authorizationUrl.searchParams.set("access_type", "offline");
    authorizationUrl.searchParams.set("prompt", "consent");
    authorizationUrl.searchParams.set("state", `${state}.${encodeURIComponent(returnTo)}`);

    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set(GMAIL_STATE_COOKIE, state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/report?gmail=configuration-error", request.url));
  }
}
