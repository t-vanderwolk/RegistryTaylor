import React from "react";

export function MentorCard({ mentor }) {
  if (!mentor) return null;

  return (
    <div className="rounded-2xl border border-blush/40 bg-white/80 p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <img
          src={
            mentor.avatarUrl ||
            `https://avatars.dicebear.com/api/initials/${encodeURIComponent(mentor.name || 'TM')}.svg`
          }
          alt={mentor.name || "Mentor"}
          className="h-12 w-12 rounded-full border border-white shadow-inner"
        />
        <div>
          <p className="font-medium text-charcoal">{mentor.name}</p>
          {Array.isArray(mentor.specialties) && mentor.specialties.length > 0 && (
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50">
              {mentor.specialties.join(" • ")}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-charcoal/70">
          ${(mentor.rateCents || 4000) / 100}/hr
        </span>
        <button
          type="button"
          className="rounded-xl border border-blush/40 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal transition hover:-translate-y-0.5 hover:bg-blush/30"
        >
          View
        </button>
      </div>
    </div>
  );
}

export default MentorCard;
