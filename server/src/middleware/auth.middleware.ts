import type { Request, Response, NextFunction } from "express";
import { COOKIE_NAME } from "../utils/cookies";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.[COOKIE_NAME] as string | undefined;

    if (!token) {
      res.status(401).json({
        message: "Not authenticated. Please log in.",
      });
      return;
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      res.status(401).json({
        message: "Invalid or expired session. Please log in again.",
      });
      return;
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({
        message: "User no longer exists.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};