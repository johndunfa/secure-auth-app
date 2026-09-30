"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// GET /api/protected  — PROTECTED
router.get("/", auth_middleware_1.requireAuth, auth_controller_1.protectedData);
exports.default = router;
//# sourceMappingURL=protected.routes.js.map