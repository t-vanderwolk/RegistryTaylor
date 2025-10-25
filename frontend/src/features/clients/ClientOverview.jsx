import React from "react";
import { motion } from "framer-motion";
import { useSafeFetch } from "../../hooks/useSafeFetch";

const sectionMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function ClientOverview() {
  const { data } = useSafeFetch(
    "/api/me",
    {},
    { fallback: { user: {}, membership: {} }, requiresAuth: true }
  );

  const firstName = data?.user?.firstName || "Friend";
  const tier = data?.membership?.tier || "CONCIERGE";
  const mentorName = data?.mentor?.name || data?.mentor?.preferred || "Taylor";

  return (
    <motion.section {...sectionMotion} transition={{ duration: 0.35 }} className="space-y-6">
      <div className="rounded-[2.25rem] border border-gold/25 bg-ivory/90 p-6 shadow-soft backdrop-blur-sm sm:p-8">
        <h2 className="font-heading text-2xl text-charcoal sm:text-3xl">
          Hi {firstName} — welcome back ✨
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:items-center">
          <p className="font-body text-sm text-charcoal/70 sm:text-base">
            Your current membership:
            <span className="ml-1 font-semibold text-charcoal">{tier}</span>
          </p>
          <p className="font-body text-sm text-charcoal/70 sm:text-base">
            Concierge lead:
            <span className="ml-1 font-medium text-charcoal">{mentorName}</span>
          </p>
        </div>
      </div>
    </motion.section>
  );
}
