// src/pages/Home.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { setAuthorized, setMemberName, setDueDate, setMonthsPregnant, originalDueDate, setOriginalDueDate, username, passwordHash } = useAuth();
  const CODE_MAP = {
    // CODE: { name, monthsPregnant, gender }
    Tay123: { name: "Madelyn & Nicholas", monthsPregnant: 8, gender: 'boy' },
    Tay345: { name: "Jordan & Anthony", monthsPregnant: 3, gender: 'girl' },
  };
  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState("idle");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const hash = (s) => {
    try { return btoa(unescape(encodeURIComponent(s))); } catch { return ""; }
  };

  const submitCode = (e) => {
    e.preventDefault();
    const c = code.trim();
    const match = CODE_MAP[c];
    const valid = Boolean(match);
    setCodeStatus(valid ? "valid" : "invalid");
    if (valid) {
      setAuthorized(true);
      setMemberName(match.name);
      setMonthsPregnant(match.monthsPregnant);
      // gender selection handled during profile setup
      // Prefer original due date captured during access request; otherwise compute
      const addMonths = (date, m) => {
        const d = new Date(date.getTime());
        const day = d.getDate();
        d.setMonth(d.getMonth() + m);
        if (d.getDate() < day) d.setDate(0);
        return d;
      };
      let dueISO = originalDueDate;
      if (!dueISO) {
        const monthsToDue = Math.max(0, 9 - match.monthsPregnant);
        const due = addMonths(new Date(), monthsToDue);
        dueISO = due.toISOString();
        setOriginalDueDate(dueISO);
      }
      setDueDate(dueISO);
      setTimeout(() => navigate("/create-profile"), 400);
    }
  };

  // Request Access is handled at /requestaccess

  const submitLogin = (e) => {
    e.preventDefault();
    setLoginErr("");
    if (!username || !passwordHash) {
      setLoginErr("No account found. Use your invite code first, then create a login in Profile.");
      return;
    }
    if (loginUser !== username || hash(loginPass) !== passwordHash) {
      setLoginErr("Invalid username or password.");
      return;
    }
    setAuthorized(true);
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top-right login button */}
      <button
        onClick={() => navigate('/login')}
        className="fixed top-4 right-4 z-20 px-4 py-2 rounded-full border border-gold bg-white text-black shadow hover:shadow-md"
      >
        Log in
      </button>
      
      <Section center tightTop compact>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-6 py-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl mb-6 text-black">
            Taylor-Made <span className="font-cursive text-gold">Baby Planning</span>
          </h1>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            Invite-only services for expecting families. Enter your code or request access below.
          </p>
          {/* Authorization inside hero */}
          <div id="auth" className="mt-8">
            <form onSubmit={submitCode} className="max-w-sm mx-auto space-y-4">
              <div className="rounded-2xl border-2 border-gold/40 bg-white p-4 shadow-sm text-left">
                <label className="block text-black font-medium mb-2">Authorization Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your invite code"
                  className="w-full rounded-xl border-2 border-gold/40 focus:border-gold focus:ring-2 focus:ring-gold px-4 py-3 outline-none bg-white placeholder-black/50 caret-gold"
                />
                <p className="text-xs text-black/60 mt-2">
                  Use the invite code shared with you. Need one? <Link to="/requestaccess" className="underline">Request Code</Link>.
                </p>
                {codeStatus === "invalid" && (
                  <p className="text-xs text-red-600 mt-2">Invalid code. Please try again or request access.</p>
                )}
                {codeStatus === "valid" && (
                  <p className="text-xs text-green-700 mt-2">Code accepted. Redirecting…</p>
                )}
              </div>
              <button type="submit" className="w-full btn btn-primary">Continue</button>
              <Link
                to="/requestaccess"
                className="inline-block text-center w-full px-4 py-3 rounded-lg border-2 border-gold/40 bg-white text-black hover:brightness-95"
              >
                Request Code
              </Link>
            </form>
          </div>
        </motion.div>
      </Section>
      {/* Login moved to /login */}

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
              { title: 'Taylor‑Made Registry', desc: 'Custom registries designed around your lifestyle and values.' },
              { title: 'Taylor‑Made Gear', desc: 'Honest advice on strollers, car seats, and baby gear.' },
              { title: 'Taylor‑Made Nursery', desc: 'From layout to décor — safe, stylish, and functional.' },
              { title: 'Taylor‑Made Showers', desc: 'Planning made simple, from themes to thank‑yous.' },
              { title: 'Taylor‑Made Support', desc: 'I’ll help keep everyone on the same page.' },
            ].map((service, i) => (
              <div key={i} className="p-6 border border-gold/40 rounded-xl shadow bg-white">
                <h3 className="font-serif text-2xl mb-2 text-black">{service.title}</h3>
                <p className="text-black/70">{service.desc}</p>
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
