'use client';

import { motion } from "framer-motion";

type WelcomeHeaderProps = {
  firstName: string;
  membershipTier: string;
  mentorName: string;
};

export default function WelcomeHeader({
  firstName,
  membershipTier,
  mentorName,
}: WelcomeHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="overflow-hidden rounded-[2.75rem] bg-gradient-to-r from-[#EAC9D1] to-[#C8A1B4] p-10 text-[#3E2F35] shadow-[0_40px_80px_rgba(200,161,180,0.22)]"
    >
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.38em] text-[#3E2F35]/75">
          Signature Taylor-Made Member
        </p>
        <h1 className="text-3xl font-[var(--font-playfair)] leading-tight sm:text-4xl">
          Hi <span className="font-[var(--font-playfair)]">{firstName}</span>{" "}
          <span className="ml-2 text-4xl font-[var(--font-greatvibes)] text-white/90">
            welcome back ✨
          </span>
        </h1>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-[1.75rem] bg-white/40 px-5 py-4 shadow-[0_18px_35px_rgba(200,161,180,0.25)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/70">Membership</p>
            <p className="mt-2 font-[var(--font-playfair)] text-lg">{membershipTier}</p>
          </div>
          <div className="rounded-[1.75rem] bg-white/30 px-5 py-4 shadow-[0_18px_35px_rgba(200,161,180,0.25)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/70">Your Concierge</p>
            <p className="mt-2 font-[var(--font-playfair)] text-lg">{mentorName}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
