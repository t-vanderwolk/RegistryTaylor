import Link from "next/link";
import type { Metadata } from "next";
import { validateInviteCode } from "@/lib/onboarding";

type InvitePageProps = {
  params: { code: string };
};

export const metadata: Metadata = {
  title: "Taylor-Made Invite",
  description: "Confirm your invitation to Taylor-Made Baby Co.",
};

export default async function InviteCodePage({ params }: InvitePageProps) {
  const invite = await validateInviteCode(params.code);

  if (!invite) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-10 text-center shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Invite not found</p>
        <h1 className="font-[var(--font-playfair)] text-3xl text-[#3E2F35]">We couldn’t locate that code</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Please confirm your concierge provided invite code or contact <a href="mailto:hello@taylormadebaby.co" className="font-semibold text-[#C8A1B4] underline underline-offset-4">hello@taylormadebaby.co</a> for support.
        </p>
      </div>
    );
  }

  const roleLabel = invite.role === "ADMIN" ? "Admin" : invite.role === "MENTOR" ? "Mentor" : "Member";
  const invitedByName = invite.invitedBy?.name ?? invite.invitedBy?.email ?? "Taylor Concierge Team";
  const firstName = invite.name?.split(" ")[0] ?? "Friend";

  const statusBadge =
    invite.status === "PENDING"
      ? "bg-gradient-to-r from-[#C8A1B4]/15 via-[#EAC9D1]/25 to-[#FFFAF8] text-[#C8A1B4]"
      : invite.status === "ACCEPTED"
      ? "bg-[#C8A1B4]/15 text-[#3E2F35]"
      : "bg-[#3E2F35]/10 text-[#3E2F35]";

  return (
    <div className="mx-auto max-w-3xl space-y-8 rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-10 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">You’re invited</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Welcome, {firstName}!
        </h1>
        <p className="mt-4 text-sm text-[#3E2F35]/70">
          {invitedByName} has invited you to join Taylor-Made Baby Co. as a {roleLabel.toLowerCase()}. Confirm the
          details below to continue your onboarding.
        </p>
      </div>

      <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-inner">
        <dl className="grid gap-4 text-sm text-[#3E2F35]/75 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Invite code</dt>
            <dd className="mt-2 font-mono text-base text-[#3E2F35]">{invite.code}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Role</dt>
            <dd className="mt-2 font-semibold text-[#3E2F35]">{roleLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Email</dt>
            <dd className="mt-2 text-[#3E2F35]">{invite.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Status</dt>
            <dd className="mt-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${statusBadge}`}>
                {invite.status.toLowerCase()}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {invite.status === "PENDING" ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl text-sm text-[#3E2F35]/70">
            <p>
              This code unlocks a tailored onboarding path for the {roleLabel.toLowerCase()} experience. Have your family
              details and concierge preferences ready—the next step takes about 5 minutes.
            </p>
          </div>
          <Link
            href={`/questionnaire?code=${encodeURIComponent(invite.code)}&role=${invite.role.toLowerCase()}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_30px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.4)]"
          >
            Begin onboarding →
          </Link>
        </div>
      ) : invite.status === "ACCEPTED" ? (
        <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 text-sm text-[#3E2F35]/75 shadow-inner">
          <p>
            This invite has already been used. Continue to{" "}
            <Link href="/login" className="font-semibold text-[#C8A1B4] underline underline-offset-4">
              login
            </Link>{" "}
            or request a new code from concierge if you need assistance.
          </p>
        </div>
      ) : (
        <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 text-sm text-[#3E2F35]/75 shadow-inner">
          <p>
            This invite has expired. Reach out to{" "}
            <a href="mailto:hello@taylormadebaby.co" className="font-semibold text-[#C8A1B4] underline underline-offset-4">
              the concierge team
            </a>{" "}
            for a refreshed link.
          </p>
        </div>
      )}
    </div>
  );
}
