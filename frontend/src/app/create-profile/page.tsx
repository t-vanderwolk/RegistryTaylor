import type { Metadata } from "next";
import Link from "next/link";

type CreateProfilePageProps = {
  searchParams: {
    code?: string;
    role?: string;
  };
};

export const metadata: Metadata = {
  title: "Create Profile",
  description: "Build your Taylor-Made profile before entering the dashboard.",
};

export default function CreateProfilePage({ searchParams }: CreateProfilePageProps) {
  const inviteCode = searchParams.code?.toUpperCase();
  const roleLabel = searchParams.role ? searchParams.role.replace(/^\w/, (char) => char.toUpperCase()) : "Member";

  return (
    <div className="mx-auto max-w-4xl space-y-8 rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-10 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <header className="space-y-3 text-[#3E2F35]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Create profile</p>
        <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl">
          Finalize your {roleLabel.toLowerCase()} presence
        </h1>
        <p className="text-sm text-[#3E2F35]/70">
          Upload a photo, share pronouns, and note any immediate concierge needs. This is the final step before we prepare
          your dashboard.
        </p>
      </header>

      <form action="/confirmation" method="post" className="space-y-6">
        <input type="hidden" name="code" value={inviteCode ?? ""} />
        <input type="hidden" name="role" value={roleLabel.toLowerCase()} />

        <section className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-inner">
          <h2 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Profile basics</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[#3E2F35]/70">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Full name</span>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Taylor Member"
                className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[#3E2F35]/70">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Pronouns</span>
              <input
                type="text"
                name="pronouns"
                placeholder="she/her, they/them…"
                className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[#3E2F35]/70 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Profile image</span>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="w-full rounded-[1.5rem] border border-dashed border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35]"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-inner">
          <h2 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Concierge preferences</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[#3E2F35]/70">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Time zone</span>
              <select
                name="timezone"
                className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              >
                <option>Eastern</option>
                <option>Central</option>
                <option>Mountain</option>
                <option>Pacific</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-[#3E2F35]/70">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">
                Immediate concierge priority
              </span>
              <select
                name="priority"
                className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              >
                <option>Registry planning</option>
                <option>Nursery styling</option>
                <option>Postpartum care</option>
                <option>Mentor matching</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-[#3E2F35]/70 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Notes for mentor</span>
              <textarea
                name="mentorNotes"
                rows={4}
                placeholder="Anything we should prep before your first salon or 1:1?"
                className="w-full resize-none rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              />
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#3E2F35]/60">
            {inviteCode ? (
              <span>
                Invite <strong className="font-mono text-[#3E2F35]">{inviteCode}</strong> ·{" "}
                <span className="uppercase tracking-[0.3em] text-[#C8A1B4]">{roleLabel}</span>
              </span>
            ) : (
              <span>
                Missing your invite?{" "}
                <Link href="/request-invite" className="font-semibold text-[#C8A1B4] underline underline-offset-4">
                  Request one here
                </Link>
                .
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={{ pathname: "/questionnaire", query: { code: inviteCode ?? "", role: roleLabel.toLowerCase() } }}
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Back
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-tm-rose px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
            >
              Submit profile →
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
