import type { CookieOptions } from "express";

export const COOKIE_NAME = "auth_token";

/** 7 days in milliseconds. */
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Cookie options for SETTING the auth cookie.
 *
 * - httpOnly  → JavaScript on the client cannot read it (XSS protection)
 * - secure    → only sent over HTTPS (auto-enabled in production)
 * - sameSite  → CSRF protection
 *     - "lax"  in dev  (localhost:3000 → localhost:5000, both http)
 *     - "none" in prod (requires HTTPS, needed for cross-site cookies)
 */
export const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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