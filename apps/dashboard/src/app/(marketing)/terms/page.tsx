export const metadata = {
  title: "Terms & Conditions",
  description:
    "Review the membership terms, responsibilities, and service guidelines for Taylor-Made Baby Co.",
};

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mauve-500/80">
          Taylor-Made Baby Co.
        </p>
        <h1 className="font-serif text-4xl text-charcoal-700">Terms &amp; Conditions</h1>
        <p className="mx-auto max-w-2xl text-sm text-charcoal-500/80">
          These terms outline how memberships operate, what to expect from concierge services, and how
          we keep the Taylor experience seamless for every family.
        </p>
      </header>

      <div className="space-y-6 rounded-[3rem] border border-mauve-500/25 bg-white/95 p-8 text-sm text-charcoal-500/90 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal-700">Membership</h2>
          <p>
            Memberships renew monthly and include concierge sessions, academy access, and mentor-led
            community offerings. Members agree to keep account credentials secure and notify concierge
            of any changes to household information that impact service delivery.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal-700">Service guidelines</h2>
          <p>
            We curate recommendations with care and transparency. Taylor-Made Baby Co. may receive
            affiliate commissions on certain registry items, and all partnerships are disclosed inside
            the dashboard. Members remain responsible for purchase decisions and vendor coordination
            beyond the concierge scope.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal-700">Cancellations &amp; refunds</h2>
          <p>
            Cancel or pause your membership at any time with 7 days’ notice before the next billing
            cycle. We do not offer partial refunds for unused concierge time; however, our team will
            happily transfer remaining guidance into curated resource kits upon request.
          </p>
        </section>
      </div>
    </div>
  );
}
