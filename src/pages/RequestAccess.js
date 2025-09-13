// src/pages/RequestAccess.js
import React, { useState } from "react";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import { useAuth } from "../context/AuthContext";

const RequestAccess = () => {
  const { setOriginalDueDate, setGender } = useAuth();
  const [parent1, setParent1] = useState("");
  const [parent2, setParent2] = useState("");
  const [email, setEmail] = useState("");
  const [due, setDue] = useState("");
  const [selGender, setSelGender] = useState("");
  const [message, setMessage] = useState("");

  const requestAccess = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("Access Request: Taylor-Made Baby Planning");
    const combinedName = parent2 ? `${parent1} & ${parent2}` : parent1;
    const body = encodeURIComponent(
      `Parent 1: ${parent1}\nParent 2: ${parent2}\nCombined: ${combinedName}\nEmail: ${email}\nDue date: ${due}\nGender: ${selGender || 'unspecified'}\n\nMessage:\n${message}`
    );
    if (due) {
      try {
        const iso = new Date(due).toISOString();
        setOriginalDueDate(iso);
      } catch {}
    }
    if (selGender) setGender(selGender);
    window.location.href = `mailto:RegistryTaylor@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-accent min-h-screen">
      <SectionDivider className="pt-4" />
      <Section title="Request Access" center tightTop compact>
        <form onSubmit={requestAccess} className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="col-span-1">
            <label className="block text-black font-medium">Parent 1 Name</label>
            <input
              type="text"
              value={parent1}
              onChange={(e) => setParent1(e.target.value)}
              placeholder="First parent name"
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 outline-none bg-white"
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
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 outline-none bg-white"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-black font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 outline-none bg-white"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Due Date (optional)</label>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 outline-none bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-black font-medium">Baby's Gender (optional)</label>
            <select
              value={selGender}
              onChange={(e) => setSelGender(e.target.value)}
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
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
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 outline-none bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full md:w-auto btn btn-primary">Request Access</button>
          </div>
        </form>
      </Section>
    </div>
  );
};

export default RequestAccess;

