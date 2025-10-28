import { useEffect } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
  title: "Welcome to Taylor-Made",
  description: "Your onboarding is complete—redirecting you to the dashboard.",
};

function AutoRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const destination = "/dashboard" as const;
      router.push(destination);
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-10 text-center shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">All set</p>
      <h1 className="font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">Your bespoke dashboard awaits</h1>
      <p className="text-sm text-[#3E2F35]/70">
        We’re prepping your experience and redirecting you to the dashboard. A concierge welcome note will be waiting with
        next steps tailored to your questionnaire.
      </p>
      <p className="text-xs text-[#3E2F35]/60">
        Redirecting in a moment… or{" "}
        <Link href="/dashboard" className="font-semibold text-[#C8A1B4] underline underline-offset-4">
          jump there now
        </Link>
        .
      </p>
      <AutoRedirect />
    </div>
  );
}
