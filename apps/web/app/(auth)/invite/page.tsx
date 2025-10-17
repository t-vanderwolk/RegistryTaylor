import Link from "next/link";
import { InviteForm } from "../../../components/auth/InviteForm";

export default function InvitePage() {
  return (
    <div className="grid gap-10">
      <header className="space-y-4">
        <p className="font-display text-3xl text-tmMauve">Taylor-Made Baby Co.</p>
        <h1 className="font-heading text-5xl text-tmCharcoal md:text-6xl">
          Your invitation to a private, concierge-level membership.
        </h1>
        <p className="max-w-2xl text-base text-tmCharcoal/75">
          Enter your one-time invite code to step inside our unified Academy, Registry, Mentor, and Community
          experience. The journey begins the moment your code is confirmed.
        </p>
      </header>
      <InviteForm />
      <p className="text-sm text-tmCharcoal/70">
        Already activated your account?{" "}
        <Link
          href="/login"
          className="font-semibold text-tmMauve underline-offset-4 transition hover:text-tmGold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
