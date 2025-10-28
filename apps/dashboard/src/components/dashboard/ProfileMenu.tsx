"use client";

import { useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth";

type ProfileMenuProps = {
  user: AuthenticatedUser;
};

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const roleLabel =
    user.role === "ADMIN" ? "Admin" : user.role === "MENTOR" ? "Mentor" : "Member";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-charcoal-700 shadow-sm transition hover:shadow-md"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mauve-500 text-sm font-bold text-white shadow-sm">
          {user.name?.[0] ?? "T"}
        </span>
        <span className="text-left">
          <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-500">
            {roleLabel}
          </span>
          <span>{user.name ?? "Taylor Member"}</span>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-gold/30 bg-white p-4 text-sm text-charcoal-700 shadow-lg">
          <p className="font-semibold text-charcoal-700">{user.name}</p>
          <p className="mb-3 text-xs text-charcoal-500">{user.email}</p>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-full bg-mauve-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-mauve-700 active:scale-95"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
