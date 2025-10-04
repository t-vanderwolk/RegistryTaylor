import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HowItWorks from "../components/HowItWorks";
import FAQAccordion from "../components/FAQAccordion";
import MembershipHighlights from "../components/MembershipHighlights";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import InviteForm from "../components/InviteForm";
import ConsultationSection from "../components/ConsultationSection";
import PageHero from "../components/UI/PageHero";
import Button from "../components/UI/Button";
import api from "../lib/api";

import heroBackdrop from "../assets/nursery-1.jpeg";

const highlightCards = [
  {
    title: "Registry Suites",
    copy: "Curated lists, gentle timelines, and gifting tips shaped for your circle of loved ones.",
    icon: "🛍️",
  },
  {
    title: "Nursery Editorials",
    copy: "Layouts, paint palettes, and styling days that turn inspiration into a lived-in retreat.",
    icon: "🛏️",
  },
  {
    title: "Celebration Concierge",
    copy: "Showers, sip & sees, and welcome-home moments coordinated from RSVP to final bow.",
    icon: "🎀",
  },
];

const statHighlights = [
  { label: "Private Clientele", value: "Five families per season" },
  { label: "Design Footprint", value: "Tempe · Phoenix · Scottsdale · Cape Cod" },
  { label: "Always Curating", value: "Soft palettes, warm welcomes, thoughtful keepsakes" },
];

const fadeInClass = "motion-safe:animate-fade-in-up";

const Home = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleVerification = async (event) => {
    event.preventDefault();
    const trimmed = inviteCode.trim().toUpperCase();

    if (!trimmed) {
      setError("Please enter your invite code.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await api.get(`/api/v1/auth/invites/${encodeURIComponent(trimmed)}`);
      const invite = response.data?.data;
      if (!invite) {
        throw new Error("That invite code was not found. Please confirm with Taylor.");
      }

      setStatus("success");
      setInviteCode("");

      navigate("/create-profile", {
        state: {
          inviteCode: invite.code,
          role: invite.role,
          invitedEmail: invite.assigned_email || "",
          inviteInfo: invite,
        },
      });
    } catch (err) {
      setStatus("error");
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "That invite code was not found. Please confirm with Taylor."
      );
    }
  };

  return (
    <div className="space-y-24 pb-28 pt-16 sm:space-y-28">
      <PageHero
        backgroundImage={heroBackdrop}
        eyebrow="Invite-only Concierge"
        subtitle="Baby Co."
        description="Taylor choreographs registries, nursery styling, and celebration planning so every reveal feels gentle, personal, and joyfully ready."
        primaryCta={{ label: "Request Invite", href: "#request-invite", as: "a", className: "px-9 py-3" }}
        secondaryCta={{ label: "Explore Memberships", to: "/membership", className: "px-9 py-3" }}
      >
        <div className="mx-auto max-w-3xl space-y-7 text-center text-blueberry">
          <p className="text-sm leading-relaxed text-blueberry/80 sm:text-base">
            Taylor serves a limited number of private families each season, guiding registries, nursery styling, and celebration plans with calm structure and thoughtful detail.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-heading uppercase tracking-[0.32em] text-blueberry/60">
            {statHighlights.map((item) => (
              <span key={item.label} className="rounded-full bg-white/80 px-4 py-2 shadow-soft">
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        </div>
      </PageHero>

      <section className={`mx-auto max-w-[1100px] space-y-8 rounded-[3.5rem] border border-primary/20 bg-white/95 px-6 py-16 text-center shadow-soft backdrop-blur-sm sm:px-14 ${fadeInClass}`}>
        <h2 className="text-2xl font-heading text-blueberry sm:text-3xl">Concierge Services</h2>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-blueberry/75 sm:text-base">
          Each experience blends registry guidance, nursery styling, and celebration planning with the same meticulous care Taylor brings to every family.
        </p>
        <ul className="space-y-6">
          {highlightCards.map((item) => (
            <li
              key={item.title}
              className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-[2.75rem] border border-primary/20 bg-white px-8 py-10 text-center shadow-soft ring-1 ring-gold/30 transition duration-300 hover:-translate-y-1 hover:shadow-dreamy"
            >
              <p className="font-serif text-xl uppercase tracking-[0.4em] text-blueberry">{item.title}</p>
              <p className="text-sm leading-7 text-blueberry/70 sm:text-base">{item.copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`mx-auto max-w-[720px] rounded-[3.25rem] border border-primary/20 bg-white/95 px-6 py-12 text-center shadow-soft backdrop-blur-sm sm:px-12 ${fadeInClass}`}>
        <h2 className="text-2xl font-heading text-blueberry sm:text-3xl">Already invited?</h2>
        <p className="mt-3 text-sm leading-relaxed text-blueberry/75 sm:text-base">Enter your private concierge code to confirm your spot and create your profile.</p>
        <form onSubmit={handleVerification} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="hero-invite-code" className="sr-only">Invite code</label>
          <input
            id="hero-invite-code"
            type="text"
            value={inviteCode}
            onChange={(event) => {
              setInviteCode(event.target.value.toUpperCase());
              if (error) setError("");
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="Enter invite code"
            className="h-12 flex-1 rounded-full border border-primary/25 bg-white px-5 font-body text-sm tracking-[0.2em] text-blueberry shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            autoComplete="off"
          />
          <Button type="submit" size="sm" className={`px-7 py-3 ${status === "loading" ? "opacity-75" : ""}`} disabled={status === "loading"}>
            {status === "loading" ? "Verifying…" : "Verify"}
          </Button>
        </form>
        <div className="mt-2 min-h-[1.25rem] text-sm" aria-live="polite">
          {status === "error" && <span className="text-red-400">{error}</span>}
          {status === "success" && <span className="text-primary">Code accepted! Redirecting…</span>}
        </div>
      </section>

      <section className={`mx-auto max-w-[1200px] rounded-[3rem] border border-primary/25 bg-white/95 px-6 py-16 shadow-soft sm:px-10 md:px-16 ${fadeInClass}`}>
        <ConsultationSection />
      </section>

      <HowItWorks />
      <MembershipHighlights />
      <TestimonialsCarousel />
      <FAQAccordion />
      <InviteForm />
    </div>
  );
};

export default Home;
