import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import { MentorCard } from "../features/mentors";
import { useSafeFetch } from "../hooks/useSafeFetch";
import EmptyState from "../components/UI/EmptyState";

const Mentors = () => {
  const { data, loading, error } = useSafeFetch("/api/mentors", {}, { fallback: { data: [] } });
  const mentors = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section
        title="Taylor-Made Mentor Circle"
        center
        compact
        tightTop
        className="bg-gradient-to-br from-pastelPurple/45 via-white to-softGold/25"
      >
        <div className="space-y-6">
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-cozyGray/80 sm:text-lg">
            When you become a Taylor-Made member, you’re paired with mothers who’ve lived the milestones you’re approaching. Every mentor is personally vetted, bound by NDA, and ready to provide calm, lived-in wisdom the moment you need it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary px-6 py-3 text-xs sm:px-8 sm:text-sm">
              Request a Mentor Match
            </Link>
            <a href="#apply" className="btn-secondary px-6 py-3 text-xs sm:px-8 sm:text-sm">
              Apply to Mentor
            </a>
          </div>
        </div>
      </Section>
      <Section title="Meet Our Mentors" compact className="bg-alt-blue">
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-cozyGray/75 sm:text-base">
          Our circle stays intentionally intimate so every family receives thoughtful attention. Here are a few of the women currently supporting Taylor-Made members.
        </p>
        {loading && <p className="text-sm text-cozyGray/70">Loading mentors…</p>}
        {error && (
          <EmptyState
            title="Unable to load mentors"
            subtitle={error.message || "Please try again soon."}
          />
        )}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
            {!mentors.length && (
              <EmptyState title="New mentors joining soon" subtitle="Taylor is curating the next circle." />
            )}
          </div>
        )}
      </Section>
      <Section id="apply" title="Become a Taylor-Made Mentor" compact className="bg-alt-green">
        <div className="space-y-5 text-cozyGray/80">
          <p>
            If you’re a seasoned mother who loves making moments calmer for others, we’d love to meet you. Share a bit about your story, and our concierge team will reach out within 48 hours.
          </p>
          <div className="rounded-3xl border border-softGold/25 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
            <form className="grid gap-4">
              <label className="flex flex-col text-sm">
                <span className="uppercase tracking-[0.2em] text-deepSlate/70">Name</span>
                <input
                  type="text"
                  className="mt-2 rounded-2xl border border-softGold/30 bg-white/80 px-4 py-3 text-sm text-deepSlate focus:border-softGold focus:outline-none"
                  placeholder="Your full name"
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="uppercase tracking-[0.2em] text-deepSlate/70">Email</span>
                <input
                  type="email"
                  className="mt-2 rounded-2xl border border-softGold/30 bg-white/80 px-4 py-3 text-sm text-deepSlate focus:border-softGold focus:outline-none"
                  placeholder="name@example.com"
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="uppercase tracking-[0.2em] text-deepSlate/70">Seasons you love supporting</span>
                <input
                  type="text"
                  className="mt-2 rounded-2xl border border-softGold/30 bg-white/80 px-4 py-3 text-sm text-deepSlate focus:border-softGold focus:outline-none"
                  placeholder="e.g. multiples, travel, fourth trimester"
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="uppercase tracking-[0.2em] text-deepSlate/70">A note from you</span>
                <textarea
                  rows="4"
                  className="mt-2 rounded-2xl border border-softGold/30 bg-white/80 px-4 py-3 text-sm text-deepSlate focus:border-softGold focus:outline-none"
                  placeholder="Share a glimpse into your family and why you feel called to mentor."
                />
              </label>
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center rounded-full border border-deepSlate/20 bg-white/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-deepSlate transition hover:border-deepSlate/40 hover:bg-white"
              >
                Submit Mentor Application
              </button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Mentors;
