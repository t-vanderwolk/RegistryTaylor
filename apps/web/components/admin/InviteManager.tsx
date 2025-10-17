"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { InviteRecord } from "../../lib/types";
import { API_BASE } from "../../lib/api";
import { cn } from "../../lib/utils";

type InviteManagerProps = {
  initialInvites: InviteRecord[];
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  revoked: "Revoked",
};

export function InviteManager({ initialInvites }: InviteManagerProps) {
  const [invites, setInvites] = useState<InviteRecord[]>(initialInvites);
  const [loading, setLoading] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const generateInvite = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/invite/generate`, {
        method: "POST",
        credentials: "include",
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to generate invite.");
      }
      setInvites((prev) => [json.data as InviteRecord, ...prev]);
    } catch (error) {
      console.error(error);
      window.alert("We couldn't generate a new code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const revokeInvite = async (id: string) => {
    setRevokingId(id);
    try {
      const response = await fetch(`${API_BASE}/api/invite/revoke/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to revoke invite.");
      }
      setInvites((prev) =>
        prev.map((invite) =>
          invite.id === id ? { ...invite, ...json.data } : invite
        )
      );
    } catch (error) {
      console.error(error);
      window.alert("We couldn't revoke that invite. Try again.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-heading text-2xl text-tmCharcoal">
            Invite Codes
          </h2>
          <p className="text-sm text-tmCharcoal/70">
            Generate one-time onboarding codes and monitor usage.
          </p>
        </div>
        <motion.button
          type="button"
          onClick={generateInvite}
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-tmMauve px-5 py-2 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
            loading && "opacity-60"
          )}
        >
          {loading ? "Generating..." : "Generate New Code"}
        </motion.button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-tmBlush/60 bg-white/95 shadow-soft">
        <table className="min-w-full divide-y divide-tmBlush/40 text-sm">
          <thead className="bg-tmIvory/80 text-left uppercase tracking-[0.2em] text-tmMauve/70">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Used By</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tmBlush/30">
            {invites.map((invite) => {
              const isActive = invite.is_active && !invite.used_by;
              return (
                <tr key={invite.id} className="text-tmCharcoal/80">
                  <td className="px-4 py-3 font-semibold text-tmCharcoal">
                    {invite.code}
                  </td>
                  <td className="px-4 py-3">
                    {invite.created_by ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {isActive ? STATUS_LABELS.active : STATUS_LABELS.revoked}
                  </td>
                  <td className="px-4 py-3">
                    {invite.used_by
                      ? `${invite.used_by_username ?? ""} ${invite.used_by_email ? `(${invite.used_by_email})` : ""}`
                      : "Not yet"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(invite.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => revokeInvite(invite.id)}
                      disabled={!isActive || revokingId === invite.id}
                      className={cn(
                        "rounded-full border border-tmMauve/40 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-tmMauve transition hover:border-tmGold hover:text-tmGold",
                        (!isActive || revokingId === invite.id) && "opacity-50"
                      )}
                    >
                      {invite.used_by
                        ? "Used"
                        : revokingId === invite.id
                        ? "Revoking..."
                        : "Revoke"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
