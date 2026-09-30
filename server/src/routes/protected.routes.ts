import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { protectedData } from "../controllers/auth.controller";

const router = Router();

// GET /api/protected  — PROTECTED
router.get("/", requireAuth, protectedData);

export default router;