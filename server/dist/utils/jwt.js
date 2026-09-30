"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET is missing or too short. Set a 64+ character random string in .env");
    }
    return secret;
};
const signToken = (payload, expiresIn = "7d") => {
    return jsonwebtoken_1.default.sign(payload, getSecret(), { expiresIn });
};
exports.signToken = signToken;
const verifyToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, getSecret());
    if (typeof decoded === "string" || !("userId" in decoded)) {
        throw new Error("Malformed token payload");
    }
    return { userId: String(decoded.userId) };
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map