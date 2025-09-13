// src/pages/CreateProfile.js
import React, { useState } from "react";
import Section from "../components/UI/Section";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CreateProfile = () => {
  const navigate = useNavigate();
  const {
    memberName,
    setMemberName,
    babyName,
    setBabyName,
    gender,
    setGender,
    dueDate,
    setDueDate,
    originalDueDate,
    setOriginalDueDate,
    username,
    setUsername,
    setPasswordHash,
  } = useAuth();

  const [msg, setMsg] = useState("");
  const [p1, setP1] = useState((memberName || "").split(" & ")[0] || "");
  const [p2, setP2] = useState((memberName || "").split(" & ")[1] || "");
  const [baby, setBaby] = useState(babyName || "");
  const [selGender, setSelGender] = useState(gender || "");
  const [due, setDue] = useState(
    (originalDueDate || dueDate) ? new Date(originalDueDate || dueDate).toISOString().slice(0,10) : ""
  );
  const [uname, setUname] = useState(username || "");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");

  const hash = (s) => {
    try { return btoa(unescape(encodeURIComponent(s))); } catch { return ""; }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    if (!p1.trim()) { setMsg("Parent 1 name is required."); return; }
    const combined = p2.trim() ? `${p1.trim()} & ${p2.trim()}` : p1.trim();
    setMemberName(combined);
    setBabyName(baby.trim());
    setGender(selGender);
    if (due) {
      try {
        const iso = new Date(due).toISOString();
        setOriginalDueDate(iso);
        setDueDate(iso);
      } catch {}
    }
    if (uname.trim()) setUsername(uname.trim());
    if (pwd || confirm) {
      if (pwd !== confirm) { setMsg("Passwords do not match."); return; }
      setPasswordHash(hash(pwd));
    }
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-white">
      <Section title="Create Your Profile" center tightTop compact>
        <form onSubmit={onSubmit} className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div>
            <label className="block text-black font-medium">Parent 1 Name</label>
            <input className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white" value={p1} onChange={(e)=>setP1(e.target.value)} required />
          </div>
          <div>
            <label className="block text-black font-medium">Parent 2 Name (optional)</label>
            <input className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white" value={p2} onChange={(e)=>setP2(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Baby's Name (optional)</label>
            <input className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white" value={baby} onChange={(e)=>setBaby(e.target.value)} />
          </div>
          <div>
            <label className="block text-black font-medium">Due Date</label>
            <input type="date" className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white" value={due} onChange={(e)=>setDue(e.target.value)} />
          </div>
          <div>
            <label className="block text-black font-medium">Baby's Gender</label>
            <select className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white" value={selGender} onChange={(e)=>setSelGender(e.target.value)}>
              <option value="">Prefer not to say</option>
              <option value="girl">Girl</option>
              <option value="boy">Boy</option>
            </select>
          </div>
          <div>
            <label className="block text-black font-medium">Create Username (optional)</label>
            <input className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white" value={uname} onChange={(e)=>setUname(e.target.value)} />
          </div>
          <div>
            <label className="block text-black font-medium">Create Password (optional)</label>
            <input type="password" className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white" value={pwd} onChange={(e)=>setPwd(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Confirm Password</label>
            <input type="password" className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white" value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
          </div>
          <div className="md:col-span-2 flex items-center gap-4">
            <button type="submit" className="btn btn-primary">Save and Continue</button>
            <button
              type="button"
              onClick={() => navigate('/welcome')}
              className="px-4 py-3 rounded-lg border-2 border-gold/40 text-black bg-white hover:brightness-95"
            >
              Skip for now
            </button>
            {msg && <p className="mt-2 text-sm text-black/70">{msg}</p>}
          </div>
        </form>
      </Section>
    </div>
  );
};

export default CreateProfile;
