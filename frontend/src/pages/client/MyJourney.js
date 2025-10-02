import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import {
  buildFocusItems,
  buildMilestones,
  recentWinPlaceholders,
  TOTAL_PROJECT_PHASES,
} from "./progressUtils";

const TOTAL_GESTATION_DAYS = 280;

const computeJourney = (profile) => {
  const dueDateString = profile?.due_date || null;
  if (!dueDateString) {
    return {
      dueDate: null,
      formattedDueDate: null,
      daysUntil: null,
      weeksUntil: null,
      currentWeek: null,
      stage: "Awaiting due date",
      progressPercent: 0,
    };
  }

  const dueDate = new Date(dueDateString);
  if (Number.isNaN(dueDate.getTime())) {
    return {
      dueDate: null,
      formattedDueDate: null,
      daysUntil: null,
      weeksUntil: null,
      currentWeek: null,
      stage: "Awaiting due date",
      progressPercent: 0,
    };
  }

  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const daysUntil = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  const weeksUntil = Math.round(daysUntil / 7);
  const daysElapsed = Math.min(TOTAL_GESTATION_DAYS, Math.max(0, TOTAL_GESTATION_DAYS - daysUntil));
  const currentWeek = Math.round(daysElapsed / 7);
  const progressPercent = Math.min(100, Math.max(0, Math.round((daysElapsed / TOTAL_GESTATION_DAYS) * 100)));

  let stage = "First trimester";
  if (currentWeek >= 27) {
    stage = "Third trimester";
  } else if (currentWeek >= 13) {
    stage = "Second trimester";
  }

  if (diffMs <= 0) {
    stage = "Baby is here";
  }

  const formattedDueDate = dueDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    dueDate,
    formattedDueDate,
    daysUntil,
    weeksUntil,
    currentWeek,
    stage,
    progressPercent,
  };
};

const buildTimeline = (currentWeek) => {
  const phases = [
    {
      key: "welcome",
      title: "Welcome Consult",
      detail: "Kickoff call to map the concierge experience and set registry goals.",
      week: 6,
    },
    {
      key: "registry",
      title: "Registry Curation",
      detail: "Curated registry blueprint is delivered and we layer in boutique finds.",
      week: 14,
    },
    {
      key: "nursery",
      title: "Nursery Styling",
      detail: "Space planning, scent palette, and delivery coordination lock into place.",
      week: 24,
    },
    {
      key: "celebration",
      title: "Celebration Touches",
      detail: "Sip & See, maternity shoot, and gifting experiences are queued.",
      week: 32,
    },
    {
      key: "arrival",
      title: "Arrival Prep",
      detail: "Hospital checklist, support roster, and post-baby concierge plan finalized.",
      week: 38,
    },
  ];

  return phases.map((phase) => {
    const completed = currentWeek !== null && currentWeek >= phase.week;
    const inProgress = currentWeek !== null && currentWeek < phase.week && currentWeek >= phase.week - 4;
    const status = completed ? "complete" : inProgress ? "active" : "upcoming";
    return { ...phase, status };
  });
};

const buildChecklist = (profile, journey) => {
  const items = [
    {
      title: "Refresh your Bio",
      detail: "Keep us posted on nursery inspiration and celebration plans.",
      done: Boolean(profile?.family_intro),
      link: "/client-portal/bio",
      cta: "Update Bio",
    },
    {
      title: "Confirm Mentor Touchpoint",
      detail: profile?.mentor_preference
        ? `Schedule your next touchpoint with ${profile.mentor_preference}.`
        : "Let us know if you have a mentor preference so we can align the right specialist.",
      done: Boolean(profile?.mentor_preference),
      link: "/client-portal/services",
      cta: profile?.mentor_preference ? "Schedule call" : "Share preference",
    },
    {
      title: "Share a memory in the Community Forum",
      detail: "Capture a note for your concierge lounge or invite mentors into the moment.",
      done: false,
      link: "/community-forum",
      cta: "Open Community Forum",
    },
  ];

  if (!journey.dueDate) {
    items.unshift({
      title: "Add your due date",
      detail: "Set the countdown so we can pace deliveries and celebration touchpoints.",
      done: false,
      link: "/client-portal/bio",
      cta: "Add due date",
    });
  }

  return items;
};

