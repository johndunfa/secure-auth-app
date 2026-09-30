import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { registerSchema, loginSchema } from "../utils/validators";
import { signToken } from "../utils/jwt";
import {
  COOKIE_NAME,
  cookieOptions,
  clearCookieOptions,
} from "../utils/cookies";

/** bcrypt cost factor — 12 is a good balance for 2025 hardware. */
const SALT_ROUNDS = 12;

/**
 * Build the object we send to the client.
 * CRITICAL: this NEVER includes passwordHash.
 */
const publicUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  createdAt?: Date;
}) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

/* ------------------------------------------------------------------ */
/* POST /api/auth/register                                             */
/* ------------------------------------------------------------------ */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("A user with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/auth/login                                                */
/* ------------------------------------------------------------------ */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });

    // Use the SAME generic message for "no user" and "wrong password"
    // so attackers cannot enumerate registered emails.
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({ userId: String(user._id) });

    res.cookie(COOKIE_NAME, token, cookieOptions());

    res.status(200).json({
      message: "Login successful",
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/auth/logout                                               */
/* ------------------------------------------------------------------ */
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie(COOKIE_NAME, clearCookieOptions());
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/* GET /api/auth/me      (PROTECTED)                                   */
/* ------------------------------------------------------------------ */
export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    res.status(200).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/* GET /api/protected    (PROTECTED)                                   */
/* ------------------------------------------------------------------ */
export const protectedData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    res.status(200).json({
      message: "🔒 This data is only visible to authenticated users.",
      authenticated: true,
      user: publicUser(user),
      secret: {
        serverTime: new Date().toISOString(),
        quote: "Authentication is the front door of every secure system.",
      },
    });
  } catch (err) {
    next(err);
  }
};