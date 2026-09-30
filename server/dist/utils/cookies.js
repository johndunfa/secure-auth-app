"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookieOptions = exports.cookieOptions = exports.SEVEN_DAYS_MS = exports.COOKIE_NAME = void 0;
exports.COOKIE_NAME = "auth_token";
/** 7 days in milliseconds. */
exports.SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
/**
 * Cookie options for SETTING the auth cookie.
 *
 * - httpOnly  → JavaScript on the client cannot read it (XSS protection)
 * - secure    → only sent over HTTPS (auto-enabled in production)
 * - sameSite  → CSRF protection
 *     - "lax"  in dev  (localhost:3000 → localhost:5000, both http)
 *     - "none" in prod (requires HTTPS, needed for cross-site cookies)
 */
const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: exports.SEVEN_DAYS_MS,
    path: "/",
});
exports.cookieOptions = cookieOptions;
/**
 * Cookie options for CLEARING the auth cookie.
 * Must not include maxAge/expires when clearing.
 */
const clearCookieOptions = () => {
    const { maxAge: _maxAge, ...rest } = (0, exports.cookieOptions)();
    return rest;
};
exports.clearCookieOptions = clearCookieOptions;
//# sourceMappingURL=cookies.js.map