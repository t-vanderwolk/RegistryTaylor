"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import api from "@/lib/apiClient";
import { generateInviteCode } from "@/lib/inviteCodes";

export type InviteRecord = {
  id: string;
  email: string;
  role: "MEMBER" | "MENTOR" | "ADMIN";
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  code: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

const PERMISSION_OPTIONS: { id: string; label: string; description: string }[] = [
  { id: "learn", label: "Learn Suite", description: "Academy access + mentor pairing" },
  { id: "plan", label: "Plan & Registry", description: "Registry concierge & catalogs" },
  { id: "connect", label: "Community & Connect", description: "Community hosting + DM tools" },
];

const STATUS_VARIANTS: Record<InviteRecord["status"], string> = {
  PENDING: "bg-[#C8A1B4]/15 text-[#3E2F35]",
  ACCEPTED: "bg-[#D9C48E]/20 text-[#3E2F35]",
  REVOKED: "bg-[#3E2F35]/10 text-[#3E2F35]",
};

const fetchInvites = async () => {
  const { data } = await api.get<{ invites: InviteRecord[] }>("/api/admin/invites");
  return data.invites ?? [];
};

export default function InviteManager() {
  const { data: invites, error, isLoading, mutate, isValidating } = useSWR<InviteRecord[]>("/api/admin/invites", fetchInvites, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRecord["role"]>("MEMBER");
  const [code, setCode] = useState(generateInviteCode("MEMBER"));
  const [permissions, setPermissions] = useState<string[]>(["learn", "plan"]);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isFormValid = useMemo(() => email.trim().length > 3, [email]);
  const inviteList = invites ?? [];

  const togglePermission = (permission: string) => {
    setPermissions((prev) => (prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]));
  };

  const handleGenerateCode = () => {
    setCode(generateInviteCode(role));
  };

  const resetForm = () => {
    setEmail("");
    setRole("MEMBER");
    setPermissions(["learn", "plan"]);
    setCode(generateInviteCode("MEMBER"));
  };

  const handleCreateInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setActionError(null);

    try {
      await api.post("/api/admin/invites", {
        email,
        role,
        permissions,
        code,
      });
      resetForm();
      await mutate();
    } catch (apiError) {
      const message =
        (apiError instanceof Error && apiError.message) || "Unable to create invite. Please try again.";
      setActionError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (value: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
  };

  const handleRevoke = async (inviteId: string) => {
    setActionError(null);
    try {
      await api.delete(`/api/admin/invites/${inviteId}`);
      await mutate();
    } catch (apiError) {
      const message =
        (apiError instanceof Error && apiError.message) || "Unable to revoke invite. Please try again.";
      setActionError(message);
    }
  };

  const renderStatusLabel = (status: InviteRecord["status"]) =>
    status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreateInvite}
        className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Invites</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Track onboarding codes</h1>
            <p className="mt-2 text-sm text-[#3E2F35]/70">
              Generate concierge-ready codes, assign role permissions, and monitor invite lifecycle.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex items-center gap-2 rounded-full border border-[#C8A1B4]/60 px-4 py-2 text-sm font-semibold text-[#3E2F35]">
              Code:
              <span className="font-mono text-[#C8A1B4]">{code}</span>
              <button type="button" onClick={handleGenerateCode} className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4">
                Refresh
              </button>
            </div>
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-tm-rose px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create invite"}
            </button>
          </div>
        </div>

        {actionError ? <p className="mt-4 text-sm text-[#B05F71]">{actionError}</p> : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_minmax(0,1fr)]">
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">
              Invitee email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="mentor@taylormadebaby.co"
                className="mt-2 w-full rounded-2xl border border-[#C8A1B4]/40 bg-[#FFFAF8] px-4 py-3 text-sm text-[#3E2F35] outline-none transition focus:border-[#C8A1B4]"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">
              Role
              <select
                value={role}
                onChange={(event) => {
                  const nextRole = event.target.value as InviteRecord["role"];
                  setRole(nextRole);
                  setCode(generateInviteCode(nextRole));
                }}
                className="mt-2 w-full rounded-2xl border border-[#C8A1B4]/40 bg-[#FFFAF8] px-4 py-3 text-sm text-[#3E2F35] outline-none transition focus:border-[#C8A1B4]"
              >
                <option value="MEMBER">Member</option>
                <option value="MENTOR">Mentor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
          </div>
          <div className="rounded-[1.9rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Permissions</p>
            <p className="mt-1 text-xs text-[#3E2F35]/65">Select which concierge surfaces this invite unlocks.</p>
            <div className="mt-4 space-y-3">
              {PERMISSION_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-transparent px-3 py-2 transition hover:border-[#C8A1B4]/50"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(option.id)}
                    onChange={() => togglePermission(option.id)}
                    className="mt-1 h-4 w-4 rounded border-[#C8A1B4]/60 text-[#C8A1B4] focus:ring-[#C8A1B4]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#3E2F35]">{option.label}</span>
                    <span className="text-xs text-[#3E2F35]/65">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <table className="min-w-full divide-y divide-[#C8A1B4]/30 text-sm text-[#3E2F35]">
          <thead className="bg-[#FFFAF8] text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/65">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">
                Email
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Role
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Permissions
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Invite code
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C8A1B4]/20">
            {isLoading || isValidating ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#3E2F35]/60">
                  Loading invites…
                </td>
              </tr>
            ) : null}
            {error ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#B05F71]">
                  Unable to load invites. Refresh to try again.
                </td>
              </tr>
            ) : null}
            {!isLoading &&
              !error &&
              inviteList.map((invite) => (
                <tr key={invite.id} className="transition hover:bg-[#FFFAF8]">
                  <td className="whitespace-nowrap px-6 py-4">{invite.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-full bg-gradient-to-r from-[#C8A1B4]/15 via-[#EAC9D1]/20 to-[#FFFAF8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                      {invite.role.toLowerCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${STATUS_VARIANTS[invite.status]}`}>
                      {renderStatusLabel(invite.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {invite.permissions.map((permission) => (
                        <span
                          key={`${invite.id}-${permission}`}
                          className="rounded-full border border-[#C8A1B4]/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-[#3E2F35]/70">{invite.code}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopy(invite.code)}
                        className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(`${invite.code}:${invite.email}`)}
                        className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]"
                      >
                        Resend
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevoke(invite.id)}
                        className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]"
                      >
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && !error && inviteList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#3E2F35]/60">
                  No invites yet. Create your first code to populate this list.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
