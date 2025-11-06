import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroPrimary from "../assets/belly-sideview.jpeg";
import heroSecondary from "../assets/ultrasound-pics.jpeg";
import heroAccent from "../assets/blue-baby.jpeg";
import heroHighlight from "../assets/cozy-baby.jpeg";
import api from "../lib/api";
<<<<<<< HEAD
import Button from "./ui/Button";
import ResponsiveContainer from "./ui/ResponsiveContainer";
=======
import Button from "./UI/Button";
import ResponsiveContainer from "./UI/ResponsiveContainer";
>>>>>>> heroku/main

const highlightCards = [
  {
    title: "Registry Suites",
    copy: "Curated essentials, gentle timelines, and gifting etiquette tailored to your circle.",
  },
  {
    title: "Nursery Editorials",
    copy: "Layouts, palettes, and styling days that turn inspiration into a calming retreat.",
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const message = useMemo(() => {
    if (status === "error") return error;
    if (status === "success")
      return "Invite accepted — we can’t wait to welcome you inside.";
    return "";
  }, [status, error]);

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
      const messageText =
        err.response?.data?.error?.message ||
        err.message ||
        "That invite code was not found. Please confirm with Taylor.";
      setError(messageText);
      setStatus("error");
    }
  };

  return (
    <section
      id="home"
<<<<<<< HEAD
      className="relative isolate overflow-hidden rounded-b-[3.25rem] bg-gradient-to-br from-blush/70 via-ivory to-mauve/55 text-charcoal"
    >
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-blush/40 blur-3xl"
=======
      className="relative isolate overflow-hidden rounded-b-[3.25rem] bg-gradient-to-br from-babyPink/70 via-cream to-softMint/55 text-blueberry"
    >
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-babyPink/40 blur-3xl"
>>>>>>> heroku/main
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-36 top-6 h-72 w-72 rounded-full bg-mauve/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-gold/25 blur-3xl"
        aria-hidden="true"
      />

      <ResponsiveContainer padded className="pt-20 pb-24 sm:pt-24 lg:pt-28">
        <div className="relative grid gap-14 text-center lg:grid-cols-[1.15fr,0.9fr] lg:items-center lg:text-left">
          <motion.div
            className="flex flex-col gap-10"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-5">
<<<<<<< HEAD
              <span className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-mauve/40 bg-ivory/90 px-4 py-2 text-[0.7rem] font-heading uppercase tracking-[0.4em] text-mauve/90 shadow-soft sm:max-w-sm sm:px-6">
                Invite-only baby planning concierge
              </span>
              <div className="space-y-3">
                <p className="font-script text-6xl leading-none text-charcoal drop-shadow-[0_18px_28px_rgba(62,58,71,0.28)] sm:text-7xl">
                  Taylor-Made
                </p>
                <h1 className="text-4xl font-heading leading-tight text-charcoal sm:text-5xl md:text-6xl">
                  Baby Co.
                </h1>
                <div className="mx-auto h-1 w-14 rounded-full bg-gold/70 lg:mx-0" aria-hidden="true" />
                <p className="mx-auto max-w-2xl font-body text-base leading-relaxed text-charcoal/80 sm:text-lg lg:mx-0">
=======
              <span className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-mauve/40 bg-cream/90 px-4 py-2 text-[0.7rem] font-heading uppercase tracking-[0.4em] text-mauve/90 shadow-soft sm:max-w-sm sm:px-6">
                Invite-only baby planning concierge
              </span>
              <div className="space-y-3">
                <p className="font-script text-6xl leading-none text-blueberry drop-shadow-[0_18px_28px_rgba(62,58,71,0.28)] sm:text-7xl">
                  Taylor-Made
                </p>
                <h1 className="text-4xl font-heading leading-tight text-blueberry sm:text-5xl md:text-6xl">
                  Baby Co.
                </h1>
                <div className="mx-auto h-1 w-14 rounded-full bg-gold/70 lg:mx-0" aria-hidden="true" />
                <p className="mx-auto max-w-2xl font-body text-base leading-relaxed text-darkText/80 sm:text-lg lg:mx-0">
>>>>>>> heroku/main
                  Because parenthood should start with confidence, not confusion. We curate registry suites,
                  design nurseries, and coordinate celebrations with a concierge touch.
                </p>
              </div>
            </div>

            <div className="grid w-full gap-4 text-left sm:grid-cols-3">
              {highlightCards.map((item) => (
                <article
                  key={item.title}
<<<<<<< HEAD
                  className="group h-full rounded-[1.85rem] border border-gold/25 bg-ivory/90 p-5 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-dreamy sm:text-left"
=======
                  className="group h-full rounded-[1.85rem] border border-gold/25 bg-cream/90 p-5 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-dreamy sm:text-left"
>>>>>>> heroku/main
                >
                  <p className="font-heading text-[0.7rem] uppercase tracking-[0.35em] text-mauve/80">
                    {item.title}
                  </p>
<<<<<<< HEAD
                  <p className="mt-3 font-body text-sm leading-relaxed text-charcoal/70">{item.copy}</p>
                  <span
                    className="mt-4 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-charcoal/55"
=======
                  <p className="mt-3 font-body text-sm leading-relaxed text-darkText/70">{item.copy}</p>
                  <span
                    className="mt-4 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-blueberry/55"
>>>>>>> heroku/main
                    aria-hidden="true"
                  >
                    Gentle guidance
                    <span className="inline-block h-1 w-6 rounded-full bg-gold/75" />
                  </span>
                </article>
              ))}
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Button as="a" href="#request-invite" variant="gold" size="md" className="w-full sm:w-auto">
                Request Invite
              </Button>
              <Button as={Link} to="/membership" variant="outline" size="md" className="w-full sm:w-auto">
                Explore Memberships
              </Button>
            </div>

            <motion.form
              onSubmit={handleVerification}
              className="flex w-full max-w-2xl flex-col gap-3 self-center rounded-full border border-mauve/35 bg-white/95 px-5 py-4 text-center shadow-soft backdrop-blur md:flex-row md:items-center lg:self-start"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.1 }}
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
                  if (status !== "idle") {
                    setStatus("idle");
                    setError("");
                  }
                }}
                placeholder="Private invite code"
