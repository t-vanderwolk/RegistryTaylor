import Link from "next/link";
import { LoginForm } from "../../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid gap-10">
      <header className="space-y-4">
        <p className="font-display text-3xl text-tmMauve">Taylor-Made Baby Co.</p>
        <h1 className="font-heading text-5xl text-tmCharcoal md:text-6xl">
          Welcome back to your Taylor-Made dashboard.
        </h1>
        <p className="max-w-2xl text-base text-tmCharcoal/75">
          Sign in to continue your Academy progress, refresh your registry, connect with mentors, and tap into the community.
        </p>
      </header>
      <LoginForm />
      <p className="text-sm text-tmCharcoal/70">
        Need an invitation?{" "}
        <Link
          href="/invite"
          className="font-semibold text-tmMauve underline-offset-4 transition hover:text-tmGold hover:underline"
        >
          Request access
        </Link>
      </p>
    </div>
  );
}
