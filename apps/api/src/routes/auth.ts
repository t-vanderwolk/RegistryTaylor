import { Router, Request, Response } from "express";
import { db } from "../db";
import {
  hashPassword,
  signToken,
  verifyPassword,
  verifyToken,
} from "../../../../packages/lib/auth";
import { authenticate, requireAuth } from "../middleware/auth";

const AUTH_COOKIE = "tm_auth";
const INVITE_COOKIE = "tm_invite";
const isProd = process.env.NODE_ENV === "production";

type RegisterBody = {
  username?: string;
  email?: string;
  password?: string;
  code?: string;
  temp_token?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function clearInviteCookie(res: Response): void {
  res.cookie(INVITE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 0,
  });
}

const router = Router();

router.use(authenticate);

router.post(
  "/register",
  async (req: Request<unknown, unknown, RegisterBody>, res: Response) => {
    try {
      const { username, email, password, code, temp_token: tempToken } =
        req.body ?? {};

      if (!username || !email || !password || !code) {
        res.status(400).json({
          success: false,
          error: "Username, email, password, and invite code are required.",
        });
        return;
      }

      const inviteToken = tempToken || req.cookies?.[INVITE_COOKIE];
      if (!inviteToken) {
        res.status(400).json({
          success: false,
          error: "Invite validation is required before registration.",
        });
        return;
      }

      let invitePayload;
      try {
        invitePayload = verifyToken(inviteToken);
      } catch {
        res
          .status(400)
          .json({ success: false, error: "Invalid invite token provided." });
        return;
      }

      if (invitePayload.scope !== "invite") {
        res
          .status(400)
          .json({ success: false, error: "Malformed invite token scope." });
        return;
      }

      const normalizedCode = normalizeCode(code);
      const inviteCode =
        typeof invitePayload.code === "string" ? invitePayload.code : "";
      if (inviteCode !== normalizedCode) {
        res.status(400).json({
          success: false,
          error: "Invite token does not match the provided code.",
        });
        return;
      }

      const invite = await db("invite_codes")
        .whereRaw("UPPER(code) = ?", [normalizedCode])
        .first();

      if (!invite) {
        res.status(404).json({ success: false, error: "Invite not found." });
        return;
      }

      if (!invite.is_active || invite.used_by) {
        res.status(400).json({
          success: false,
          error: "Invite has already been used or is inactive.",
        });
        return;
      }

      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        res.status(400).json({
          success: false,
          error: "Invite has expired.",
        });
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const trimmedUsername = username.trim();
      const usernameLookup = normalizeUsername(username);

      const existingEmail = await db("users")
        .whereRaw("LOWER(email) = ?", [normalizedEmail])
        .first();
      if (existingEmail) {
        res
          .status(400)
          .json({ success: false, error: "Email is already registered." });
        return;
      }

      const existingUsername = await db("users")
        .whereRaw("LOWER(username) = ?", [usernameLookup])
        .first();
      if (existingUsername) {
        res
          .status(400)
          .json({ success: false, error: "Username is already taken." });
        return;
      }

      const passwordHash = await hashPassword(password);

      const [user] = await db("users")
        .insert({
          username: trimmedUsername,
          email: normalizedEmail,
          password_hash: passwordHash,
          role: "member",
        })
        .returning(["id", "username", "email", "role", "created_at"]);

      await db("invite_codes").where({ id: invite.id }).update({
        used_by: user.id,
        used_at: db.fn.now(),
        is_active: false,
      });

      const authToken = signToken(
        {
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          scope: "auth",
        },
        { expiresIn: "7d" }
      );

      setAuthCookie(res, authToken);
      clearInviteCookie(res);

      res.status(201).json({
        success: true,
        data: { token: authToken, user },
      });
    } catch (error) {
      console.error("Error during registration", error);
      res
        .status(500)
        .json({ success: false, error: "Unable to complete registration." });
    }
  }
);

router.post(
  "/login",
  async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, error: "Email and password are required." });
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const user = await db("users")
        .whereRaw("LOWER(email) = ?", [normalizedEmail])
        .first();

      if (!user) {
        res
          .status(401)
          .json({ success: false, error: "Invalid credentials provided." });
        return;
      }

      const passwordValid = await verifyPassword(
        password,
        user.password_hash ?? ""
      );
      if (!passwordValid) {
        res
          .status(401)
          .json({ success: false, error: "Invalid credentials provided." });
        return;
      }

      const authToken = signToken(
        {
          sub: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          scope: "auth",
        },
        { expiresIn: "7d" }
      );

      setAuthCookie(res, authToken);
      clearInviteCookie(res);

      res.json({
        success: true,
        data: {
          token: authToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error("Error during login", error);
      res.status(500).json({ success: false, error: "Login failed." });
    }
  }
);

router.post("/logout", (_req: Request, res: Response) => {
  res.cookie(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 0,
  });
  res.cookie(INVITE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 0,
  });
  res.json({ success: true, data: { loggedOut: true } });
});

router.get("/me", requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: req.user });
});

export const authRouter = router;
