"use client";

import { useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth";

type ProfileMenuProps = {
  user: AuthenticatedUser;
};

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#3E2F35] shadow-[0_10px_25px_rgba(62,47,53,0.12)] transition hover:-translate-y-0.5 hover:bg-white"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#C8A1B4] to-[#EAC9D1] text-sm font-bold text-white shadow-inner">
          {user.name?.[0] ?? "T"}
        </span>
        <span className="text-left">
          <span className="block text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/50">Member</span>
          <span>{user.name ?? "Taylor Member"}</span>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-3 w-56 rounded-[1.5rem] border border-[#C8A1B4]/30 bg-white/95 p-4 text-sm text-[#3E2F35] shadow-[0_20px_45px_rgba(200,161,180,0.2)]">
          <p className="font-semibold">{user.name}</p>
          <p className="mb-3 text-xs text-[#3E2F35]/60">{user.email}</p>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-sm font-semibold text-[#3E2F35] shadow-[0_8px_20px_rgba(200,161,180,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,161,180,0.45)]"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