<<<<<<< HEAD
                className="min-h-[48px] flex-1 rounded-full border border-mauve/35 bg-ivory px-5 font-body text-sm tracking-[0.18em] text-charcoal shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/30"
=======
                className="min-h-[48px] flex-1 rounded-full border border-mauve/35 bg-cream px-5 font-body text-sm tracking-[0.18em] text-blueberry shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/30"
>>>>>>> heroku/main
                autoComplete="off"
                inputMode="text"
              />
              <Button
                type="submit"
                variant="mauve"
                size="md"
                className="w-full md:w-auto"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Verifying…" : "Verify Code"}
              </Button>
            </motion.form>
<<<<<<< HEAD
            <div className="min-h-[1.25rem] font-body text-sm text-charcoal" aria-live="polite">
              {message && (
                <span className={status === "error" ? "text-rose-500" : "text-charcoal/80"}>{message}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 rounded-full border border-gold/25 bg-gradient-to-r from-white/0 via-blush/25 to-white/5 px-6 py-5 text-center shadow-soft backdrop-blur lg:justify-start">
              {statHighlights.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="inline-flex rounded-full bg-blush/60 px-4 py-1 text-[0.62rem] font-heading uppercase tracking-[0.32em] text-charcoal">
                    {item.label}
                  </p>
                  <p className="inline-flex rounded-full bg-white/80 px-4 py-1 font-body text-sm text-charcoal/80">
=======
            <div className="min-h-[1.25rem] font-body text-sm text-blueberry" aria-live="polite">
              {message && (
                <span className={status === "error" ? "text-rose-500" : "text-blueberry/80"}>{message}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 rounded-full border border-gold/25 bg-gradient-to-r from-white/0 via-babyPink/25 to-white/5 px-6 py-5 text-center shadow-soft backdrop-blur lg:justify-start">
              {statHighlights.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="inline-flex rounded-full bg-babyPink/60 px-4 py-1 text-[0.62rem] font-heading uppercase tracking-[0.32em] text-blueberry">
                    {item.label}
                  </p>
                  <p className="inline-flex rounded-full bg-white/80 px-4 py-1 font-body text-sm text-darkText/80">
>>>>>>> heroku/main
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid w-full gap-4 sm:auto-rows-[220px] sm:grid-cols-2 lg:auto-rows-[240px]"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            {heroCollage.map((item) => (
              <figure
                key={item.alt}
                className={`group relative overflow-hidden rounded-[2.5rem] border border-gold/25 bg-white/85 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-dreamy ${item.className || ""}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                />
                <div
<<<<<<< HEAD
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blush/20 via-transparent to-mauve/22 opacity-0 transition group-hover:opacity-75"
=======
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-babyPink/20 via-transparent to-blueberry/22 opacity-0 transition group-hover:opacity-75"
>>>>>>> heroku/main
                  aria-hidden="true"
                />
              </figure>
            ))}
          </motion.div>
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default Hero;
