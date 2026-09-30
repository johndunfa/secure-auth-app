import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

/* ----------------------------- Middleware ----------------------------- */

// CORS — MUST have credentials:true so the browser sends/receives the cookie
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser — populates req.cookies
app.use(cookieParser());

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
app.use("/api/auth", authRoutes);

// Protected routes → /api/protected
app.use("/api/protected", protectedRoutes);

/* --------------------------- Error handling --------------------------- */

// 404 for anything else
app.use(notFound);

// Central error handler (must be last)
app.use(errorHandler);

export default app;