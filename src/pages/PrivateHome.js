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
            Welcome <span className="font-cursive text-primary">{memberName || "Friend"}</span>
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
              className="mt-8 px-6 py-3 rounded-lg bg-primary text-white font-medium transition-shadow shadow-lg hover:shadow-xl"
            >
              Book Your Consultation
            </motion.button>
          </Link>
        </motion.div>
      ),
    },
    {
      title: "Countdown",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-16 max-w-3xl mx-auto text-black/80"
        >
          {due ? (
            <div className="grid gap-8 md:grid-cols-2">
              <div className={`p-6 rounded-xl border-2 bg-white text-center ${gender==='girl' ? 'border-pink-200' : gender==='boy' ? 'border-blue-200' : 'border-black/10'}`}>
                <div className="text-5xl font-serif text-black">{daysLeft}</div>
                <div className="mt-2 text-black/70">days until due date</div>
              </div>
              <div className={`p-6 rounded-xl border-2 bg-white ${gender==='girl' ? 'border-pink-200' : gender==='boy' ? 'border-blue-200' : 'border-black/10'}`}>
                <div className="font-serif text-xl mb-4">
                  {due.toLocaleString(undefined, { month: "long", year: "numeric" })}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {["S","M","T","W","T","F","S"].map((d,i)=>(
                    <div key={i} className="text-xs text-black/60">{d}</div>
                  ))}
                  {cal.map((d, i) => {
                    const isDue = d === due.getDate();
                    return (
                      <div
                        key={i}
                        className={`h-9 flex items-center justify-center rounded ${
                          d
                            ? isDue
                              ? (gender==='girl' ? 'bg-pink-500 text-white' : gender==='boy' ? 'bg-blue-500 text-white' : 'bg-primary text-white')
                              : `bg-white border ${gender==='girl' ? 'border-pink-200' : gender==='boy' ? 'border-blue-200' : 'border-black/10'} text-black`
                            : ""
                        }`}
                      >
                        {d || ""}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-2">
                <form onSubmit={handleOverride} className="mt-2 flex items-center gap-3 justify-center">
                  <label className="text-black/80">Override due date:</label>
                  <input
                    type="date"
                    name="dueOverride"
                    defaultValue={toInputDate(due)}
                    className="rounded-lg border-2 border-black/20 focus:border-black px-3 py-2 bg-white"
                  />
                  <button className="btn btn-primary">Update</button>
                </form>
                {originalDueDate && originalDueDate !== dueDate && (
                  <p className="mt-3 text-center text-sm text-black/60">
                    Original due date: {formatDate(new Date(originalDueDate))}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p>Please enter through the invite gate to see your personalized countdown.</p>
          )}
        </motion.div>
      ),
    },
    {
      title: "Profile",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-16 max-w-2xl mx-auto text-black/80"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            setProfileMsg("");
            const form = e.currentTarget;
            const p1 = form.elements.namedItem("p1").value.trim();
            const p2 = form.elements.namedItem("p2").value.trim();
            const baby = form.elements.namedItem("babyName")?.value.trim() || "";
            const uname = form.elements.namedItem("uname")?.value.trim() || "";
            const pwd = form.elements.namedItem("pwd")?.value || "";
            const confirm = form.elements.namedItem("confirm")?.value || "";
            if (!p1) { setProfileMsg("Parent 1 name is required."); return; }
            const combined = p2 ? `${p1} & ${p2}` : p1;
            setMemberName(combined);
            setBabyName(baby);
            if (uname) setUsername(uname);
            if (pwd || confirm) {
              if (pwd !== confirm) { setProfileMsg("Passwords do not match."); return; }
              setPasswordHash(hash(pwd));
            }
            setProfileMsg("Profile saved.");
          }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-medium">Parent 1 Name</label>
              <input
                type="text"
                name="p1"
                defaultValue={(memberName || '').split(' & ')[0] || ''}
                required
                className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
              />
            </div>
            <div>
              <label className="block text-black font-medium">Parent 2 Name (optional)</label>
              <input
                type="text"
                name="p2"
                defaultValue={(memberName || '').split(' & ')[1] || ''}
                className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-black font-medium">Baby's Name (optional)</label>
              <input
                type="text"
                name="babyName"
                defaultValue={babyName || ''}
                placeholder="Enter baby's name"
                className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
              />
            </div>
            <div>
              <label className="block text-black font-medium">Username (optional)</label>
              <input
                type="text"
                name="uname"
                defaultValue={username || ''}
                placeholder="Create a username for login"
                className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
              />
            </div>
            <div>
              <label className="block text-black font-medium">Password (optional)</label>
              <input
                type="password"
                name="pwd"
                placeholder="Create a password"
                className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-black font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                placeholder="Re-enter password"
                className="w-full rounded-lg border-2 border-black/20 focus:border-black px-4 py-3 bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
              {profileMsg && <p className="mt-2 text-sm text-black/70">{profileMsg}</p>}
            </div>
          </form>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="bg-accent min-h-screen">
      {sections.map((section, i) => (
        <Section key={i} index={i} center={section.center} title={section.title}>
          {section.content}
        </Section>
      ))}
    </div>
  );
};

export default PrivateHome;
