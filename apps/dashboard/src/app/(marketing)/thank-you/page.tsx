import Link from "next/link";

export const metadata = {
  title: "Thank You",
  description: "Thanks for requesting an invite to Taylor-Made Baby Co.",
};

export default function ThankYouPage() {
  return (
    <div className="space-y-8 text-center">
      <h1 className="font-[var(--font-playfair)] text-4xl text-[#3E2F35]">Your request is on its way</h1>
      <p className="mx-auto max-w-2xl text-sm text-[#3E2F35]/70">
        Our concierge team reviews each invite personally. Expect a warm reply within two business days with next steps,
        onboarding access, and mentor match details.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_36px_rgba(200,161,180,0.35)] transition hover:-translate-y-1 hover:bg-[#B88FA6]"
      >
        Return Home
      </Link>
    </div>
  );
}
