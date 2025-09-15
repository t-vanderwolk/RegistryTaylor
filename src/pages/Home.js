// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Section center tightTop compact>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 bg-gradient-to-br from-white via-amber-50/40 to-white px-6 py-20 text-center shadow-[0_25px_60px_-35px_rgba(212,175,55,0.6)]"
        >
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/20 to-transparent md:block" />
          <motion.h1
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: [0.98, 1.03, 1] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-6 text-center font-serif leading-tight text-gold text-4xl sm:text-5xl tracking-tight"
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="font-cursive text-6xl sm:text-[4.75rem] inline-block mr-3"
            >
              Taylor-Made
            </motion.span>
            <motion.span
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.85,
                    staggerChildren: 0.045,
                  },
                },
              }}
              className="inline-block align-baseline"
            >
              {"Baby Planning".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00a0" : char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h1>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            A calm, confident path to welcoming your little one. Personalized registries, nursery design, shower planning, and ongoing support—tailored to your family.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="btn btn-primary px-8 py-3 text-base tracking-wide"
            >
              Explore Services
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 rounded-full border border-gold/50 bg-white text-black tracking-wide transition hover:border-gold hover:shadow-lg"
            >
              Book a Consultation
            </Link>
          </div>
          <div className="mt-12 grid gap-6 text-left text-black/80 md:grid-cols-3">
            {[ 
              { icon: "🌸", label: "Invite-Only", detail: "A discreet client list curated by referral." },
              { icon: "🤍", label: "White-Glove Concierge", detail: "Taylor personally oversees every decision." },
              { icon: "🔐", label: "Confidential Always", detail: "NDA-backed planning and event management." },
            ].map(({ icon, label, detail }) => (
              <div key={label} className="rounded-2xl border border-gold/30 bg-white/70 px-5 py-4">
                <div className="text-3xl">{icon}</div>
                <p className="mt-3 font-serif text-lg text-black">{label}</p>
                <p className="text-sm text-black/70">{detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Public information sections */}
      <Section title="Introduction" tightTop compact>
        <div className="px-6 py-4 max-w-3xl mx-auto text-black/80 space-y-6">
          <div>
            <h3 className="font-serif text-2xl text-black mb-2">The Problem</h3>
            <p className="leading-relaxed text-lg">
              Preparing for a baby is supposed to feel exciting — but too often it’s overwhelming. Between endless stroller options, registry decisions, nursery planning, family expectations, and shower details, parents are left feeling stressed instead of supported.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-black mb-2">The Solution</h3>
            <p className="leading-relaxed text-lg">
              Taylor-Made Baby Planning takes the pressure off your shoulders. From personalized registries and gear guidance to nursery design, shower planning, and even smoothing family dynamics, I handle the details so you don’t have to.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-black mb-2">The Benefit</h3>
            <p className="leading-relaxed text-lg">
              With my Taylor-Made approach, you’ll feel calm, confident, and fully prepared to welcome your little one. Baby prep becomes simple, stress-free, and even fun — just the way it should be.
            </p>
          </div>
        </div>
      </Section>
      <SectionDivider className="my-4" />

      <Section title="Services Snapshot — Taylor‑Made for You" tightTop compact>
        <div className="px-6 py-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Registry & Gear Concierge",
                desc: "Every list curated, managed, and delivered — you simply approve the final selections.",
                icon: "🗒️",
              },
              {
                title: "Personal Shopping",
                desc: "In-home or virtual consultations, VIP access, and white-glove delivery for every must-have.",
                icon: "🛍️",
              },
              {
                title: "Nursery & Home Design",
                desc: "Furniture, safety, and styling planned with your design team for a seamless reveal.",
                icon: "🛏️",
              },
              {
                title: "Events & Celebrations",
                desc: "Baby showers, sip-and-sees, and bespoke gifting handled with total discretion.",
                icon: "🥂",
              },
              {
                title: "Family Integration",
                desc: "Support for siblings, pets, and family dynamics so everyone feels considered.",
                icon: "👨‍👩‍👧‍👦",
              },
              {
                title: "Ongoing Concierge",
                desc: "Fourth-trimester coaching, vetted experts, and beyond-baby planning on standby.",
                icon: "⏳",
              },
            ].map((service) => (
              <div key={service.title} className="rounded-3xl border border-gold/40 bg-white/80 px-6 py-7 shadow-sm backdrop-blur">
                <div className="text-4xl">{service.icon}</div>
                <h3 className="mt-4 font-serif text-2xl text-black">{service.title}</h3>
                <p className="mt-2 text-sm text-black/70 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <SectionDivider className="my-4" />

      <Section title="Testimonials" center tightTop compact>
        <div className="px-6 py-4 max-w-2xl mx-auto space-y-6 text-black/80">
          <blockquote className="italic border-l-4 border-gold pl-4">
            “Taylor made our registry feel effortless — no stress, no second‑guessing.” — Jenna M.
          </blockquote>
          <blockquote className="italic border-l-4 border-gold pl-4">
            “She helped us choose a stroller that truly works for our lifestyle. Game‑changer!” — Rachel & Matt K.
          </blockquote>
        </div>
      </Section>
      <SectionDivider className="my-4" />

      <Section title="How Taylor‑Made Baby Planning Works" tightTop compact>
        <div className="px-6 py-6 max-w-5xl mx-auto text-black/80 space-y-6">
          <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                step: "1. Private Invite",
                body: "Membership is invite-only. Once selected, choose the package that fits best: Essentials, Signature, or Bespoke.",
              },
              {
                step: "2. Confidential Agreement",
                body: "Every member signs an NDA so all details — from registry picks to family dynamics — remain private.",
              },
              {
                step: "3. Concierge Consultation",
                body: "We begin with a deep-dive consultation, in-home or virtual, to understand your style, lifestyle, and priorities.",
              },
              {
                step: "4. Curated Planning",
                body: "Taylor handles everything — registry building, gear shopping, nursery design, family prep, and event planning based on your package. You simply approve final selections.",
              },
              {
                step: "5. Add-On Flexibility",
                body: "Need more? Add shower planning, extended nursery styling, or postpartum support at member rates.",
              },
              {
                step: "6. Ongoing Access",
                body: "Stay connected through the Taylor-Made Blog and Mom Mentor Circle for advice, insider tips, and peer support. You may even be invited to mentor others.",
              },
              {
                step: "7. Always Discreet",
                body: "From beginning to end, the experience is confidential, stress-free, and fully tailored to you.",
              },
            ].map(({ step, body }) => (
              <li key={step} className="relative overflow-hidden rounded-3xl border border-gold/30 bg-white/85 px-6 py-6 shadow-sm">
                <span className="absolute -top-10 -right-10 h-24 w-24 rounded-full border border-gold/40 bg-amber-50/50" />
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold bg-white font-serif text-lg text-gold">
                    {step.split(".")[0]}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-black">{step.split(". ")[1] || step}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/70">{body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <SectionDivider className="my-4" />

      <Section title="Taylor‑Made Membership Perks" tightTop compact>
        <div className="px-6 py-6 max-w-4xl mx-auto text-black/80 space-y-6">
          <p className="text-lg text-black/70">
            Every package unlocks access to an exclusive community experience. Membership is more than support — it’s a private circle curated for families who value discretion, insider insight, and shared wisdom.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Taylor-Made Blog",
                points: [
                  "Private resource hub with curated comparisons, design tips, travel guides, and family dynamic strategies.",
                  "Insider updates on product launches, recalls, and luxury brand drops.",
                  "Seasonal checklists for hospital, holidays, and toddler transitions.",
                ],
                icon: "📒",
              },
              {
                title: "Taylor-Made Mentors",
                points: [
                  "Invitation-only circle of mothers offering lived wisdom and encouragement.",
                  "Personal matching with a mentor who mirrors your lifestyle.",
                  "Opportunities to step into mentorship and extend the legacy of support.",
                ],
                icon: "🤝",
              },
            ].map((perk) => (
              <div key={perk.title} className="rounded-3xl border border-gold/40 bg-white/80 px-6 py-7 shadow-sm">
                <div className="text-4xl">{perk.icon}</div>
                <h3 className="mt-4 font-serif text-2xl text-black">{perk.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-black/70">
                  {perk.points.map((point, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-gold">◆</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-gold/40 bg-white/90 px-6 py-6 text-left shadow-sm">
            <div className="text-3xl">🔐</div>
            <h3 className="mt-3 font-serif text-xl text-black">Membership Promise</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70">
              Every member is welcomed under strict confidentiality agreements and NDAs. Consultations, registries, and events are managed with private oversight so membership always feels like stepping into an exclusive club — never just an add-on service.
            </p>
          </div>
        </div>
      </Section>

      <Section title="About Me" tightTop compact>
        <div className="px-6 py-4 max-w-3xl mx-auto text-black/80">
          <p className="max-w-2xl">
            Hi, I’m Taylor! Think of me as your go‑to guide (and maybe your new
            best friend) for all things baby prep. I’ve spent years helping
            families navigate the overwhelming world of strollers, car seats,
            nurseries, and registries.
          </p>
          <p className="mt-6 max-w-2xl">
            Now, I bring that experience to you in a warm, personalized way
            that takes away the stress and leaves you excited, prepared, and
            confident.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default Home;
