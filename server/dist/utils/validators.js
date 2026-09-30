"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodErrors = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(80, "Name must be at most 80 characters"),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be at most 72 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
});
/** Convert a ZodError into a flat { field: firstMessage } object. */
const formatZodErrors = (error) => {
    const out = {};
    for (const issue of error.issues) {
        const key = issue.path.join(".") || "form";
        if (!out[key]) {
            out[key] = issue.message;
        }
    }
    return out;
};
exports.formatZodErrors = formatZodErrors;
//# sourceMappingURL=validators.js.map