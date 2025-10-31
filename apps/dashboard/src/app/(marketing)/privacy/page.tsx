export const metadata = {
  title: "Privacy Policy",
  description:
    "How Taylor-Made Baby Co. collects, stores, and protects member information across concierge services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mauve-500/80">
          Taylor-Made Baby Co.
        </p>
        <h1 className="font-serif text-4xl text-charcoal-700">Privacy Policy</h1>
        <p className="mx-auto max-w-2xl text-sm text-charcoal-500/80">
          We steward personal information with the same care we bring to every concierge experience.
          Review how we collect, use, and protect your data below.
        </p>
      </header>

      <div className="space-y-6 rounded-[3rem] border border-mauve-500/25 bg-white/95 p-8 text-sm text-charcoal-500/90 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal-700">Information we collect</h2>
          <p>
            We gather information you provide during onboarding, questionnaires, concierge messaging,
            and checkout experiences. This includes contact information, household preferences,
            registry selections, and service notes captured by mentors and doulas supporting your
            journey.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal-700">How your information is used</h2>
          <p>
            Data allows our team to personalize academy modules, maintain your registry, schedule
            salons, and coordinate with trusted third-party partners. We only share the minimum
            required details needed to deliver a premium concierge experience.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-charcoal-700">Your choices and rights</h2>
          <p>
            Members may request access, updates, or deletion of stored personal data at any time by
            contacting concierge. We honor all lawful privacy requests and maintain encrypted records
            with role-based access controls for our internal team.
          </p>
        </section>
      </div>
    </div>
  );
}
