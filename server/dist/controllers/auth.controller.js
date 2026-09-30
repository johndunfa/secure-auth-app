"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedData = exports.me = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = require("../utils/AppError");
const validators_1 = require("../utils/validators");
const jwt_1 = require("../utils/jwt");
const cookies_1 = require("../utils/cookies");
/** bcrypt cost factor — 12 is a good balance for 2025 hardware. */
const SALT_ROUNDS = 12;
/**
 * Build the object we send to the client.
 * CRITICAL: this NEVER includes passwordHash.
 */
const publicUser = (user) => ({
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
});
/* ------------------------------------------------------------------ */
/* POST /api/auth/register                                             */
/* ------------------------------------------------------------------ */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = validators_1.registerSchema.parse(req.body);
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            throw new AppError_1.AppError("A user with this email already exists", 409);
        }
        const passwordHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const user = await User_1.default.create({
            name,
            email,
            passwordHash,
        });
        res.status(201).json({
            message: "User registered successfully",
            user: publicUser(user),
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
/* ------------------------------------------------------------------ */
/* POST /api/auth/login                                                */
/* ------------------------------------------------------------------ */
const login = async (req, res, next) => {
    try {
        const { email, password } = validators_1.loginSchema.parse(req.body);
        const user = await User_1.default.findOne({ email });
        // Use the SAME generic message for "no user" and "wrong password"
        // so attackers cannot enumerate registered emails.
        if (!user) {
            throw new AppError_1.AppError("Invalid email or password", 401);
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new AppError_1.AppError("Invalid email or password", 401);
        }
        const token = (0, jwt_1.signToken)({ userId: String(user._id) });
        res.cookie(cookies_1.COOKIE_NAME, token, (0, cookies_1.cookieOptions)());
        res.status(200).json({
            message: "Login successful",
            user: publicUser(user),
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
/* ------------------------------------------------------------------ */
/* POST /api/auth/logout                                               */
/* ------------------------------------------------------------------ */
const logout = async (_req, res, next) => {
    try {
        res.clearCookie(cookies_1.COOKIE_NAME, (0, cookies_1.clearCookieOptions)());
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
/* ------------------------------------------------------------------ */
/* GET /api/auth/me      (PROTECTED)                                   */
/* ------------------------------------------------------------------ */
const me = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        res.status(200).json({ user: publicUser(user) });
    }
    catch (err) {
        next(err);
    }
};
exports.me = me;
/* ------------------------------------------------------------------ */
/* GET /api/protected    (PROTECTED)                                   */
/* ------------------------------------------------------------------ */
const protectedData = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        res.status(200).json({
            message: "🔒 This data is only visible to authenticated users.",
            authenticated: true,
            user: publicUser(user),
            secret: {
                serverTime: new Date().toISOString(),
                quote: "Authentication is the front door of every secure system.",
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.protectedData = protectedData;
//# sourceMappingURL=auth.controller.js.map