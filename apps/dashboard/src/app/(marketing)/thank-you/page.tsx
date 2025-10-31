import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab]";

export const metadata = {
  title: "Thank You",
  description: "Thanks for requesting an invite to Taylor-Made Baby Co.",
};

export default function ThankYouPage() {
  return (
    <PageSection>
      <div className="mx-auto max-w-screen-md space-y-6 text-center">
        <h1 className="font-serif text-4xl text-[#3E2F35]">Your request is on its way</h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#3E2F35]/75">
          Our concierge team reviews each invite personally. Expect a warm reply within two business days with next steps,
          onboarding access, and mentor match details tailored to your family.
        </p>
        <Link href={"/" as Route} className={PRIMARY_BUTTON_CLASSES}>
          Return Home
        </Link>
      </div>
    </PageSection>
  );
}
