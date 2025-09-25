import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroLogo from "../assets/taylor-made-logo.png";
import api from "../lib/api";

const Hero = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleVerification = async (event) => {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      setError("Please enter your invite code.");
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
    <section
      id="home"
      tabIndex="-1"
      className="relative mx-auto mt-10 flex max-w-6xl flex-col-reverse items-center gap-12 overflow-hidden surface-panel px-6 py-16 text-center text-midnight md:mt-16 md:flex-row md:items-stretch md:gap-10 md:px-12 md:text-left"
    >

      <div className="relative z-10 flex w-full flex-col justify-center gap-6 md:w-2/3">
        <p className="inline-flex items-center justify-center self-center rounded-full border border-babyBlue/25 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.4em] text-blueberry/70 shadow-soft md:self-start">
          Invite-only concierge for modern parents
        </p>
        <h1 className="font-heading text-4xl leading-snug text-blueberry sm:text-5xl md:text-6xl">
          Baby Prep, Taylor-Made
        </h1>
        <p className="max-w-2xl font-body text-base leading-relaxed text-midnight/80 sm:text-lg">
          An invite-only concierge for modern parents who crave joyful planning without overwhelm. We orchestrate registries, nurseries, and celebrations with signature pastel charm—and zero guesswork for you.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
          <a
            href="#request-invite"
            className="inline-flex w-full items-center justify-center rounded-full bg-babyPink px-8 py-3 text-sm font-heading uppercase tracking-[0.35em] text-midnight shadow-toy transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:bg-babyBlue/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-softBeige sm:w-auto"
            aria-label="Request an invitation to Taylor-Made Baby Co."
          >
            Request Invite
          </a>
          <Link
            to="/membership"
            className="inline-flex w-full items-center justify-center rounded-full border border-babyBlue/40 bg-white px-8 py-3 text-sm font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:bg-skyMist focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-softBeige sm:w-auto"
          >
            Explore Memberships
          </Link>
        </div>
        <form
          onSubmit={handleVerification}
          className="mt-2 flex flex-col gap-3 rounded-[2.5rem] border border-babyBlue/20 bg-white px-4 py-4 shadow-soft sm:flex-row sm:items-center"
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
              if (error) setError("");
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="Have a code? Enter it here"
            className="h-12 flex-1 rounded-full border border-babyBlue/30 bg-white px-5 font-body text-sm tracking-[0.2em] text-blueberry shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/50"
            autoComplete="off"
          />
          <button
            type="submit"
            className="h-12 rounded-full border border-babyBlue/30 bg-babyPink/60 px-6 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-babyPink focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
          >
            {status === "loading" ? "Verifying…" : "Verify Code"}
          </button>
        </form>
        <div className="min-h-[1rem] text-center text-sm" aria-live="polite">
          {status === "error" && <span className="text-red-400">{error}</span>}
          {status === "success" && <span className="text-blueberry">Code accepted! Redirecting…</span>}
        </div>
        <div className="grid gap-4 text-left sm:grid-cols-3">
          {[
            {
              title: "Discover",
              copy: "Private intake to uncover your family’s vibe, timeline, and registry dreams.",
            },
            {
              title: "Plan",
              copy: "Curated checklists, shoppable boards, and concierge booking handled for you.",
            },
            {
              title: "Celebrate",
              copy: "Reveal-ready nurseries and memorable gatherings, styled to spark delight.",
            },
          ].map((item) => (
            <article
              key={item.title}
            className="rounded-3xl bg-softBeige/70 p-4 text-left shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-dreamy"
            >
              <h2 className="text-lg font-heading text-blueberry">{item.title}</h2>
              <p className="mt-1 text-sm text-midnight/70">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex w-full justify-center md:w-1/3">
        <div className="relative flex h-full w-full max-w-sm items-center justify-center surface-card rounded-[3rem] bg-white p-10">
          <img
            src={heroLogo}
            srcSet={`${heroLogo} 1x, ${heroLogo} 2x`}
            alt="Illustrative Taylor-Made Baby Co. crest"
            className="h-48 w-48 object-contain drop-shadow-lg"
            loading="lazy"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-4 hidden h-32 w-32 rounded-full bg-babyBlue/30 blur-3xl md:block"
        />
      </div>
    </section>
  );
};

export default Hero;
