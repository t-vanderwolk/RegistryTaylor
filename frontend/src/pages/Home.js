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

import heroBackdrop from "../assets/belly-upclose.jpeg";
import heroPrimary from "../assets/belly-sideview.jpeg";
import heroSecondary from "../assets/ultrasounds.jpeg";
import heroAccent from "../assets/blue-baby.jpeg";
import heroHighlight from "../assets/cozy-baby.jpeg";

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

const heroCollage = [
  {
    src: heroPrimary,
    alt: "Soft side profile of an expecting parent",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: heroSecondary,
    alt: "Ultrasound prints styled atop a linen board",
  },
  {
    src: heroAccent,
    alt: "Peaceful newborn portrait wrapped in gentle blues",
  },
  {
    src: heroHighlight,
    alt: "Cozy newborn moment layered in pastels",
    className: "sm:col-span-2",
  },
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
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="flex flex-col gap-8 text-left">
            <div className="grid gap-4 sm:grid-cols-3">
              {highlightCards.map((item) => (
                <article
                  key={item.title}
                  className="flex h-full flex-col gap-2 rounded-3xl border border-gold/25 bg-white/90 p-5 text-blueberry shadow-soft transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-dreamy"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="font-heading text-lg text-blueberry">{item.title}</h3>
                  <p className="text-sm text-blueberry/75 leading-relaxed">{item.copy}</p>
                </article>
              ))}
            </div>

            <form
              onSubmit={handleVerification}
              className="flex w-full flex-col gap-3 rounded-[3rem] border border-gold/30 bg-white/90 px-5 py-5 shadow-soft backdrop-blur-sm sm:flex-row sm:items-center"
            >
              <label htmlFor="hero-invite-code" className="sr-only">
                Invite code
              </label>
              <input
                id="hero-invite-code"
                type="text"
                value={inviteCode}
                onChange={(event) => {
                  setInviteCode(event.target.value.toUpperCase());
                  if (error) setError("");
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Private invite code"
                className="h-12 flex-1 rounded-full border border-primary/25 bg-white px-5 font-body text-sm tracking-[0.2em] text-blueberry shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="sm"
                className={`px-7 py-3 ${status === "loading" ? "opacity-75" : ""}`}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Verifying…" : "Verify"}
              </Button>
            </form>
            <div className="min-h-[1.25rem] text-sm text-primary" aria-live="polite">
              {status === "error" && <span className="text-red-400">{error}</span>}
              {status === "success" && <span>Code accepted! Redirecting…</span>}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 rounded-[2.75rem] border border-gold/25 bg-gradient-to-r from-white/0 via-softPink/20 to-white/0 px-5 py-5 shadow-soft backdrop-blur-sm lg:justify-start">
              {statHighlights.map((item) => (
                <div key={item.label} className="space-y-1 text-center lg:text-left">
                  <p className="inline-block rounded-full bg-softPink/70 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-blueberry">
                    {item.label}
                  </p>
                  <p className="inline-block rounded-full bg-white/90 px-4 py-1 font-heading text-sm text-blueberry/80">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-2 sm:auto-rows-[200px] lg:auto-rows-[240px]">
            {heroCollage.map(({ src, alt, className }) => (
              <figure
                key={alt}
                className={`overflow-hidden rounded-[2.75rem] border border-white/70 shadow-soft transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-dreamy ${className || ""}`}
              >
                <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </PageHero>

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
