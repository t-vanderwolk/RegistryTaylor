import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConsultationSection from "../../components/ConsultationSection";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import {
  buildFocusItems,
  buildMilestones,
  computeTimeline,
  recentWinPlaceholders,
  TOTAL_PROJECT_PHASES,
} from "./progressUtils";

const computeCountdown = (dueDate) => {
  if (!dueDate) return null;
  const target = new Date(dueDate);
  if (Number.isNaN(target.getTime())) return null;

  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, overdue: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, overdue: false };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [profileState, setProfileState] = useState({ status: "loading", data: null, error: null });
  const [countdown, setCountdown] = useState(null);

  const clientProfile = profileState.data?.profile || {};
  const packageChoice = clientProfile.package_choice || "Concierge";
  const mentorName = clientProfile.mentor_preference || "Taylor";
  const babyName = clientProfile.baby_name || "Little One";
  const parentName = (clientProfile.parent_one_name || user?.name || "Friend").split(" ")[0];
  const dueDate = clientProfile.due_date;

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setProfileState((current) => ({ ...current, status: "loading", error: null }));
      try {
        const response = await api.get("/api/v1/profile/me");
        if (!cancelled) {
          setProfileState({ status: "ready", data: response.data?.data || {}, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          const message = error.response?.data?.error?.message || "Unable to load your concierge profile.";
          setProfileState({ status: "error", data: null, error: message });
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dueDate) {
      setCountdown(null);
      return undefined;
    }

    setCountdown(computeCountdown(dueDate));
    const interval = setInterval(() => {
      setCountdown(computeCountdown(dueDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [dueDate]);

  const countdownCopy = () => {
    if (!countdown) return "Set your due date in Profile";
    if (countdown.overdue) return "Baby countdown complete";
    return [
      `${countdown.days}d`,
      `${String(countdown.hours).padStart(2, "0")}h`,
      `${String(countdown.minutes).padStart(2, "0")}m`,
      `${String(countdown.seconds).padStart(2, "0")}s`,
    ].join(" • ");
  };

  const timeline = computeTimeline(clientProfile);
  const milestones = buildMilestones(clientProfile);
  const focusItems = buildFocusItems(milestones);
  const completedMilestones = milestones.filter((item) => item.done).length;
  const milestonePercent = Math.round((completedMilestones / milestones.length) * 100);
  const totalCompletedPhases = Math.min(TOTAL_PROJECT_PHASES, completedMilestones * 3);
  const nextFocus = focusItems.slice(0, 2);

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Add in Profile";

  const overviewStats = [
    { label: "Due Date", value: formattedDueDate },
    { label: "Stage", value: timeline.stageLabel },
    { label: "Baby", value: babyName },
    { label: "Concierge Lead", value: mentorName },
    { label: "Membership", value: packageChoice },
  ];

  const upcomingSupport = [
    {
      title: "Nursery Styling Session",
      detail: "Tuesday · 2:00 PM",
      owner: mentorName,
    },
    {
      title: "Registry Refinement Call",
      detail: "Thursday · 11:30 AM",
      owner: "Taylor Concierge",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-babyPink/40 bg-babyPink/15 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
              {packageChoice} Concierge
            </span>
            <h1 className="font-heading text-3xl text-blueberry sm:text-4xl">Welcome back, {parentName}.</h1>
            <p className="text-sm font-body leading-relaxed text-darkText/75">
              Your concierge circle is keeping every detail polished. Share updates in Messages whenever timelines, guests, or inspiration shifts.
            </p>
          </div>
          <div className="w-full max-w-xs rounded-3xl border border-babyBlue/30 bg-babyBlue/10 p-6 text-center shadow-soft">
            <p className="text-[0.65rem] font-heading uppercase tracking-[0.35em] text-darkText/50">Countdown to Baby</p>
            <p className="mt-3 text-2xl font-heading text-blueberry">{countdownCopy()}</p>
            <p className="mt-2 text-xs font-body uppercase tracking-[0.3em] text-darkText/45">We’ll keep everything pacing with this date.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {overviewStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-3xl border border-babyBlue/25 bg-white/90 px-4 py-4 text-center shadow-soft"
            >
              <p className="text-[0.65rem] font-heading uppercase tracking-[0.3em] text-darkText/45">{stat.label}</p>
              <p className="mt-2 text-sm font-heading text-blueberry">{stat.value}</p>
            </article>
          ))}
        </div>
        {profileState.status === "error" && (
          <p className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-body text-rose-600">
            {profileState.error}
          </p>
        )}
      </section>

      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-blueberry">This Week</h2>
            <p className="text-sm font-body text-darkText/70">Upcoming touchpoints and concierge focus at a glance.</p>
          </div>
          <Link
            to="/client-portal/journey"
            className="inline-flex items-center justify-center rounded-full border border-babyBlue/30 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry hover:-translate-y-0.5 hover:bg-babyPink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
          >
            View full journey
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-babyBlue/30 bg-babyBlue/10 p-5 shadow-soft">
            <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Concierge Focus</p>
            {nextFocus.map((item) => (
              <div key={item.id} className="mt-4 space-y-1">
                <p className="font-heading text-blueberry">{item.title}</p>
                <p className="text-sm font-body text-darkText/70">{item.description}</p>
              </div>
            ))}
            <Link
              to="/client-portal/messages"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-babyBlue/30 bg-white px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry hover:-translate-y-0.5 hover:bg-babyPink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
            >
              Share update
            </Link>
          </article>
          {upcomingSupport.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-babyPink/30 bg-white/95 p-5 shadow-soft"
            >
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Upcoming Support</p>
              <h3 className="mt-3 font-heading text-lg text-blueberry">{item.title}</h3>
              <p className="mt-2 text-sm font-body text-darkText/70">{item.detail}</p>
              <p className="mt-1 text-xs font-heading uppercase tracking-[0.3em] text-darkText/45">{item.owner}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl text-blueberry">Milestone Progress</h2>
          <p className="text-sm font-body text-darkText/70">{completedMilestones} of {milestones.length} milestones complete · {milestonePercent}% of concierge plan.</p>
        </div>
        <div className="mt-6 h-3 w-full rounded-full bg-babyPink/20">
          <div className="h-full rounded-full bg-babyPink" style={{ width: `${milestonePercent}%` }} />
        </div>
        <p className="mt-2 text-xs font-body text-darkText/50">{totalCompletedPhases} of {TOTAL_PROJECT_PHASES} phases prepared.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {milestones.map((milestone) => (
            <article
              key={milestone.id}
              className={`rounded-[2rem] border px-6 py-5 shadow-soft ${
                milestone.done ? "border-babyBlue/30 bg-babyBlue/10" : "border-babyPink/30 bg-white/90"
              }`}
            >
              <p className="font-heading text-lg text-blueberry">{milestone.title}</p>
              <p className="mt-2 text-sm font-body text-darkText/70">{milestone.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-2xl text-blueberry">Messages & Wins</h2>
            <p className="text-sm font-body text-darkText/70">Stay in sync with your mentor team and celebrate recent progress.</p>
          </div>
          <Link
            to="/client-portal/messages"
            className="inline-flex items-center justify-center rounded-full border border-babyBlue/30 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry hover:-translate-y-0.5 hover:bg-babyPink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
          >
            Open messages
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-babyBlue/25 bg-babyBlue/10 p-6 shadow-soft">
            <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">From {mentorName}</p>
            <p className="mt-3 text-sm font-body leading-relaxed text-darkText/75">
              “I added three travel-ready must-haves to your registry. Take a peek and let me know what you love!”
            </p>
          </article>
          <article className="rounded-[2rem] border border-babyPink/30 bg-babyPink/15 p-6 shadow-soft">
            <p className="text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">Recent wins</p>
            <ul className="mt-3 space-y-2 text-sm font-body text-darkText/75">
              {recentWinPlaceholders.map((win) => (
                <li key={win} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blueberry/60" />
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-0 shadow-soft backdrop-blur-sm">
        <div className="space-y-4 border-b border-babyPink/30 px-8 py-6">
          <span className="inline-flex items-center rounded-full border border-babyPink/40 bg-babyPink/15 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
            Concierge Video Support
          </span>
          <h2 className="font-heading text-2xl text-blueberry">Need to talk? Schedule a video call.</h2>
          <p className="max-w-xl text-sm font-body leading-relaxed text-darkText/70">
            Book time with Taylor or your mentor for milestone planning, registry refreshes, or a calming check-in.
          </p>
        </div>
        <div className="px-2 pb-8 pt-4 sm:px-4">
          <ConsultationSection />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
