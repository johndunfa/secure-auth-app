import type { CookieOptions } from "express";

export const COOKIE_NAME = "auth_token";

/** 7 days in milliseconds. */
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Detect if we're running in a production HTTPS environment.
 * Render sets NODE_ENV=production, but we also check the CLIENT_URL
 * as a fallback in case the env var is missing.
 */
const isProduction =
  process.env.NODE_ENV === "production" ||
  (process.env.CLIENT_URL?.startsWith("https://") ?? false);

/**
 * Cookie options for SETTING the auth cookie.
 *
 * - httpOnly     → JS on the client cannot read it (XSS protection)
 * - secure       → only sent over HTTPS (required for sameSite: "none")
 * - sameSite     → "none" allows cross-site cookies (Vercel → Render)
 * - partitioned  → required by Chrome for third-party cookies
 */
export const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  partitioned: isProduction, // ✅ fixes Chrome's third-party cookie blocking
  maxAge: SEVEN_DAYS_MS,
  path: "/",
});

/**
 * Cookie options for CLEARING the auth cookie.
 * Must not include maxAge/expires when clearing.
 */
export const clearCookieOptions = (): CookieOptions => {
  const { maxAge: _maxAge, ...rest } = cookieOptions();
  return rest;
};