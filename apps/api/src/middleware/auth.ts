import { NextFunction, Request, Response } from "express";
import { verifyToken, TokenPayload } from "../../../../packages/lib/auth";
import { db } from "../db";

export type AuthenticatedUser = {
  id: string;
  email: string;
  username: string;
  role: "member" | "admin";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const COOKIE_NAME = "tm_auth";

async function resolveUserFromPayload(
  payload: TokenPayload
): Promise<AuthenticatedUser | null> {
  const userId = payload.sub;
  if (!userId) {
    return null;
  }

  const record = await db("users")
    .where({ id: userId })
    .first<AuthenticatedUser>();

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    email: record.email,
    username: record.username,
    role: record.role,
  };
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const headerToken = req.headers.authorization?.replace("Bearer ", "");
  const cookieToken = req.cookies?.[COOKIE_NAME];
  const token = headerToken || cookieToken;

  if (!token) {
    return next();
  }

  try {
    const payload = verifyToken(token);
    const user = await resolveUserFromPayload(payload);
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid tokens; request proceeds unauthenticated.
  }

  next();
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Authentication required." });
    return;
  }
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Authentication required." });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ success: false, error: "Admin access required." });
    return;
  }
  next();
}