const MyJourney = () => {
  const { user } = useAuth();
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setState((current) => ({ ...current, status: "loading", error: null }));
      try {
        const response = await api.get("/api/v1/profile/me");
        if (!cancelled) {
          setState({ status: "ready", data: response.data?.data || {}, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          const message = error.response?.data?.error?.message || "Unable to load your journey.";
          setState({ status: "error", data: null, error: message });
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <section className="rounded-[2.5rem] border border-babyPink/30 bg-white/90 p-8 text-center shadow-soft backdrop-blur-sm">
        <p className="font-heading text-blueberry">Mapping your Taylor-Made journey…</p>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="rounded-[2.5rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-soft backdrop-blur-sm">
        <p className="font-heading text-rose-600">{state.error}</p>
        <p className="mt-3 text-sm text-rose-600/80">Refresh to try again or visit your Bio to ensure your concierge profile is saved.</p>
      </section>
    );
  }

  const profile = state.data?.profile || {};
  const babyName = profile.baby_name || "Baby";
  const parentName = profile.parent_one_name || user?.name || "Family";
  const journey = computeJourney(profile);
  const timeline = buildTimeline(journey.currentWeek);
  const checklist = buildChecklist(profile, journey);
  const milestones = buildMilestones(profile);
  const focusItems = buildFocusItems(milestones);
  const completedMilestones = milestones.filter((item) => item.done).length;
  const milestonePercent = Math.round((completedMilestones / milestones.length) * 100);
  const totalCompletedPhases = Math.min(TOTAL_PROJECT_PHASES, completedMilestones * 3);

  const mentorLabel = profile.mentor_preference || "Assigned mentor";
  const packageChoice = profile.package_choice || "Concierge";

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full border border-babyBlue/30 bg-babyBlue/10 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
            {packageChoice} Journey
          </span>
          <h1 className="font-heading text-3xl text-blueberry">Hi {parentName.split(" ")[0]}, here is {babyName}&rsquo;s current arc.</h1>
          <p className="max-w-2xl text-sm font-body leading-relaxed text-darkText/70">
            We keep every milestone paced and polished. Update your Bio when details shift so the countdown, registry, and concierge touches always align.
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <JourneyStat label="Due Date" value={journey.formattedDueDate || "Add in Bio"} />
            <JourneyStat label="Weeks to go" value={journey.weeksUntil !== null ? `${journey.weeksUntil}` : "-"} />
            <JourneyStat label="Stage" value={journey.stage} />
            <JourneyStat label="Concierge Lead" value={mentorLabel} />
          </div>
          {journey.progressPercent > 0 && (
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Journey Progress</p>
              <div className="mt-2 h-3 w-full rounded-full bg-babyPink/20">
                <div
                  className="h-full rounded-full bg-babyPink"
                  style={{ width: `${journey.progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-body text-darkText/60">{journey.progressPercent}% of your concierge timeline is complete.</p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-4">
          <header className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">Taylor-Made Timeline</h2>
            <p className="text-sm font-body text-darkText/70">We choreograph each touchpoint so you can stay present. Here&rsquo;s where we are right now.</p>
          </header>
          <ol className="space-y-4">
            {timeline.map((item) => (
              <li
                key={item.key}
                className={`rounded-3xl border px-5 py-4 shadow-soft transition ${
                  item.status === "complete"
                    ? "border-babyBlue/40 bg-babyBlue/10"
                    : item.status === "active"
                    ? "border-babyPink/40 bg-babyPink/15"
                    : "border-darkText/10 bg-white"
                }`}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-heading text-blueberry">{item.title}</p>
                  <span className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/50">
                    Week {item.week}
                  </span>
                </div>
                <p className="mt-2 text-sm font-body text-darkText/75">{item.detail}</p>
                <JourneyStatus status={item.status} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-2">
          <h2 className="font-heading text-2xl text-blueberry">Concierge Milestones</h2>
          <p className="text-sm font-body text-darkText/70">{completedMilestones} of {milestones.length} major moments complete · {milestonePercent}% of Taylor’s plan.</p>
        </header>
        <div className="mt-6 h-3 w-full rounded-full bg-babyPink/20">
          <div className="h-full rounded-full bg-babyPink" style={{ width: `${milestonePercent}%` }} />
        </div>
        <p className="mt-2 text-xs font-body text-darkText/50">{totalCompletedPhases} of {TOTAL_PROJECT_PHASES} concierge phases prepared.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {milestones.map((item) => (
            <article
              key={item.id}
              className={`rounded-[2rem] border px-6 py-5 shadow-soft ${
                item.done ? "border-babyBlue/30 bg-babyBlue/10" : "border-babyPink/30 bg-white"
              }`}
            >
              <p className="font-heading text-lg text-blueberry">{item.title}</p>
              <p className="mt-2 text-sm font-body text-darkText/70">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-2">
          <h2 className="font-heading text-2xl text-blueberry">Focus with Taylor</h2>
          <p className="text-sm font-body text-darkText/70">These are the next concierge moves on deck. Share updates and the team will keep momentum.
          </p>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {focusItems.map((item) => (
            <article
              key={item.id}
              className="flex h-full flex-col justify-between rounded-[2rem] border border-babyBlue/25 bg-babyBlue/10 px-6 py-5 shadow-soft"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full border border-babyPink/40 bg-white/70 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-blueberry/80">
                  Concierge focus
                </span>
                <h3 className="font-heading text-lg text-blueberry">{item.title}</h3>
                <p className="text-sm font-body leading-relaxed text-darkText/75">{item.description}</p>
              </div>
              <Link
                to={item.link}
                className="mt-5 inline-flex items-center justify-center rounded-full border border-babyBlue/30 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry hover:-translate-y-0.5 hover:bg-babyPink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
              >
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-2">
          <h2 className="font-heading text-2xl text-blueberry">Concierge Checklist</h2>
          <p className="text-sm font-body text-darkText/70">Quick actions to keep everything flowing smoothly.</p>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {checklist.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`rounded-3xl border px-6 py-5 shadow-soft transition ${
                item.done ? "border-babyBlue/30 bg-babyBlue/10" : "border-babyPink/30 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-blueberry">{item.title}</p>
                  <p className="mt-2 text-sm font-body text-darkText/70">{item.detail}</p>
                </div>
                {item.done && (
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-babyBlue/40 text-xs font-heading uppercase text-blueberry">
                    ✓
                  </span>
                )}
              </div>
              <Link
                to={item.link}
                className="mt-4 inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry"
              >
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-pastelPurple/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-2">
          <h2 className="font-heading text-2xl text-blueberry">Memory Lane</h2>
          <p className="text-sm font-body text-darkText/70">Drop milestones, love notes, or behind-the-scenes details so mentors can celebrate with you.</p>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MemoryCard
            title="Registry wins"
            detail="Snapshot the items you said yes to and why they felt right."
            actionLabel="Share in Community Forum"
            to="/community-forum"
          />
  <MemoryCard
    title="Nursery progress"
    detail="Upload photos or key decisions so your mentor can align merch drops."
    actionLabel="Share update"
    to="/client-portal/memories"
  />
          <MemoryCard
            title="Heartbeat moments"
            detail="Capture the little memories: playlists, cravings, loved ones&rsquo; reactions."
            actionLabel="Add to Community Forum"
            to="/community-forum"
          />
        </div>
        <div className="mt-8 rounded-[2rem] border border-pastelPurple/40 bg-white px-6 py-5 shadow-soft">
          <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Recent wins</p>
          <ul className="mt-3 space-y-2 text-sm font-body text-darkText/75">
            {recentWinPlaceholders.map((win) => (
              <li key={win} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blueberry/60" />
                <span>{win}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

const JourneyStat = ({ label, value }) => {
  const displayValue = value === null || value === undefined || value === "" ? "-" : value;
  return (
    <div className="rounded-3xl border border-babyBlue/30 bg-white px-5 py-4 shadow-soft">
      <p className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/50">{label}</p>
      <p className="mt-2 text-lg font-heading text-blueberry">{displayValue}</p>
    </div>
  );
};

const JourneyStatus = ({ status }) => {
  const copy = {
    complete: "Completed",
    active: "In progress",
    upcoming: "Up next",
  }[status];

  return (
    <span
      className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.3em] ${
        status === "complete"
          ? "bg-babyBlue/30 text-blueberry"
          : status === "active"
          ? "bg-babyPink/30 text-blueberry"
          : "bg-darkText/10 text-darkText/60"
      }`}
    >
      {copy}
    </span>
  );
};

const MemoryCard = ({ title, detail, actionLabel, to }) => (
  <div className="rounded-3xl border border-pastelPurple/40 bg-white px-6 py-5 shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy">
    <p className="font-heading text-blueberry">{title}</p>
    <p className="mt-3 text-sm font-body text-darkText/70">{detail}</p>
    <Link to={to} className="mt-4 inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry">
      {actionLabel}
    </Link>
  </div>
);

export default MyJourney;
