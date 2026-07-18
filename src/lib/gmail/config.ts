export const GMAIL_TOKEN_COOKIE = "civicshield_gmail_token";
export const GMAIL_STATE_COOKIE = "civicshield_gmail_state";

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) throw new Error("Google OAuth is not configured.");
  return { clientId, clientSecret, redirectUri };
}

export function safeReturnPath(value: string | null) {
  return value?.startsWith("/analysis/") ? value : "/report";
}
