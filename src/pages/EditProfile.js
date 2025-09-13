// src/pages/EditProfile.js
import React, { useState } from "react";
import Section from "../components/UI/Section";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const {
    memberName,
    setMemberName,
    dueDate,
    setDueDate,
    originalDueDate,
    babyName,
    setBabyName,
    username,
    setUsername,
    setPasswordHash,
  } = useAuth();

  const [msg, setMsg] = useState("");

  const due = dueDate ? new Date(dueDate) : null;
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = due ? Math.max(0, Math.ceil((due.getTime() - now.getTime()) / msPerDay)) : null;

  const toInputDate = (d) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

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

  const handleOverride = (e) => {
    e.preventDefault();
    const value = e.currentTarget.elements.namedItem("dueOverride").value;
    if (value) {
      try {
        const iso = new Date(value).toISOString();
        setDueDate(iso);
        setMsg("Due date updated.");
      } catch {}
    }
  };

  const hash = (s) => {
    try { return btoa(unescape(encodeURIComponent(s))); } catch { return ""; }
  };

  return (
    <div className="min-h-screen bg-white">
      <Section title="Countdown" center tightTop compact>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-10 max-w-3xl mx-auto text-black/80"
        >
          {due ? (
            <div className="grid gap-8 md:grid-cols-2">
              <div className={`p-6 rounded-xl border-2 bg-white text-center border-gold/40`}>
                <div className="text-5xl font-serif text-black">{daysLeft}</div>
                <div className="mt-2 text-black/70">days until due date</div>
              </div>
              <div className={`p-6 rounded-xl border-2 bg-white border-gold/40`}>
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
                              ? 'bg-gold text-black'
                              : 'bg-white border border-gold/40 text-black'
                            : ''
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
                    className="rounded-lg border-2 border-gold/40 focus:border-gold px-3 py-2 bg-white"
                  />
                  <button className="btn btn-primary">Update</button>
                </form>
                {originalDueDate && originalDueDate !== dueDate && (
                  <p className="mt-3 text-center text-sm text-black/60">
                    Original due date: {new Date(originalDueDate).toLocaleDateString(undefined, {year:"numeric",month:"long",day:"numeric"})}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center">Please set a due date in your profile to see your countdown.</p>
          )}
        </motion.div>
      </Section>

      <Section title="Edit Profile" center tightTop compact>
        <form
          onSubmit={(e)=>{
            e.preventDefault();
            setMsg("");
            const form = e.currentTarget;
            const p1 = form.elements.namedItem("p1").value.trim();
            const p2 = form.elements.namedItem("p2").value.trim();
            const baby = form.elements.namedItem("babyName").value.trim();
            const uname = form.elements.namedItem("uname").value.trim();
            const pwd = form.elements.namedItem("pwd").value;
            const confirm = form.elements.namedItem("confirm").value;
            if (!p1) { setMsg("Parent 1 name is required."); return; }
            const combined = p2 ? `${p1} & ${p2}` : p1;
            setMemberName(combined);
            setBabyName(baby);
            if (uname) setUsername(uname);
            if (pwd || confirm) {
              if (pwd !== confirm) { setMsg("Passwords do not match."); return; }
              setPasswordHash(hash(pwd));
            }
            setMsg("Profile saved.");
          }}
          className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
        >
          <div>
            <label className="block text-black font-medium">Parent 1 Name</label>
            <input
              type="text"
              name="p1"
              defaultValue={(memberName || '').split(' & ')[0] || ''}
              required
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
            />
          </div>
          <div>
            <label className="block text-black font-medium">Parent 2 Name (optional)</label>
            <input
              type="text"
              name="p2"
              defaultValue={(memberName || '').split(' & ')[1] || ''}
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Baby's Name (optional)</label>
            <input
              type="text"
              name="babyName"
              defaultValue={babyName || ''}
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
            />
          </div>
          <div>
            <label className="block text-black font-medium">Username (optional)</label>
            <input
              type="text"
              name="uname"
              defaultValue={username || ''}
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
            />
          </div>
          <div>
            <label className="block text-black font-medium">Password (optional)</label>
            <input
              type="password"
              name="pwd"
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary">Save Profile</button>
            {msg && <p className="mt-2 text-sm text-black/70">{msg}</p>}
          </div>
        </form>
      </Section>
    </div>
  );
};

export default EditProfile;
