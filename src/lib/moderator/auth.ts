import { createHmac, timingSafeEqual } from "crypto";

export const MODERATOR_COOKIE = "civicshield_moderator";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret() { return process.env.MODERATOR_SESSION_SECRET; }
function sign(value: string) { return createHmac("sha256", secret()!).update(value).digest("base64url"); }

export function moderatorAuthConfigured() { return Boolean(process.env.MODERATOR_ACCESS_KEY && secret()); }

export function validModeratorAccessKey(value: string) {
  const expected = process.env.MODERATOR_ACCESS_KEY;
  if (!expected || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function createModeratorSession() {
  const expiry = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  return `${expiry}.${sign(String(expiry))}`;
}

export function hasModeratorSession(cookieHeader: string | null) {
  if (!secret()) return false;
  const value = cookieHeader?.match(new RegExp(`${MODERATOR_COOKIE}=([^;]+)`))?.[1];
  if (!value) return false;
  const [expiry, signature] = value.split(".");
  if (!expiry || !signature || Number(expiry) < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(expiry);
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
