// src/pages/PrivateHome.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const PrivateHome = () => {
  const { memberName, dueDate, monthsPregnant, setDueDate, originalDueDate, setMemberName, gender, babyName, setBabyName, username, setUsername, setPasswordHash } = useAuth();
  const [profileMsg, setProfileMsg] = useState("");
  const due = dueDate ? new Date(dueDate) : null;
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = due ? Math.max(0, Math.ceil((due.getTime() - now.getTime()) / msPerDay)) : null;

  const formatDate = (d) =>
    d?.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const buildCalendar = (date) => {
    if (!date) return [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };
  const cal = buildCalendar(due);

  const weeksLeft = daysLeft != null ? Math.ceil(daysLeft / 7) : null;
  const weeksPregnant = weeksLeft != null ? Math.max(0, 40 - weeksLeft) : null;
  const trimester = weeksPregnant != null
    ? weeksPregnant < 13
      ? "1st"
      : weeksPregnant < 28
      ? "2nd"
      : "3rd"
    : null;

  const toInputDate = (d) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const handleOverride = (e) => {
    e.preventDefault();
    const form = e.target;
    const value = form.elements.namedItem("dueOverride").value;
    if (value) {
      try {
        const iso = new Date(value).toISOString();
        setDueDate(iso);
      } catch {}
    }
  };
  const hash = (s) => {
    try { return btoa(unescape(encodeURIComponent(s))); } catch { return ""; }
  };
  const sections = [
    {
      center: true,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-6 py-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl mb-4 text-black">
            Welcome <span className="font-cursive text-gold">{memberName || "Friend"}</span>
          </h1>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            {monthsPregnant != null && (
              <>
                <span className="font-serif">{monthsPregnant} months pregnant</span>
                {weeksLeft != null && <> • {weeksLeft} weeks left</>}
                {trimester && <> • {trimester} trimester</>}
                {due && <> • Due {formatDate(due)}</>}
              </>
            )}
            {!monthsPregnant && due && (
              <>
                {weeksLeft != null && <>{weeksLeft} weeks left • </>}
                {trimester && <>{trimester} trimester • </>}
                Due {formatDate(due)}
              </>
            )}
          </p>
          {babyName && weeksLeft != null && (
            <p className={`mt-3 text-base max-w-2xl mx-auto ${gender==='girl' ? 'text-pink-600' : gender==='boy' ? 'text-blue-600' : 'text-black/80'}`}>
              {weeksLeft} weeks left until baby <span className="font-cursive">{babyName}</span> is here.
            </p>
          )}
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 btn btn-primary"
            >
              Book Your Consultation
            </motion.button>
          </Link>
          <Link to="/editprofile">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 ml-0 md:ml-4 px-6 py-3 rounded-lg btn btn-primary font-medium transition-shadow shadow-lg hover:shadow-xl"
            >
              Edit Profile
            </motion.button>
          </Link>
        </motion.div>
      ),
    },
    {
      title: "Your Portal",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-10 max-w-5xl mx-auto"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <div className="cc-card text-left">
              <h3 className="font-serif text-xl text-black mb-2">Ask Taylor a Question</h3>
              <p className="text-black/70 mb-4">Have a quick question? Send it directly and I’ll reply.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const s = encodeURIComponent("Question for Taylor-Made");
                  const b = encodeURIComponent("Hi Taylor,\n\nMy question is: ");
                  window.location.href = `mailto:RegistryTaylor@gmail.com?subject=${s}&body=${b}`;
                }}
              >
                Ask Taylor
              </button>
            </div>
            <div className="cc-card text-left">
              <h3 className="font-serif text-xl text-black mb-2">Request Taylor‑Made Services</h3>
              <p className="text-black/70 mb-4">Ready for curated support? Request a consultation or plan.</p>
              <div className="flex gap-3">
                <Link to="/services" className="px-4 py-3 rounded-lg border-2 border-gold/40 text-black bg-white hover:brightness-95">Explore Services</Link>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const s = encodeURIComponent("Taylor-Made Services Request");
                    const b = encodeURIComponent("Hi Taylor,\n\nI’d like to request: ");
                    window.location.href = `mailto:RegistryTaylor@gmail.com?subject=${s}&body=${b}`;
                  }}
                >
                  Request Now
                </button>
              </div>
            </div>
            <div className="cc-card text-left">
              <h3 className="font-serif text-xl text-black mb-2">Ask the Group (Blog)</h3>
              <p className="text-black/70 mb-4">Post a topic or browse conversations in the private blog.</p>
              <a href="/blog" className="btn btn-primary">Go to Blog</a>
            </div>
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {sections.map((section, i) => (
        <Section key={i} index={i} center={section.center} title={section.title} tightTop compact>
          {section.content}
        </Section>
      ))}
    </div>
  );
};

export default PrivateHome;
