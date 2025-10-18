import Link from "next/link";
import { TMCard } from "../../components/TMCard";

export default function DashboardPage() {
  return (
    <div className="grid gap-10">
      <section className="rounded-3xl bg-mauve-blush px-6 py-10 text-center shadow-soft md:px-12">
        <h1 className="font-heading text-4xl text-tmCharcoal md:text-5xl">
          Welcome back to your Taylor-Made dashboard
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-tmCharcoal/75 md:text-base">
          Continue your Academy journey, fine-tune your registry, or check in with mentors and
          community—all from this curated home base.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard/academy"
            className="rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory"
          >
            Continue Learning
          </Link>
          <Link
            href="/dashboard/registry"
            className="rounded-full border border-tmMauve/40 bg-white px-6 py-3 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory"
          >
            View Registry
          </Link>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <TMCard
          title="Taylor-Made Academy"
          subtitle="Tap into expert guidance for every nursery decision."
          className="bg-white/95 px-6 py-7"
        >
          <p className="text-sm text-tmCharcoal/70">
            Move through the Vision, Sleep, and Atmosphere tracks at your own rhythm. Each module blends
            emotional grounding with practical action.
          </p>
          <Link
            href="/dashboard/academy"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tmMauve transition hover:text-tmGold"
          >
            Explore modules →
          </Link>
        </TMCard>
        <TMCard
          title="Registry & Concierge"
          subtitle="Curate gear and care plans with mentor-backed suggestions."
          className="bg-white/95 px-6 py-7"
        >
          <p className="text-sm text-tmCharcoal/70">
            Your registry, mentor notes, and affiliate picks stay aligned here. Track what’s suggested,
            added, or ready to revisit.
          </p>
          <Link
            href="/dashboard/registry"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tmMauve transition hover:text-tmGold"
          >
            Open registry →
          </Link>
        </TMCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TMCard
          title="Mentor Sessions"
          subtitle="Prep smarter for every concierge conversation."
          className="bg-white/95 px-6 py-7"
        >
          <p className="text-sm text-tmCharcoal/70">
            Review your latest wins, challenges, and pending decisions, then arrive to your mentor touchpoint
            feeling centered and prepared.
          </p>
          <Link
            href="/dashboard/mentor"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tmMauve transition hover:text-tmGold"
          >
            View mentor tools →
          </Link>
        </TMCard>
        <TMCard
          title="Community"
          subtitle="Share, ask, celebrate with the Taylor-Made circle."
          className="bg-white/95 px-6 py-7"
        >
          <p className="text-sm text-tmCharcoal/70">
            Jump into the latest threads, offer support, or request feedback. This is your trusted space
            to connect with other families.
          </p>
          <Link
            href="/dashboard/community"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tmMauve transition hover:text-tmGold"
          >
            Join the conversation →
          </Link>
        </TMCard>
      </div>
    </div>
  );
}
