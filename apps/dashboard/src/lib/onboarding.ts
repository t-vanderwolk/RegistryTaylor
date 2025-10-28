import type { UserRole } from "@/lib/auth";
import { apiFetch } from "@/lib/apiClient";

export type InviteStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

export type InviteRecord = {
  code: string;
  email: string;
  name: string | null;
  role: UserRole;
  invitedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  status: InviteStatus;
};

export async function validateInviteCode(code: string): Promise<InviteRecord | null> {
  if (!code) {
    return null;
  }

  try {
    const data = await apiFetch<{
      invite?: {
        code: string;
        email: string;
        name?: string | null;
        role: UserRole;
        status: InviteStatus;
        createdBy?: { id: string; name: string | null; email: string };
      };
    }>(`/api/invites/verify/${code.toUpperCase()}`, {
      cache: "no-store",
    });

    if (!data.invite) {
      return null;
    }

    return {
      code: data.invite.code,
      email: data.invite.email,
      name: data.invite.name ?? null,
      role: data.invite.role,
      invitedBy: data.invite.createdBy ?? null,
      status: data.invite.status,
    };
  } catch {
    return null;
  }
}
