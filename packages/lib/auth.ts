import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export type TokenPayload = JwtPayload & {
  sub?: string;
  scope?: string;
  [key: string]: unknown;
};

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const signToken = (
  data: Record<string, unknown>,
  options?: SignOptions
): string => {
  return jwt.sign(data, SECRET, { expiresIn: "7d", ...(options ?? {}) });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, SECRET) as TokenPayload;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = jwt.decode(token) as JwtPayload | null;
    if (!payload?.exp) {
      return false;
    }
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
};
