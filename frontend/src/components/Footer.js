import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16 bg-white/90 text-cozyGray border-t border-softGold/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 text-deepSlate">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-softGold/60 bg-white text-sm font-semibold tracking-[0.3em]">
              TM
            </span>
            <div className="leading-tight">
              <p className="font-cursive text-2xl">Taylor-Made</p>
              <p className="text-[0.7rem] uppercase tracking-[0.35em]">Baby Planning</p>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-cozyGray/75">
            Invite-only concierge support for modern families — discreet registries, curated add-ons, and a trusted mentor circle.
          </p>
        </div>
        <div className="space-y-4 text-sm text-cozyGray/75">
          <h3 className="font-serif text-lg text-deepSlate">NDA & Privacy Commitment</h3>
          <p>
            Every relationship begins with a mutual NDA. Your registry, events, and family details remain confidential and personally overseen by Taylor.
          </p>
          <div className="space-y-1">
            <p className="uppercase tracking-[0.25em] text-[0.65rem] text-deepSlate/70">Concierge Contact</p>
            <a href="mailto:concierge@taylormadebaby.com" className="block text-deepSlate hover:text-softGold">
              concierge@taylormadebaby.com
            </a>
            <a href="tel:+14805551234" className="block text-deepSlate hover:text-softGold">
              +1 (480) 555-1234
            </a>
          </div>
        </div>
        <div className="space-y-4 text-sm text-cozyGray/75">
          <h3 className="font-serif text-lg text-deepSlate">Stay Connected</h3>
          <div className="flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-deepSlate/70">
            <a href="https://instagram.com" className="rounded-full border border-softGold/40 px-4 py-2 hover:bg-softGold/20" aria-label="Private Instagram">
              Private IG
            </a>
            <a href="https://linkedin.com" className="rounded-full border border-softGold/40 px-4 py-2 hover:bg-softGold/20" aria-label="LinkedIn">
              LinkedIn
            </a>
          </div>
          <div className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-deepSlate/60">
            <Link to="/membership" className="hover:text-softGold">
              Membership
            </Link>
            <Link to="/add-ons" className="hover:text-softGold">
              Add-Ons
            </Link>
            <Link to="/blog" className="hover:text-softGold">
              Journal
            </Link>
            <Link to="/contact" className="hover:text-softGold">
              Request Invite
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-softGold/20 px-6 py-6 text-center text-[0.65rem] uppercase tracking-[0.3em] text-cozyGray/60">
        © {new Date().getFullYear()} Taylor-Made Baby Planning. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
