import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroPrimary from "../assets/belly-sideview.jpeg";
import heroSecondary from "../assets/ultrasound-pics.jpeg";
import heroAccent from "../assets/blue-baby.jpeg";
import heroHighlight from "../assets/cozy-baby.jpeg";
import api from "../lib/api";

const highlightCards = [
  {
    title: "Registry Suites",
    copy: "Curated lists, gentle timelines, and gifting tips shaped for your circle of loved ones.",
  },
  {
    title: "Nursery Editorials",
    copy: "Layouts, paint palettes, and styling days that turn inspiration into a lived-in retreat.",
  },
  {
    title: "Celebration Concierge",
    copy: "Showers, sip & sees, and welcome-home moments coordinated from RSVP to final bow.",
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
    alt: "Softly lit side profile of an expecting parent",
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
      className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-[4rem] border border-babyPink/35 bg-gradient-to-br from-babyPink/18 via-white/95 to-softBeige/70 px-6 py-14 text-midnight shadow-dreamy backdrop-blur-2xl sm:px-9 md:px-16 md:py-18"
    >
      <div className="pointer-events-none absolute inset-y-0 -left-16 h-full w-72 rounded-full bg-babyPink/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-24 right-10 h-80 w-80 rounded-full bg-babyBlue/20 blur-3xl" aria-hidden="true" />

      <div className="relative grid gap-12 text-center lg:grid-cols-[1.15fr,0.9fr] lg:items-center lg:text-left">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center gap-3 rounded-full border border-babyPink/45 bg-white/90 px-6 py-2 text-[0.7rem] font-heading uppercase tracking-[0.45em] text-blueberry shadow-soft backdrop-blur-sm">
              Invite-only baby planning concierge
            </div>

            <span className="block font-script text-6xl leading-none text-blueberry drop-shadow-[0_18px_24px_rgba(91,81,98,0.28)] sm:text-7xl lg:text-center">
              Taylor-Made
            </span>
            <h1 className="text-3xl font-heading leading-tight text-blueberry sm:text-4xl md:text-5xl lg:mx-auto lg:text-center">
              Baby Co.
            </h1>
            <span className="gold-divider" aria-hidden="true" />
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-midnight/85 sm:text-lg lg:mx-0">
              Welcome to your calm corner of baby prep. Taylor choreographs registries, nursery styling, and celebration planning so every reveal feels gentle, personal, and joyfully ready.
            </p>
          </div>

          <div className="grid w-full gap-4 text-left sm:grid-cols-3">
            {highlightCards.map((item) => (
              <article
                key={item.title}
                className="h-full rounded-[2.25rem] border border-babyPink/40 bg-white/95 p-5 text-center shadow-soft backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-dreamy lg:text-left"
              >
                <p className="text-xs font-heading uppercase tracking-[0.35em] text-blueberry/70">{item.title}</p>
                <p className="mt-3 text-sm text-midnight/75">{item.copy}</p>
              </article>
            ))}
          </div>

          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#request-invite"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-babyPink px-10 py-3 text-sm font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:bg-babyPink/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyPink/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
            >
              Request Invite
            </a>
            <Link
              to="/membership"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-babyPink/40 bg-white/95 px-10 py-3 text-sm font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-babyPink/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
            >
              Explore Memberships
            </Link>
          </div>

          <form
            onSubmit={handleVerification}
            className="flex w-full max-w-2xl flex-col gap-3 self-center rounded-[3.5rem] border border-babyPink/35 bg-white/92 px-5 py-4 text-center shadow-soft backdrop-blur-sm sm:flex-row sm:items-center lg:self-start"
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
              placeholder="Private invite code"
              className="h-12 flex-1 rounded-full border border-babyPink/35 bg-white px-5 font-body text-sm tracking-[0.18em] text-blueberry shadow-inner focus:border-babyPink focus:outline-none focus:ring-2 focus:ring-babyPink/30"
              autoComplete="off"
            />
            <button
              type="submit"
              className="h-12 w-full rounded-full border border-babyPink/40 bg-white px-6 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-babyPink/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyPink/50 sm:w-auto"
            >
              {status === "loading" ? "Verifying…" : "Verify Code"}
            </button>
          </form>
          <div className="min-h-[1rem] text-sm text-blueberry" aria-live="polite">
            {status === "error" && <span className="text-red-400">{error}</span>}
            {status === "success" && <span className="text-blueberry">Code accepted! Redirecting…</span>}
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-5 rounded-[2.75rem] border border-babyPink/35 bg-gradient-to-r from-white/0 via-babyPink/18 to-white/0 px-5 py-5 text-center shadow-soft backdrop-blur-sm lg:justify-start">
            {statHighlights.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="inline-block rounded-full bg-babyPink/65 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-midnight">
                  {item.label}
                </p>
                <p className="inline-block rounded-full bg-white/80 px-4 py-1 font-babyco text-sm text-midnight">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 sm:auto-rows-[200px] lg:auto-rows-[240px] lg:text-left">
          {heroCollage.map((item) => (
            <figure
              key={item.alt}
              className={`overflow-hidden rounded-[2.75rem] border border-babyPink/35 bg-white/90 shadow-soft backdrop-blur-sm transition duration-500 hover:shadow-dreamy ${
                item.className || ""
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                loading="lazy"
              />
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
