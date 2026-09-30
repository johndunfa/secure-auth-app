"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const protected_routes_1 = __importDefault(require("./routes/protected.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
/* ----------------------------- Middleware ----------------------------- */
// CORS — MUST have credentials:true so the browser sends/receives the cookie
app.use((0, cors_1.default)({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Body parsers
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
// Cookie parser — populates req.cookies
app.use((0, cookie_parser_1.default)());
/* ------------------------------- Routes ------------------------------- */
// Health check
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
// Auth routes → /api/auth/...
app.use("/api/auth", auth_routes_1.default);
// Protected routes → /api/protected
app.use("/api/protected", protected_routes_1.default);
/* --------------------------- Error handling --------------------------- */
// 404 for anything else
app.use(error_middleware_1.notFound);
// Central error handler (must be last)
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map