import { getGoogleOAuthConfig } from "@/lib/gmail/config";

export async function getOwnerGmailAccessToken() {
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!refreshToken) return null;
  const { clientId, clientSecret } = getGoogleOAuthConfig();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const result = await response.json() as { access_token?: string };
  return response.ok ? result.access_token ?? null : null;
}
