// Member dashboard home
"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import {
  GraduationCap,
  ShoppingBag,
  MessageCircle,
  CalendarDays,
  Sparkles,
  Star,
  Heart,
} from "lucide-react";

const HIGHLIGHTS: ReadonlyArray<{
  icon: ReactNode;
  title: string;
  text: string;
  actionLabel: string;
  href: Route;
  accentClass: string;
}> = [
  {
    icon: <GraduationCap className="text-[#C8A1B4]" />,
    title: "Next Module",
    text: "Nursery Vision & Foundations I",
    actionLabel: "Resume →",
    href: "/dashboard/learn/welcome" as Route,
    accentClass: "focus-visible:ring-[#C8A1B4]/40",
  },
  {
    icon: <CalendarDays className="text-[#D9C48E]" />,
    title: "Upcoming Event",
    text: "Moodboard Workshop · Thu 7 PM",
    actionLabel: "RSVP →",
    href: "/dashboard/community" as Route,
    accentClass: "focus-visible:ring-[#D9C48E]/40",
  },
  {
    icon: <ShoppingBag className="text-[#C8A1B4]" />,
    title: "Affiliate Perk",
    text: "Silver Cross  ·  10% off this week",
    actionLabel: "Shop →",
    href: "/dashboard/registry" as Route,
    accentClass: "focus-visible:ring-[#C8A1B4]/40",
  },
  {
    icon: <MessageCircle className="text-[#C8A1B4]" />,
    title: "Mentor Message",
    text: "“Your Vision Board is coming together beautifully ✨”",
    actionLabel: "Reply →",
    href: "/dashboard/connect" as Route,
    accentClass: "focus-visible:ring-[#C8A1B4]/40",
  },
];

const JOURNEY_LINKS: ReadonlyArray<{
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  href: Route;
}> = [
  {
    icon: <GraduationCap />,
    title: "Academy",
    description: "Track your Nursery, Gear & Postpartum modules.",
    buttonLabel: "View Modules",
    href: "/dashboard/learn/welcome" as Route,
  },
  {
    icon: <ShoppingBag />,
    title: "Dynamic Registry",
    description: "See your curated picks and mentor recommendations.",
    buttonLabel: "Open Registry",
    href: "/dashboard/registry" as Route,
  },
  {
    icon: <MessageCircle />,
    title: "Community & Events",
    description: "Connect with mentors and join group sessions.",
    buttonLabel: "Explore Community",
    href: "/dashboard/community" as Route,
  },
];

export default function MemberDashboard() {
  const [mood, setMood] = useState("Calm");

  return (
    <div className="min-h-screen bg-[#FFFAF8] text-[#3E2F35] font-nunito">
      {/* Header */}
      <header className="rounded-b-3xl bg-gradient-to-r from-[#EAC9D1] to-[#C8A1B4] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-playfair">
            Welcome back, <span className="font-greatvibes text-4xl">Taylor</span>
          </h1>
          <p className="mt-2 text-sm text-[#3E2F35]/80 md:mt-0 md:text-base">12 weeks until Baby Day 💗</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Academy Progress", value: "45%" },
            { label: "Registry Items", value: "12 added" },
            { label: "Next Mentor Session", value: "Nov 2 @ 3 PM" },
            { label: "Events This Week", value: "2" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#D9C48E]/30 bg-white/70 p-4 text-center shadow-sm"
            >
              <p className="font-semibold text-[#C8A1B4]">{stat.value}</p>
              <p className="text-sm text-[#3E2F35]/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Today’s Highlights */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-playfair">Today’s Highlights</h2>
          <Link
            href="/dashboard/member"
            className="hidden rounded-full border border-[#C8A1B4]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8A1B4]/40 md:inline-flex"
          >
            Dashboard Home
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <HighlightCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* Taylor Journey */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="mb-4 text-2xl font-playfair">Your Taylor-Made Journey</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {JOURNEY_LINKS.map((journey) => (
            <JourneyCard key={journey.title} {...journey} />
          ))}
        </div>
      </section>

      {/* Journal */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="bg-white/70 rounded-3xl p-6 shadow-sm border border-[#D9C48E]/30">
          <h2 className="text-2xl font-playfair mb-2">My Journal</h2>
          <p className="italic text-[#3E2F35]/70 mb-4">“Every nursery begins with intention.”</p>
          <Link
            href="/dashboard/journal"
            className="inline-flex items-center justify-center rounded-full bg-[#C8A1B4] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#B98BA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8A1B4]"
          >
            Open My Journal
          </Link>
        </div>
      </section>

      {/* Achievements */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-playfair mb-4">Achievements & Badges</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { icon: <Star />, label: "Visionary Parent" },
            { icon: <Heart />, label: "Registry Curator" },
            { icon: <Sparkles />, label: "Sleep Space Certified" },
          ].map((badge, index) => (
            <div
              key={index}
              className="min-w-[180px] flex flex-col items-center bg-white/80 rounded-2xl p-4 border border-[#D9C48E]/40 shadow-sm"
            >
              {badge.icon}
              <p className="mt-2 text-sm">{badge.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Spark */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-[#EAC9D1]/70 to-[#C8A1B4]/70 rounded-3xl p-6 text-center shadow-sm">
          <p className="text-xl font-playfair mb-2">Daily Spark 🍼</p>
          <p className="text-[#3E2F35]/80 mb-4">“Describe one cozy moment from today.”</p>
          <label className="text-sm text-[#3E2F35]/70">Mood:</label>
          <select
            className="ml-2 bg-white rounded-full px-3 py-1 border border-[#D9C48E]/30"
            value={mood}
            onChange={(event) => setMood(event.target.value)}
          >
            <option>Calm</option>
            <option>Curious</option>
            <option>Playful</option>
            <option>Overwhelmed</option>
          </select>
        </div>
      </section>
    </div>
  );
}

/* --- small subcomponents --- */

type HighlightCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
  actionLabel: string;
  href: Route;
  accentClass: string;
};

function HighlightCard({ icon, title, text, actionLabel, href, accentClass }: HighlightCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/80 rounded-2xl p-4 shadow-sm border border-[#D9C48E]/30"
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-[#3E2F35]/70">{text}</p>
      <Link
        href={href}
        className={[
          "mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#C8A1B4] underline-offset-4 transition hover:text-[#B98BA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          accentClass,
        ].join(" ")}
      >
        {actionLabel}
      </Link>
    </motion.div>
  );
}

type JourneyCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  href: Route;
};

function JourneyCard({ icon, title, description, buttonLabel, href }: JourneyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/70 rounded-3xl p-6 shadow-sm border border-[#D9C48E]/30 flex flex-col items-start"
    >
      <div className="text-[#C8A1B4] mb-2">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-[#3E2F35]/70 mb-4">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-[#C8A1B4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#B98BA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8A1B4]"
      >
        {buttonLabel}
      </Link>
    </motion.div>
  );
}
