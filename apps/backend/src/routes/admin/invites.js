import express from "express";

import prisma from "../../db/prismaClient.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { generateInviteCode } from "../../utils/inviteCodes.js";

const router = express.Router();

const ADMIN_ROLES = new Set(["MEMBER", "MENTOR", "ADMIN"]);
const STATUS_VALUES = new Set(["PENDING", "ACCEPTED", "REVOKED"]);

function serializeInvite(invite) {
  return {
    id: invite.id,
    email: invite.email,
    role: invite.role,
    code: invite.code,
    permissions: invite.permissions ?? [],
    status: invite.status,
    createdAt: invite.createdAt,
    updatedAt: invite.updatedAt,
  };
}

function sanitizePermissions(input) {
  if (!Array.isArray(input)) return [];
  return Array.from(
    new Set(
      input
        .map((permission) => String(permission || "").trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.get("/", async (_req, res) => {
  const invites = await prisma.invite.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ invites: invites.map(serializeInvite) });
});

router.post("/", async (req, res) => {
  const { email, role = "MEMBER", permissions = [], code } = req.body ?? {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedRole = String(role).trim().toUpperCase();
  if (!ADMIN_ROLES.has(normalizedRole)) {
    return res.status(400).json({ error: "Invalid role provided" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const sanitizedPermissions = sanitizePermissions(permissions);
  const inviteCode = (code ? String(code) : generateInviteCode(normalizedRole)).toUpperCase();

  try {
    const invite = await prisma.invite.create({
      data: {
        email: normalizedEmail,
        role: normalizedRole,
        code: inviteCode,
        permissions: sanitizedPermissions,
      },
    });

    return res.status(201).json({ invite: serializeInvite(invite) });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Invite code already exists. Please generate a new one." });
    }
    console.error("Failed to create invite", error);
    return res.status(500).json({ error: "Unable to create invite." });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, role, permissions, status, code } = req.body ?? {};

  if (!id) {
    return res.status(400).json({ error: "Invite ID is required" });
  }

  const data = {};

  if (email) {
    data.email = String(email).trim().toLowerCase();
  }

  if (role) {
    const normalizedRole = String(role).trim().toUpperCase();
    if (!ADMIN_ROLES.has(normalizedRole)) {
      return res.status(400).json({ error: "Invalid role value" });
    }
    data.role = normalizedRole;
  }

  if (permissions) {
    data.permissions = sanitizePermissions(permissions);
  }

  if (status) {
    const normalizedStatus = String(status).trim().toUpperCase();
    if (!STATUS_VALUES.has(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    data.status = normalizedStatus;
  }

  if (code) {
    data.code = String(code).trim().toUpperCase();
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }

  try {
    const invite = await prisma.invite.update({
      where: { id },
      data,
    });
    return res.json({ invite: serializeInvite(invite) });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Invite not found" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Invite code already exists" });
    }
    console.error("Failed to update invite", error);
    return res.status(500).json({ error: "Unable to update invite." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Invite ID is required" });
  }

  try {
    await prisma.invite.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Invite not found" });
    }
    console.error("Failed to delete invite", error);
    return res.status(500).json({ error: "Unable to delete invite." });
  }
});

export default router;
