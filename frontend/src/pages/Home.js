import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HowItWorks from "../components/HowItWorks";
import FAQAccordion from "../components/FAQAccordion";
import MembershipHighlights from "../components/MembershipHighlights";
import BlogHighlight from "../components/BlogHighlight";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import InviteForm from "../components/InviteForm";
import ConsultationSection from "../components/ConsultationSection";
import heroImage from "../assets/baby-hands.jpeg";
import api from "../lib/api";

const Home = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleVerification = async (event) => {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();

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
      setCode("");

      navigate("/create-profile", {
        state: {
          inviteCode: invite.code,
          role: invite.role,
          invitedEmail: invite.assigned_email || "",
          inviteInfo: invite,
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        "That invite code was not found. Please confirm with Taylor.";
      setError(message);
      setStatus("error");
    }
  };

  return (
    <div className="relative space-y-16 pb-24 sm:space-y-20">
      <section className="relative isolate flex min-h-[70vh] w-full items-start overflow-hidden rounded-b-[3.5rem] bg-softBeige/40 pt-16 pb-10 shadow-soft sm:pt-20 sm:pb-14 md:pt-24 md:pb-16">
        <img
          src={heroImage}
          alt="Tender moment of a parent holding their baby's hands"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/65" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pt-4 pb-14 text-center motion-safe:animate-fade-in-up sm:gap-8 sm:px-10 sm:pt-6 sm:pb-16 md:pt-10 md:pb-20">
          <span className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">
            From registry dreams to nursery reveals
          </span>
          <h1 className="flex flex-col items-center gap-1 text-4xl text-gray-900 sm:text-5xl md:text-6xl">
            <span className="font-cursive text-5xl text-primary drop-shadow-sm sm:text-6xl md:text-7xl">
              Taylor-Made
            </span>
            <span className="font-serif uppercase tracking-[0.32em] text-sm text-gray-900 sm:text-base md:text-lg">
              Baby Co.
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            From registry to nursery — thoughtfully tailored for your growing family. Let Taylor choreograph the details so you can savor every gentle milestone.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-soft transition duration-200 ease-out hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Book Your Consultation
          </a>
          <form
            onSubmit={handleVerification}
            className="mt-6 flex w-full max-w-xl flex-col gap-3 rounded-full border border-primary/30 bg-white/92 px-5 py-4 shadow-soft backdrop-blur-sm sm:flex-row"
          >
            <label htmlFor="hero-invite-code" className="sr-only">
              Invite code
            </label>
            <input
              id="hero-invite-code"
              type="text"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase());
                if (status !== "idle") setStatus("idle");
                if (error) setError("");
              }}
              placeholder="Private invite code"
              className="h-12 flex-1 rounded-full border border-primary/25 bg-white px-5 font-body text-sm tracking-[0.18em] text-neutral-700 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoComplete="off"
            />
            <button
              type="submit"
              className="h-12 w-full rounded-full bg-primary px-6 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
            >
              {status === "loading" ? "Verifying…" : "Verify"}
            </button>
          </form>
          <div className="min-h-[1.25rem] text-sm text-primary" aria-live="polite">
            {status === "error" && <span className="text-red-400">{error}</span>}
            {status === "success" && <span>Code accepted! Redirecting…</span>}
          </div>
        </div>
      </section>
      <HowItWorks />
      <section className="mx-auto max-w-5xl surface-panel bg-softMint/30 motion-safe:animate-fade-in-up" aria-labelledby="booking-heading">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">Concierge Calendar</p>
          <h2 id="booking-heading" className="mt-3 text-3xl font-serif font-heading text-blueberry">
            Book a Direct Consultation
          </h2>
          <p className="mt-3 text-sm text-neutral-600">
            Choose a time that fits your schedule and Taylor will meet you for a pastel-perfect planning session.
          </p>
        </div>
        <div className="mt-8 overflow-hidden surface-card bg-softBeige/60 shadow-inner">
          <ConsultationSection />
        </div>
      </section>
      <FAQAccordion />
      <MembershipHighlights />
      <BlogHighlight />
      <TestimonialsCarousel />
      <InviteForm />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center sm:hidden">
        <div className="pointer-events-auto mx-auto mb-6 w-[calc(100%-2.5rem)] rounded-full border border-babyBlue/30 bg-white/95 p-3 shadow-soft backdrop-blur">
          <a
            href="#request-invite"
            className="block w-full rounded-full border border-babyBlue/30 bg-white px-6 py-3 text-center text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-1 hover:scale-[1.02] hover:bg-babyPink/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
          >
            Request Invite
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
