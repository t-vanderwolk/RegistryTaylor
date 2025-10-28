import Link from "next/link";
import InviteCodeForm from "@/components/InviteCodeForm";

export const metadata = {
  title: "Concierge Birth and Baby Planning",
  description:
    "Taylor-Made Baby Co. offers calm, curated support for growing families with bespoke academy journeys, registry planning, and community care.",
};

export default function MarketingHomePage() {
  return (
    <div className="space-y-16">
      <section className="section-padding rounded-3xl border border-gold/40 bg-ivory shadow-sm">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[0.6fr,0.4fr] lg:items-start">
          <div className="space-y-6">
            <p className="font-script text-3xl text-mauve-700 leading-none">Taylor-Made Baby Co.</p>
            <h1 className="font-serif text-5xl text-charcoal-700">
              Learn · Plan · Connect — Your Journey, Taylor-Made.
            </h1>
            <p className="font-sans text-[17px] text-charcoal-500 leading-[1.7]">
              A calm, guided space for expectant parents to prepare with confidence. From the Taylor Academy to your
              personalized registry and mentor-led community, every detail is curated for serene beginnings.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/request-invite"
                className="inline-flex items-center rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-700"
              >
                Request Your Invite
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center rounded-full border border-mauve-500 px-6 py-3 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-100"
              >
                Explore the journey
              </Link>
            </div>
            <div className="mt-8">
              <InviteCodeForm />
            </div>
          </div>

          <div className="rounded-2xl border border-gold/40 bg-white p-6 shadow-md">
            <h2 className="font-serif text-2xl text-charcoal-700">Beta Membership Highlights</h2>
            <ul className="mt-4 space-y-3 font-sans text-[17px] text-charcoal-500 leading-[1.7]">
              <li>• Signature Taylor Academy journeys for Nursery, Gear, and Postpartum readiness.</li>
              <li>• Dynamic registry planning shaped by your modules and concierge insight.</li>
              <li>• Mentor circles and community salons designed for intimate, guided support.</li>
            </ul>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-500">
              Invitations released for the Beta cohort only
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-taupe">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-3">
          {[
          {
            title: "Learn",
            description:
              "Evidence-based lessons inside the Taylor-Made Baby Academy, guiding nursery, gear, and postpartum journeys with calm clarity.",
          },
          {
            title: "Plan",
            description:
              "Create a personalized, dynamic registry with concierge guidance so gifting and preparation stay beautifully aligned.",
          },
          {
            title: "Connect",
            description:
              "Gather inside a private mentor-led community that keeps celebrations, support, and planning conversations close at hand.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-gold/40 bg-ivory p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="font-serif text-2xl text-charcoal-700">{item.title}</h3>
            <p className="mt-4 font-sans text-[17px] text-charcoal-500 leading-[1.7]">{item.description}</p>
          </article>
          ))}
        </div>
      </section>

      <section className="section-padding text-center">
        <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-gold/40 bg-white p-10 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mauve-700">Concierge Membership</p>
          <h2 className="font-serif text-4xl text-charcoal-700">Hand your planning list to a team that treats it like family.</h2>
          <p className="font-sans text-[17px] text-charcoal-500 leading-[1.7]">
            Mentors, stylists, and concierge leads collaborate behind the scenes—aligning modules, registry updates, and
            community invitations so you can stay present for the moments you want to savor.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/membership"
            className="inline-flex items-center rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-700"
          >
            View membership
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full border border-mauve-500 px-6 py-3 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-100"
          >
            Read the journal
          </Link>
        </div>
      </section>
    </div>
  );
}
