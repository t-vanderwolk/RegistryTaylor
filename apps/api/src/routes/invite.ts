import { Router, Request, Response } from "express";
import { randomBytes } from "crypto";
import { db } from "../db";
import { signToken, verifyToken } from "../../../../packages/lib/auth";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();
const INVITE_COOKIE = "tm_invite";
const isProd = process.env.NODE_ENV === "production";

type InviteValidateBody = {
  code?: string;
};

type InviteRequestBody = {
  email?: string;
};

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

router.use(authenticate);

router.post(
  "/validate",
  async (req: Request<unknown, unknown, InviteValidateBody>, res: Response) => {
    try {
      const incomingCode = req.body?.code;
      if (!incomingCode) {
        res
          .status(400)
          .json({ success: false, error: "Invite code is required." });
        return;
      }

      const code = normalizeCode(incomingCode);
      const invite = await db("invite_codes")
        .whereRaw("UPPER(code) = ?", [code])
        .first();

      if (!invite) {
        res.status(404).json({ success: false, error: "Invite not found." });
        return;
      }

      if (!invite.is_active || invite.used_by) {
        res.status(400).json({
          success: false,
          error: "Invite code is no longer active.",
        });
        return;
      }

      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        res.status(400).json({
          success: false,
          error: "Invite code has expired.",
        });
        return;
      }

      const tempToken = signToken(
        { scope: "invite", code: invite.code },
        { expiresIn: "15m" }
      );

      res.cookie(INVITE_COOKIE, tempToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        maxAge: 15 * 60 * 1000,
      });

      res.json({
        success: true,
        data: { valid: true, temp_token: tempToken, code: invite.code },
      });
    } catch (error) {
      console.error("Error validating invite", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to validate invite code." });
    }
  }
);

router.post(
  "/request",
  async (
    req: Request<unknown, unknown, InviteRequestBody>,
    res: Response
  ) => {
    try {
      const email = req.body?.email;
      if (!email) {
        res.status(400).json({ success: false, error: "Email is required." });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await db("invite_requests")
        .whereRaw("LOWER(email) = ?", [normalizedEmail])
        .first();

      if (existing) {
        await db("invite_requests")
          .where({ id: existing.id })
          .update({
            status: "pending",
            created_at: db.fn.now(),
          });
      } else {
        await db("invite_requests").insert({
          email: normalizedEmail,
        });
      }

      res.json({ success: true, data: { requested: true } });
    } catch (error) {
      console.error("Error creating invite request", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to request invite." });
    }
  }
);

router.post("/generate", requireAdmin, async (req: Request, res: Response) => {
  try {
    const code = randomBytes(4).toString("hex").toUpperCase();
    const [invite] = await db("invite_codes")
      .insert({
        code,
        created_by: req.user?.username ?? null,
        is_active: true,
      })
      .returning("*");

    res.status(201).json({ success: true, data: invite });
  } catch (error) {
    console.error("Error generating invite", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate invite code.",
    });
  }
});

router.get("/list", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const invites = await db("invite_codes")
      .leftJoin("users", "invite_codes.used_by", "users.id")
      .select(
        "invite_codes.*",
        "users.username as used_by_username",
        "users.email as used_by_email"
      )
      .orderBy("invite_codes.created_at", "desc");

    res.json({ success: true, data: invites });
  } catch (error) {
    console.error("Error listing invites", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch invites." });
  }
});

router.post(
  "/revoke/:id",
  requireAdmin,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await db("invite_codes")
        .where({ id })
        .update({ is_active: false, expires_at: db.fn.now() })
        .returning("*");

      if (!updated.length) {
        res.status(404).json({ success: false, error: "Invite not found." });
        return;
      }

      res.json({ success: true, data: updated[0] });
    } catch (error) {
      console.error("Error revoking invite", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to revoke invite." });
    }
  }
);

router.post(
  "/consume",
  async (req: Request<unknown, unknown, { temp_token?: string }>, res) => {
    try {
      const tempToken =
        req.body?.temp_token || req.cookies?.[INVITE_COOKIE] || "";
      if (!tempToken) {
        res
          .status(400)
          .json({ success: false, error: "Invite token is required." });
        return;
      }

      const payload = verifyToken(tempToken);
      res.json({ success: true, data: payload });
    } catch (error) {
      console.error("Error consuming invite token", error);
      res.status(400).json({ success: false, error: "Invalid invite token." });
    }
  }
);

export const inviteRouter = router;
