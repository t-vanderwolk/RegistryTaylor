export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

type InviteRole = "MEMBER" | "MENTOR" | "ADMIN";
type InviteStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

type InviteDirectoryEntry = {
  code: string;
  role: InviteRole;
  status: InviteStatus;
};

const DEFAULT_INVITES: InviteDirectoryEntry[] = [
  { code: "TMB-ALPHA", role: "MEMBER", status: "PENDING" },
  { code: "TMB-MENTOR", role: "MENTOR", status: "PENDING" },
  { code: "TMB-ADMIN", role: "ADMIN", status: "PENDING" },
];

const ENV_KEYS = ["INVITE_DIRECTORY", "INVITE_CODES", "INVITE_WHITELIST"];
const VALID_ROLES = new Set<InviteRole>(["MEMBER", "MENTOR", "ADMIN"]);
const VALID_STATUSES = new Set<InviteStatus>(["PENDING", "ACCEPTED", "EXPIRED"]);

export async function POST(request: Request) {
  try {
    const { code } = (await request.json()) as { code?: string };

    const normalizedCode = code?.toUpperCase().trim();
    if (!normalizedCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    const inviteDirectory = getInviteDirectory();
    const invite = inviteDirectory.find((entry) => entry.code === normalizedCode);

    if (!invite || invite.status !== "PENDING") {
      return NextResponse.json(
        { error: "That invite code isn’t recognized — please try again or request a new invite." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      invite: {
        code: invite.code,
        role: invite.role,
        status: invite.status,
      },
    });
  } catch (error) {
    console.error("Invite verification failed:", error);
    return NextResponse.json({ error: "Unable to verify invite code" }, { status: 500 });
  }
}

function getInviteDirectory(): InviteDirectoryEntry[] {
  const rawDirectory = getRawInviteDirectory();
  if (!rawDirectory) {
    return DEFAULT_INVITES;
  }

  const entries = rawDirectory
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map(parseInviteEntry)
    .filter((entry): entry is InviteDirectoryEntry => Boolean(entry));

  return entries.length ? entries : DEFAULT_INVITES;
}

function getRawInviteDirectory(): string | null {
  for (const key of ENV_KEYS) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }
  return null;
}

function parseInviteEntry(entry: string): InviteDirectoryEntry | null {
  const segments = entry.split(":").map((segment) => segment.trim());
  if (!segments.length) {
    return null;
  }

  const [codeSegment, roleSegment, statusSegment] = segments;
  if (!codeSegment) {
    return null;
  }

  return {
    code: codeSegment.toUpperCase(),
    role: normalizeRole(roleSegment),
    status: normalizeStatus(statusSegment),
  };
}

function normalizeRole(role?: string): InviteRole {
  if (!role) {
    return "MEMBER";
  }
  const normalized = role.toUpperCase() as InviteRole;
  return VALID_ROLES.has(normalized) ? normalized : "MEMBER";
}

function normalizeStatus(status?: string): InviteStatus {
  if (!status) {
    return "PENDING";
  }
  const normalized = status.toUpperCase() as InviteStatus;
  return VALID_STATUSES.has(normalized) ? normalized : "PENDING";
}
