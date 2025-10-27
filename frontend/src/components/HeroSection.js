import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./ui/Button";

const HeroSection = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mt-16 mb-16 overflow-hidden rounded-bubble 
                 bg-gradient-to-b from-ivory via-white to-blush/10 
                 px-5 py-16 shadow-dreamy 
                 sm:mt-20 sm:mb-20 sm:px-8 
                 md:mt-28 md:mb-28 md:px-12 md:py-20"
    >
      {/* Decorative floating elements */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.25, y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-12 left-8 h-16 w-16 rounded-full bg-mauve/20 blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.25, y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute bottom-12 right-12 h-20 w-20 rounded-full bg-mauve/20 blur-2xl"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center text-charcoal">
        
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="font-playful text-4xl sm:text-5xl md:text-6xl"
        >
          Baby Prep,{" "}
          <span className="text-transparent bg-gradient-to-r from-blush to-mauve bg-clip-text">
            Taylor-Made
          </span>
          .
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl font-body text-base leading-relaxed text-charcoal/70 sm:text-lg"
        >
          An invite-only concierge for modern families who crave joyful planning without the overwhelm. 
          From registries to nursery reveals, everything we do is{" "}
          <span className="italic text-charcoal">bespoke, cozy, and completely you</span>.
        </motion.p>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Button as={Link} to="/contact" variant="pink" size="lg" className="rounded-full shadow-toy hover:shadow-lg">
            Request Invitation
          </Button>
          <Button as={Link} to="/membership" variant="purple" size="lg" className="rounded-full shadow-toy hover:shadow-lg">
            Explore Memberships
          </Button>
        </motion.div>

        {/* Invite Code Form */}
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-full bg-blush/10 p-2 pl-6 pr-2 shadow-inner backdrop-blur-md"
          onSubmit={(event) => {
            event.preventDefault();
            const code = inviteCode.trim();
            if (!code) {
              setError("Enter your invite code to continue.");
              return;
            }

            if (code !== "123") {
              setError("We couldn't find that invite. Please confirm with Taylor.");
              return;
            }

            setError("");
            navigate("/create-profile", {
              state: { inviteCode: code, role: "client" },
            });
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-charcoal/40">💌</span>
            <input
              type="text"
              value={inviteCode}
              onChange={(event) => {
                setInviteCode(event.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your private invite code"
              className="w-full rounded-full border-none bg-transparent font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none"
            />
            <Button type="submit" variant="pink" size="sm" className="whitespace-nowrap rounded-full shadow-toy hover:shadow-md">
              Verify Code
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-center text-xs font-body italic text-mauve">
              {error}
            </p>
          )}
        </motion.form>
      </div>
    </motion.section>
  );
};

export default HeroSection;
