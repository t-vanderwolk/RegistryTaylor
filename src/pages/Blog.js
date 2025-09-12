// src/pages/Blog.js
import React, { useEffect, useMemo, useState } from "react";
import Section from "../components/UI/Section";
import { Link } from "react-router-dom";
import defaultTopics from "../data/blogPosts.json";

const Blog = () => {
  const STORAGE_KEY = "tm_blog_posts";
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultTopics;
    } catch {
      return defaultTopics;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(topics)); } catch {}
  }, [topics]);

  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const addTopic = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const next = [{ title: newTitle.trim(), excerpt: newExcerpt.trim() }, ...topics];
    setTopics(next);
    setNewTitle("");
    setNewExcerpt("");
  };

  const composeEmail = (subject) => {
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent("I'd like to submit a topic/question for the Taylor-Made Blog.\n\nTopic: ");
    window.location.href = `mailto:RegistryTaylor@gmail.com?subject=${s}&body=${b}`;
  };

  return (
    <div className="bg-accent min-h-screen">
      <Section title="Taylor‑Made Blog" center>
        <div className="max-w-4xl mx-auto text-black/80">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link to="/welcome" className="px-4 py-2 rounded-lg border-2 border-gold/40 bg-white text-black hover:brightness-95">Back to Portal</Link>
            <Link to="/services" className="px-4 py-2 rounded-lg border-2 border-gold/40 bg-white text-black hover:brightness-95">Explore Services</Link>
            <Link to="/editprofile" className="px-4 py-2 rounded-lg border-2 border-gold/40 bg-white text-black hover:brightness-95">Edit Profile</Link>
            <button className="btn btn-primary" onClick={() => composeEmail("Question for Taylor-Made")}>Ask Taylor</button>
          </div>
          <p className="mb-6">A private space for the Taylor‑Made community to share tips, questions, and wins.</p>
          <form onSubmit={addTopic} className="cc-card mb-8 grid gap-3 text-left">
            <h3 className="font-serif text-xl text-black">Post a New Topic</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e)=>setNewTitle(e.target.value)}
              placeholder="Topic title"
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
            />
            <textarea
              value={newExcerpt}
              onChange={(e)=>setNewExcerpt(e.target.value)}
              placeholder="A short description or question"
              rows="3"
              className="w-full rounded-lg border-2 border-gold/40 focus:border-gold px-4 py-3 bg-white"
            />
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">Publish</button>
              <button type="button" className="px-4 py-3 rounded-lg border-2 border-gold/40 bg-white text-black" onClick={()=>{setNewTitle("");setNewExcerpt("");}}>Clear</button>
            </div>
          </form>
          <div className="grid gap-6 md:grid-cols-2">
            {topics.map((t, i) => (
              <div key={i} className="cc-card text-left">
                <h3 className="font-serif text-xl text-black mb-2">{t.title}</h3>
                <p className="text-black/70">{t.excerpt}</p>
                <div className="mt-4 flex gap-3">
                  <Link to="/welcome" className="px-3 py-2 rounded border-2 border-gold/40 bg-white text-black hover:brightness-95">Discuss</Link>
                  <Link to="/services" className="px-3 py-2 rounded border-2 border-gold/40 bg-white text-black hover:brightness-95">Related Services</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="btn btn-primary" onClick={() => composeEmail("Blog Topic Submission")}>Submit a Topic</button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Blog;
