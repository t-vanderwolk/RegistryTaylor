// /src/app/dashboard/page.tsx
"use client";

import { useState } from "react";
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

export default function MemberDashboard() {
  const [mood, setMood] = useState("Calm");

  return (
    <div className="min-h-screen bg-[#FFFAF8] text-[#3E2F35] font-nunito">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#EAC9D1] to-[#C8A1B4] p-6 rounded-b-3xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-playfair">
            Welcome back, <span className="font-greatvibes text-4xl">Taylor</span>
          </h1>
          <p className="mt-2 md:mt-0 text-sm md:text-base text-[#3E2F35]/80">
            12 weeks until Baby Day 💗
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Academy Progress", value: "45%" },
            { label: "Registry Items", value: "12 added" },
            { label: "Next Mentor Session", value: "Nov 2 @ 3 PM" },
            { label: "Events This Week", value: "2" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/70 rounded-2xl p-4 text-center shadow-sm border border-[#D9C48E]/30"
            >
              <p className="font-semibold text-[#C8A1B4]">{stat.value}</p>
              <p className="text-sm text-[#3E2F35]/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Today’s Highlights */}
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h2 className="text-2xl font-playfair mb-2">Today’s Highlights</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <HighlightCard
            icon={<GraduationCap className="text-[#C8A1B4]" />}
            title="Next Module"
            text="Nursery Vision & Foundations I"
            action="Resume →"
          />
          <HighlightCard
            icon={<CalendarDays className="text-[#D9C48E]" />}
            title="Upcoming Event"
            text="Moodboard Workshop · Thu 7 PM"
            action="RSVP →"
          />
          <HighlightCard
            icon={<ShoppingBag className="text-[#C8A1B4]" />}
            title="Affiliate Perk"
            text="Silver Cross  ·  10% off this week"
            action="Shop →"
          />
          <HighlightCard
            icon={<MessageCircle className="text-[#C8A1B4]" />}
            title="Mentor Message"
            text="“Your Vision Board is coming together beautifully ✨”"
            action="Reply →"
          />
        </div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-playfair mb-4">Your Taylor-Made Journey</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <JourneyCard
            icon={<GraduationCap />}
            title="Academy"
            desc="Track your Nursery, Gear & Postpartum modules."
            button="View Modules"
          />
          <JourneyCard
            icon={<ShoppingBag />}
            title="Dynamic Registry"
            desc="See your curated picks and mentor recommendations."
            button="Open Registry"
          />
          <JourneyCard
            icon={<MessageCircle />}
            title="Community & Events"
            desc="Connect with mentors and join group sessions."
            button="Explore Community"
          />
        </div>
      </section>

      {/* Journal */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="bg-white/70 rounded-3xl p-6 shadow-sm border border-[#D9C48E]/30">
          <h2 className="text-2xl font-playfair mb-2">My Journal</h2>
          <p className="italic text-[#3E2F35]/70 mb-4">
            “Every nursery begins with intention.”
          </p>
          <button className="bg-[#C8A1B4] text-white px-6 py-2 rounded-full hover:bg-[#B98BA5] transition">
            Open My Journal
          </button>
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
          ].map((b, i) => (
            <div
              key={i}
              className="min-w-[180px] flex flex-col items-center bg-white/80 rounded-2xl p-4 border border-[#D9C48E]/40 shadow-sm"
            >
              {b.icon}
              <p className="mt-2 text-sm">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Spark */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-[#EAC9D1]/70 to-[#C8A1B4]/70 rounded-3xl p-6 text-center shadow-sm">
          <p className="text-xl font-playfair mb-2">Daily Spark 🍼</p>
          <p className="text-[#3E2F35]/80 mb-4">
            “Describe one cozy moment from today.”
          </p>
          <label className="text-sm text-[#3E2F35]/70">Mood:</label>
          <select
            className="ml-2 bg-white rounded-full px-3 py-1 border border-[#D9C48E]/30"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
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

function HighlightCard({ icon, title, text, action }: any) {
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
      <p className="text-sm text-[#C8A1B4] mt-2 font-semibold">{action}</p>
    </motion.div>
  );
}

function JourneyCard({ icon, title, desc, button }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/70 rounded-3xl p-6 shadow-sm border border-[#D9C48E]/30 flex flex-col items-start"
    >
      <div className="text-[#C8A1B4] mb-2">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-[#3E2F35]/70 mb-4">{desc}</p>
      <button className="bg-[#C8A1B4] text-white px-4 py-2 rounded-full hover:bg-[#B98BA5] transition text-sm">
        {button}
      </button>
    </motion.div>
  );
}
