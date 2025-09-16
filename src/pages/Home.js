import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import { motion } from "framer-motion";
import DueDateCountdown from "../components/DueDateCountdown";

const Home = () => {
  return (
    <div className="min-h-screen bg-transparent font-sans text-cozyGray">
      {/* Hero Section */}
      <Section center tightTop compact>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-bubble bg-white px-5 sm:px-6 py-14 sm:py-16 text-center shadow-dreamy border border-softGold/30"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: [0.98, 1.03, 1] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-4 text-center font-cursive leading-tight text-cozyGray text-3xl sm:text-5xl tracking-tight"
          >
            <motion.span className="font-cursive text-5xl sm:text-[3.8rem] inline-block mr-2 text-deepSlate">
              Taylor-Made
            </motion.span>
            <motion.span className="font-cursive text-softGold">
              Baby Planning
            </motion.span>
          </motion.h1>

          <p className="font-sans text-lg md:text-xl text-cozyGray/80 max-w-2xl mx-auto">
            A calm, confident path to welcoming your little one. Personalized
            registries, nursery design, shower planning, and ongoing
            support—tailored to your family.
          </p>

          {/* <motion.img
            src="/assets/hero-baby.png"
            alt="Baby Planning Illustration"
            className="mx-auto mt-6 w-full max-w-xs sm:max-w-md shadow-soft animate-float"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          /> */}

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/services"
              className="btn-primary text-sm sm:text-base md:text-lg px-7 sm:px-8 py-3"
            >
              Explore Services
            </Link>
            <Link
              to="/contact"
              className="btn-secondary text-sm sm:text-base md:text-lg px-7 sm:px-8 py-3"
            >
              Book a Consultation
            </Link>
          </div>

          <div className="mt-10 grid gap-6 text-left text-cozyGray/80 md:grid-cols-3">
            {[
              { icon: "🍼", label: "Invite-Only", detail: "A discreet client list curated by referral." },
              { icon: "🧸", label: "Concierge Care", detail: "Taylor personally oversees every decision." },
              { icon: "👶", label: "Confidential Always", detail: "NDA-backed planning and event management." },
            ].map(({ icon, label, detail }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="rounded-3xl border border-softGold/25 bg-white px-5 py-4 shadow-soft hover:bg-softGold/10 transition"
              >
                <div className="text-3xl">{icon}</div>
                <p className="mt-3 font-serif text-lg text-deepSlate">{label}</p>
                <p className="text-sm font-sans text-cozyGray/75">{detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Countdown Section */}
      <Section title="Countdown to Baby Day" center className="bg-alt-blue">
        <DueDateCountdown dueDate="2025-12-01" />
      </Section>

      <SectionDivider className="my-6" />

      {/* Services Section */}
      <Section title="Services Snapshot" tightTop compact className="bg-alt-green">
        <div className="px-6 py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Registry Concierge", desc: "Curated lists, managed & delivered.", icon: "🗒️" },
              { title: "Personal Shopping", desc: "VIP access & white-glove delivery.", icon: "🛍️" },
              { title: "Nursery Design", desc: "Safety + styling planned seamlessly.", icon: "🛏️" },
              { title: "Events & Celebrations", desc: "Baby showers, sip-and-sees.", icon: "🥂" },
              { title: "Family Integration", desc: "Support for siblings & pets.", icon: "👨‍👩‍👧‍👦" },
              { title: "Ongoing Concierge", desc: "Postpartum coaching & more.", icon: "⏳" },
            ].map((service, index) => (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={service.title}
                className="rounded-3xl border border-softGold/25 bg-white px-5 py-6 shadow-soft transition hover:-translate-y-1"
              >
                <div className="text-3xl">{service.icon}</div>
                <h3 className="mt-3 font-serif text-xl text-deepSlate">{service.title}</h3>
                <p className="mt-2 text-sm font-sans text-cozyGray/75 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Testimonials */}
      <Section title="Testimonials" center compact className="bg-alt-purple">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-6 max-w-2xl mx-auto space-y-6 text-cozyGray/85"
        >
          <blockquote className="italic border-l-4 border-softGold/60 pl-4 font-sans text-base bg-white rounded-2xl py-3 shadow-soft">
            “Taylor made our registry feel effortless — no stress, no second-guessing.” — Jenna M.
          </blockquote>
          <blockquote className="italic border-l-4 border-softGold/60 pl-4 font-sans text-base bg-white rounded-2xl py-3 shadow-soft">
            “She helped us choose a stroller that truly works for our lifestyle. Game-changer!” — Rachel & Matt K.
          </blockquote>
        </motion.div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Process */}
      <Section title="How It Works" tightTop compact className="bg-alt-pink">
        <div className="px-6 py-6 max-w-5xl mx-auto text-cozyGray/85">
          <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              { step: "1. Invite", body: "Membership is invite-only with tiered packages." },
              { step: "2. Agreement", body: "All members sign an NDA for privacy." },
              { step: "3. Consultation", body: "Deep-dive session to learn your lifestyle." },
              { step: "4. Planning", body: "Taylor handles registry, nursery, events." },
              { step: "5. Add-Ons", body: "Shower planning, extended styling, postpartum." },
              { step: "6. Access", body: "Stay connected via Blog & Mentor Circle." },
              { step: "7. Discreet", body: "Always confidential and stress-free." },
            ].map(({ step, body }, index) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-3xl border border-softGold/25 bg-white px-5 py-5 shadow-soft"
              >
                <h3 className="font-serif text-sm tracking-[0.2em] text-softGold mb-2 uppercase">{step}</h3>
                <p className="font-sans text-sm text-cozyGray/75">{body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Membership */}
      <Section title="Membership Perks" tightTop compact className="bg-alt-green">
        <div className="px-6 py-6 max-w-4xl mx-auto text-cozyGray/85 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Taylor-Made Blog",
                icon: "📒",
                points: ["Curated comparisons & tips.", "Insider product updates.", "Seasonal checklists."],
              },
              {
                title: "Taylor-Made Mentors",
                icon: "🤝",
                points: ["Circle of mothers with lived wisdom.", "Personal mentor matching.", "Opportunities to mentor others."],
              },
            ].map((perk, index) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                className="rounded-3xl border border-softGold/25 bg-white px-5 py-5 shadow-soft"
              >
                <div className="text-3xl">{perk.icon}</div>
                <h3 className="mt-2 font-serif text-lg text-deepSlate">{perk.title}</h3>
                <ul className="mt-2 space-y-1 text-sm font-sans text-cozyGray/75">
                  {perk.points.map((point, i) => (
                    <li key={i} className="flex gap-1">
                      <span className="text-softGold">◆</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* About */}
      <Section title="About Me" tightTop compact className="bg-alt-purple">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-6 max-w-2xl mx-auto text-cozyGray/85"
        >
          <p className="font-sans text-base">
            Hi, I’m Taylor! Think of me as your go-to guide (and maybe your new best friend) for all things baby prep...
          </p>
          <p className="mt-4 font-sans text-base">
            Now, I bring that experience to you in a warm, personalized way that takes away the stress and leaves you excited, prepared, and confident.
          </p>
        </motion.div>
      </Section>
    </div>
  );
};

export default Home;
