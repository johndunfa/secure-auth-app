import { Router } from "express";
import {
  register,
  login,
  logout,
  me,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route
router.get("/me", requireAuth, me);

export default router;