import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./UI/Button";

const HeroSection = () => {
  const [inviteCode, setInviteCode] = useState("");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mt-16 mb-16 overflow-hidden rounded-bubble bg-white px-5 py-16 shadow-dreamy sm:mt-20 sm:mb-20 sm:px-8 md:mt-28 md:mb-28 md:px-12 md:py-20"
    >

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center text-darkText">
        {/* <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full bg-cream/85 px-5 py-2 font-heading text-xs uppercase tracking-[0.35em] text-darkText/70 shadow-toy"
        >
          Beginnings, curated playfully
        </motion.span> */}

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="font-playful text-4xl sm:text-5xl md:text-6xl"
        >
          Baby Prep, Taylor-Made.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl font-body text-base leading-relaxed text-darkText/80 sm:text-lg"
        >
          An invite-only concierge for millennial and Gen Z families who crave joyful planning without the overwhelm. We craft registries, nursery reveals, and celebrations that feel cozy, custom, and completely you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Button as={Link} to="/contact" variant="purple" size="lg">
            Request Invitation
          </Button>
          <Button as={Link} to="/membership" variant="blue" size="lg">
            Explore Memberships
          </Button>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-full bg-cream/85 p-2 pl-6 pr-2 shadow-toy backdrop-blur"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              placeholder="Enter your private invite code"
              className="w-full rounded-full border-none bg-transparent font-body text-sm text-darkText placeholder:text-darkText/40 focus:outline-none"
            />
            <Button variant="pink" size="sm" className="whitespace-nowrap">
              Verify Code
            </Button>
          </div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default HeroSection;
