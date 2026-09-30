"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const cookies_1 = require("../utils/cookies");
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.[cookies_1.COOKIE_NAME];
        if (!token) {
            res.status(401).json({
                message: "Not authenticated. Please log in.",
            });
            return;
        }
        let payload;
        try {
            payload = (0, jwt_1.verifyToken)(token);
        }
        catch {
            res.status(401).json({
                message: "Invalid or expired session. Please log in again.",
            });
            return;
        }
        const user = await User_1.default.findById(payload.userId);
        if (!user) {
            res.status(401).json({
                message: "User no longer exists.",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.middleware.js.map