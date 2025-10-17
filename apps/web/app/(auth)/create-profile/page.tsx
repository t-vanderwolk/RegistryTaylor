import Link from "next/link";
import { CreateProfileForm } from "../../../components/auth/CreateProfileForm";

export default function CreateProfilePage() {
  return (
    <div className="grid gap-10">
      <header className="space-y-4">
        <p className="font-display text-3xl text-tmMauve">Taylor-Made Baby Co.</p>
        <h1 className="font-heading text-5xl text-tmCharcoal md:text-6xl">
          Create your member profile and unlock the full dashboard.
        </h1>
        <p className="max-w-2xl text-base text-tmCharcoal/75">
          Secure your username, confirm your email, and set a password to access the Academy, bespoke Registry,
          Mentor concierge, and private Community channels.
        </p>
      </header>
      <CreateProfileForm />
      <p className="text-sm text-tmCharcoal/70">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-semibold text-tmMauve underline-offset-4 transition hover:text-tmGold hover:underline"
        >
          Log in to your dashboard
        </Link>
      </p>
    </div>
  );
}
