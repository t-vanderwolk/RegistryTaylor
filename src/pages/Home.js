// src/pages/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Section from "../components/UI/Section";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { setAuthorized, setMemberName, setDueDate, setMonthsPregnant, originalDueDate, setOriginalDueDate, gender, setGender, username, passwordHash } = useAuth();
  const CODE_MAP = {
    // CODE: { name, monthsPregnant, gender }
    Tay123: { name: "Madelyn & Nicholas", monthsPregnant: 8, gender: 'boy' },
    Tay345: { name: "Jordan & Anthony", monthsPregnant: 3, gender: 'girl' },
  };
  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState("idle");
  const [showLogin, setShowLogin] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [parent1, setParent1] = useState("");
  const [parent2, setParent2] = useState("");
  const [email, setEmail] = useState("");
  const [due, setDue] = useState("");
  const [message, setMessage] = useState("");
  const [selGender, setSelGender] = useState(gender || "");

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
      if (match.gender) setGender(match.gender);
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
      setTimeout(() => navigate("/welcome"), 600);
    }
  };

  const requestAccess = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("Access Request: Taylor-Made Baby Planning");
    const combinedName = parent2 ? `${parent1} & ${parent2}` : parent1;
    const body = encodeURIComponent(
      `Parent 1: ${parent1}\nParent 2: ${parent2}\nCombined: ${combinedName}\nEmail: ${email}\nDue date: ${due}\nGender: ${selGender || 'unspecified'}\n\nMessage:\n${message}`
    );
    // Persist originally entered due date locally for later correlation
    if (due) {
      try {
        const iso = new Date(due).toISOString();
        setOriginalDueDate(iso);
      } catch {}
    }
    if (selGender) setGender(selGender);
    window.location.href = `mailto:RegistryTaylor@gmail.com?subject=${subject}&body=${body}`;
  };

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
    <div className="bg-accent min-h-screen">
      <Section center>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-6 py-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl mb-6 text-black">
            Taylor-Made <span className="font-cursive text-primary">Baby Planning</span>
          </h1>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            Invite-only services for expecting families. Enter your code or request access below.
          </p>
        </motion.div>
      </Section>

      <Section title="Enter Authorization Code">
        <form onSubmit={submitCode} className="max-w-md mx-auto space-y-4">
          <label className="block text-left text-black font-medium">Authorization Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your invite code"
            className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 outline-none bg-white"
          />
          <button type="submit" className="w-full btn btn-primary">Continue</button>
          <button type="button" onClick={() => setShowLogin((v) => !v)} className="w-full underline text-black/70">
            or log in
          </button>
          {codeStatus === "invalid" && (
            <p className="text-sm text-red-600">Invalid code. Please try again or request access.</p>
          )}
          {codeStatus === "valid" && (
            <p className="text-sm text-green-700">Code accepted. Redirecting…</p>
          )}
        </form>
        {showLogin && (
          <form onSubmit={submitLogin} className="max-w-md mx-auto mt-6 space-y-3 text-left">
            <label className="block text-black font-medium">Username</label>
            <input
              type="text"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
            />
            <label className="block text-black font-medium">Password</label>
            <input
              type="password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
            />
            {loginErr && <p className="text-sm text-red-600">{loginErr}</p>}
            <button type="submit" className="w-full btn btn-primary">Log in</button>
          </form>
        )}
      </Section>

      <Section title="Request Access" center>
        <form onSubmit={requestAccess} className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="col-span-1">
            <label className="block text-black font-medium">Parent 1 Name</label>
            <input
              type="text"
              value={parent1}
              onChange={(e) => setParent1(e.target.value)}
              placeholder="First parent name"
              className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 outline-none bg-white"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-black font-medium">Parent 2 Name (optional)</label>
            <input
              type="text"
              value={parent2}
              onChange={(e) => setParent2(e.target.value)}
              placeholder="Second parent name"
              className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 outline-none bg-white"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-black font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 outline-none bg-white"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Due Date (optional)</label>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 outline-none bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Baby's Gender (optional)</label>
            <select
              value={selGender}
              onChange={(e) => setSelGender(e.target.value)}
              className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
            >
              <option value="">Prefer not to say</option>
              <option value="girl">Girl</option>
              <option value="boy">Boy</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              placeholder="Tell me a bit about your family and needs…"
              className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 outline-none bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full md:w-auto btn btn-primary">Request Access</button>
          </div>
        </form>
      </Section>

      {/* Public information sections */}
      <Section title="Introduction">
        <div className="px-6 py-4 max-w-3xl mx-auto text-black/80">
          <p className="cc-lead font-serif text-xl">
            Preparing for a baby should feel exciting, not overwhelming. At
            <span className="font-serif font-bold"> Taylor-Made Baby Planning</span>, I guide you
            through every step of baby prep — from registries and strollers to
            nursery design, showers, and family dynamics.
          </p>
          <p className="mt-6 text-lg leading-relaxed">
            With my Taylor‑Made approach, you’ll feel supported, confident, and ready to welcome your little one with ease.
          </p>
        </div>
      </Section>

      <Section title="Services Snapshot — Taylor‑Made for You">
        <div className="px-6 py-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[ 
              { title: 'Taylor‑Made Registry', desc: 'Custom registries designed around your lifestyle and values.' },
              { title: 'Taylor‑Made Gear', desc: 'Honest advice on strollers, car seats, and baby gear.' },
              { title: 'Taylor‑Made Nursery', desc: 'From layout to décor — safe, stylish, and functional.' },
              { title: 'Taylor‑Made Showers', desc: 'Planning made simple, from themes to thank‑yous.' },
              { title: 'Taylor‑Made Support', desc: 'I’ll help keep everyone on the same page.' },
            ].map((service, i) => (
              <div key={i} className="p-6 border border-black/20 rounded-xl shadow bg-white">
                <h3 className="font-serif text-2xl mb-2 text-black">{service.title}</h3>
                <p className="text-black/70">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Testimonials" center>
        <div className="px-6 py-4 max-w-2xl mx-auto space-y-6 text-black/80">
          <blockquote className="italic border-l-4 border-primary pl-4">
            “Taylor made our registry feel effortless — no stress, no second‑guessing.” — Jenna M.
          </blockquote>
          <blockquote className="italic border-l-4 border-primary pl-4">
            “She helped us choose a stroller that truly works for our lifestyle. Game‑changer!” — Rachel & Matt K.
          </blockquote>
        </div>
      </Section>

      <Section title="About Me">
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
