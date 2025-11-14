"use client";

import Link from "next/link";
import type { Route } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickAccessCards from "@/components/dashboard/QuickAccessCards";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import ReflectionPanel from "@/components/dashboard/ReflectionPanel";
import AnnouncementsFeed from "@/components/dashboard/AnnouncementsFeed";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import LearnSpotlight from "@/components/dashboard/LearnSpotlight";
import type { MemberDashboardPayload } from "@/app/dashboard/member/types";

type MemberDashboardClientProps = {
  payload: MemberDashboardPayload;
};

function UpcomingEventCard({
  events,
  href,
}: {
  events: MemberDashboardPayload["events"]["weekly"];
  href: Route;
}) {
  if (!events.length) {
    return null;
  }

  const nextEvent = events[0];
  const dateLabel = nextEvent.startsAt
    ? new Date(nextEvent.startsAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Date TBC";

  return (
    <section className="rounded-2xl border border-mauve-200/60 bg-gradient-to-br from-blush-100 via-ivory to-white p-4 shadow-mauve-card">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-charcoal-400">Next event</p>
      <h3 className="mt-2 font-[var(--font-playfair)] text-xl text-charcoal-700">{nextEvent.title ?? "Concierge salon"}</h3>
      <p className="mt-1 text-sm text-charcoal-500">{nextEvent.description ?? "Weekly mentor-led gathering"}</p>
      <dl className="mt-3 space-y-1 text-sm text-charcoal-600">
        <div className="flex justify-between">
          <dt className="text-charcoal-500">When</dt>
          <dd className="font-semibold">{dateLabel}</dd>
        </div>
        {nextEvent.location ? (
          <div className="flex justify-between">
            <dt className="text-charcoal-500">Where</dt>
            <dd className="text-right font-semibold">{nextEvent.location}</dd>
          </div>
        ) : null}
      </dl>
      <Link
        href={href}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-mauve-500/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-mauve-600"
      >
        RSVP or view all
      </Link>
    </section>
  );
}

function RegistryMiniCard({
  registry,
  href,
}: {
  registry: MemberDashboardPayload["registry"];
  href: Route;
}) {
  const curatedCount = registry.items.length;
  const percentage = registry.goal > 0 ? Math.min(100, Math.round((curatedCount / registry.goal) * 100)) : 0;

  return (
    <section className="rounded-2xl border border-mauve-200/60 bg-white/90 p-4 shadow-mauve-card">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-charcoal-400">Registry</p>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <h3 className="font-[var(--font-playfair)] text-xl text-charcoal-700">Mini overview</h3>
          <p className="text-sm text-charcoal-500">{curatedCount} of {registry.goal} pieces curated</p>
        </div>
        <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-mauve-600">{percentage}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-blush-200/70" aria-hidden>
        <span className="block h-full rounded-full bg-mauve-500 transition-all duration-500 ease-bloom" style={{ width: `${percentage}%` }} />
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-mauve-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-600 transition hover:bg-blush-100"
      >
        Open registry hub
      </Link>
    </section>
  );
}

function ConciergeCard({
  mentorName,
  href,
}: {
  mentorName: string;
  href: Route;
}) {
  return (
    <section className="rounded-2xl border border-mauve-200/60 bg-gradient-to-br from-ivory via-blush-100 to-white p-4 text-charcoal-700 shadow-mauve-card">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-charcoal-400">Concierge</p>
      <h3 className="mt-2 font-[var(--font-playfair)] text-xl">Need a quick check-in?</h3>
      <p className="mt-1 text-sm text-charcoal-500">Message {mentorName || "your mentor"} for a tailored nudge, registry help, or calm moment.</p>
      <Link
        href={href}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-mauve-500/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-mauve-600"
      >
        Message concierge
      </Link>
    </section>
  );
}

export default function MemberDashboardClient({ payload }: MemberDashboardClientProps) {
  const header = {
    firstName: payload.user.firstName,
    membershipTier: payload.user.membershipTier,
    mentorName: payload.profile.mentorName,
    currentDate: payload.user.currentDate,
  };

  const quickAccess = payload.quickAccess;
  const progress = payload.learn.progress;
  const reflections = payload.journal.reflections;
  const communityHighlights = payload.community.highlights;
  const announcements = payload.community.announcements;
  const messages = payload.community.messages;
  const learn = { modules: payload.learn.modules };
  const events = payload.events.weekly;
  const registry = payload.registry;

  const announcementCards = announcements.map((item) => ({
    ...item,
    href: item.href as Route,
  }));

  return (
    <div className="flex flex-col gap-6 pt-2 md:gap-8 lg:gap-10">
      <DashboardHeader {...header} />

      <div className="md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)] md:gap-8">
        <div className="space-y-6 md:space-y-8">
          <QuickAccessCards {...quickAccess} />
          <ProgressOverview {...progress} />
          <LearnSpotlight modules={learn.modules} />
          <AnnouncementsFeed announcements={announcementCards} />
          <MessagesPanel {...messages} />
        </div>
        <aside className="mt-6 space-y-6 md:mt-0 md:space-y-6 lg:space-y-8 md:pl-6 md:pt-2 md:sticky md:top-6">
          <ReflectionPanel reflections={reflections} communityHighlights={communityHighlights} />
          <UpcomingEventCard events={events} href={"/dashboard/member/events" as Route} />
          <RegistryMiniCard registry={registry} href={quickAccess.registry.href as Route} />
          <ConciergeCard mentorName={payload.profile.mentorName} href={quickAccess.mentor.href as Route} />
        </aside>
      </div>
    </div>
  );
}
