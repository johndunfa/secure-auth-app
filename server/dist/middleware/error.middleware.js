"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
const validators_1 = require("../utils/validators");
/** 404 for unmatched routes. */
const notFound = (req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};
exports.notFound = notFound;
/** Global error handler — must be registered LAST on the app. */
const errorHandler = (err, _req, res, _next) => {
    // Zod validation errors → 400
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            message: "Invalid input",
            errors: (0, validators_1.formatZodErrors)(err),
        });
        return;
    }
    // Our custom AppError (401, 409, etc.)
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    // Mongo duplicate key race condition
    if (typeof err === "object" &&
        err !== null &&
        "code" in err &&
        err.code === 11000) {
        res.status(409).json({
            message: "A user with this email already exists",
        });
        return;
    }
    // Mongoose CastError (bad ObjectId in URL, etc.)
    if (typeof err === "object" &&
        err !== null &&
        "name" in err &&
        err.name === "CastError") {
        res.status(400).json({ message: "Invalid identifier" });
        return;
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal server error" });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map