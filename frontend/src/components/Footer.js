import React from "react";
import { Link } from "react-router-dom";

const FOOTER_BLOCKS = [
  {
    letter: "T",
    classes: "bg-babyBlue",
    style: {
      "--stack-shift": "-4px",
      "--stack-tilt": "1.8deg",
      "--drop-delay": "0.15s",
      "--wobble-delay": "1.2s",
    },
  },
  {
    letter: "M",
    classes: "bg-babyPink",
    style: {
      "--stack-shift": "6px",
      "--stack-tilt": "-2deg",
      "--drop-delay": "0.35s",
      "--wobble-delay": "1.45s",
    },
  },
  {
    letter: "C",
    classes: "bg-pastelPurple",
    style: {
      "--stack-shift": "-3px",
      "--stack-tilt": "2.4deg",
      "--drop-delay": "0.55s",
      "--wobble-delay": "1.7s",
    },
  },
  {
    letter: "O",
    classes: "bg-sunshine",
    style: {
      "--stack-shift": "5px",
      "--stack-tilt": "-1.6deg",
      "--drop-delay": "0.75s",
      "--wobble-delay": "1.95s",
    },
  },
];

const Footer = () => {
  return (
    <footer className="mt-20 bg-gradient-to-br from-babyBlue/35 via-cream to-babyPink/35 text-darkText border-t border-babyPink/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-4 text-blueberry">
            <div className="footer-stack flex items-end gap-0">
              {FOOTER_BLOCKS.map(({ letter, classes, style }) => (
                <span
                  key={letter}
                  className={`stack-block inline-flex h-12 w-12 items-center justify-center font-heading text-xl uppercase text-cream ${classes}`}
                  style={style}
                  data-letter={letter}
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className="leading-tight">
              <p className="font-playful text-xl">Taylor-Made Baby Co.</p>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-darkText/60 font-heading">Playful planning for joyful families</p>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-darkText/70 font-body">
            Invite-only concierge support for modern families—tailored registries, couture nurseries, and discreet event orchestration.
          </p>
        </div>
        <div className="space-y-4 text-sm text-darkText/75 font-body">
          <h3 className="font-playful text-lg text-blueberry">Concierge Contact</h3>
          <p>
            Membership begins with discretion. Share a note and we’ll arrange a private consultation.
          </p>
          <div className="space-y-1">
            <p className="uppercase tracking-[0.25em] text-[0.65rem] text-darkText/60 font-heading">Concierge Contact</p>
            <a href="mailto:RegistryWihTaylor@gmail.com" className="block text-blueberry hover:text-pastelPurple">
              RegistryWihTaylor@gmail.com
            </a>
            <a href="tel:+14805551234" className="block text-blueberry hover:text-pastelPurple">
              +1 (480) 555-1234
            </a>
          </div>
        </div>
        <div className="space-y-4 text-sm text-darkText/75 font-body">
          <h3 className="font-playful text-lg text-blueberry">Stay Connected</h3>
          <div className="flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-blueberry/80">
            <a
              href="https://instagram.com"
              className="rounded-full bg-white/80 px-4 py-2 shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
              aria-label="Private Instagram"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              className="rounded-full bg-white/80 px-4 py-2 shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
          <div className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-blueberry/70">
            <Link to="/membership" className="hover:text-babyPink">
              Membership
            </Link>
            <Link to="/add-ons" className="hover:text-babyPink">
              Add-Ons
            </Link>
            <Link to="/blog" className="hover:text-babyPink">
              Journal
            </Link>
            <Link to="/contact" className="hover:text-babyPink">
              Request Invite
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-babyPink/30 px-6 py-6 text-center text-[0.65rem] uppercase tracking-[0.3em] text-darkText/60 font-heading">
        © {new Date().getFullYear()} Taylor-Made Baby Co. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
