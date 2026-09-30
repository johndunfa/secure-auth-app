import jwt, { type SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set a 64+ character random string in .env"
    );
  }

  return secret;
};

export const signToken = (
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string => {
  return jwt.sign(payload, getSecret(), { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getSecret());

  if (typeof decoded === "string" || !("userId" in decoded)) {
    throw new Error("Malformed token payload");
  }

  return { userId: String((decoded as JwtPayload).userId) };
};