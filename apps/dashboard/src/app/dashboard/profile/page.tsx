import { apiFetch } from "@/lib/apiClient";
import { requireMember } from "@/lib/auth";

type ApiProfile = {
  profile?: {
    userId: string;
    notes?: string | null;
    conciergePriority?: number | null;
    mentor?: {
      email?: string | null;
    } | null;
  } | null;
};

function toDisplayName(email?: string | null): string {
  if (!email) return "Taylor-Made Mentor";
  const namePart = email.split("@")[0] ?? "";
  if (!namePart) return email;
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default async function ProfilePage() {
  const member = await requireMember();

  const profileResponse = await apiFetch<ApiProfile>("/api/profiles/me", {
    cache: "no-store",
    credentials: "include",
  }).catch(() => null);

  const mentorName = toDisplayName(profileResponse?.profile?.mentor?.email);

  return (
    <div className="min-h-screen bg-[#FFFAF8] text-[#3E2F35]">
      <main className="mx-auto flex max-w-[960px] flex-col gap-12 px-6 py-16 sm:px-10 lg:px-12">
        <section className="rounded-[2.75rem] bg-gradient-to-r from-[#EAC9D1]/85 to-[#C8A1B4]/80 p-10 shadow-[0_40px_90px_rgba(200,161,180,0.22)]">
          <p className="text-xs uppercase tracking-[0.38em] text-[#3E2F35]/70">
            Member profile · Signature Taylor-Made
          </p>
          <h1 className="mt-4 text-4xl font-[var(--font-playfair)] leading-tight sm:text-[2.75rem]">
            Your concierge preferences
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-[#3E2F35]/75">
            This page holds key details for your mentor team. Update notes ahead of sessions,
            document priorities, and keep your concierge circle in sync.
          </p>
        </section>

        <section className="rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-8 shadow-[0_28px_65px_rgba(200,161,180,0.18)]">
          <h2 className="text-2xl font-[var(--font-playfair)]">Member details</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/55">Member name</dt>
              <dd className="mt-2 text-lg font-[var(--font-playfair)]">{member.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/55">Concierge mentor</dt>
              <dd className="mt-2 text-lg font-[var(--font-playfair)]">{mentorName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/55">Concierge priority</dt>
              <dd className="mt-2 text-lg font-[var(--font-playfair)]">
                {profileResponse?.profile?.conciergePriority ?? "We’re calibrating your journey"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/55">Notes for your mentor team</dt>
              <dd className="mt-2 text-sm leading-relaxed text-[#3E2F35]/75">
                {profileResponse?.profile?.notes ??
                  "Capture how you’d like the team to support you this trimester. This space will soon support live edits."}
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
