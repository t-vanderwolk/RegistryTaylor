import React, { useMemo } from "react";

const conciergeHighlights = [
  {
    id: 1,
    title: "Nursery install",
    detail: "White-glove setup scheduled for October 4 at 9:00 AM.",
  },
  {
    id: 2,
    title: "Registry refresh",
    detail: "Morgan added 5 curated travel picks based on your babymoon plans.",
  },
];

const conciergeChecklist = [
  "Review stroller accessories list",
  "Upload hospital bag preferences",
  "Confirm grandparent sleepover dates",
];

const conciergeMessages = [
  {
    sender: "Morgan (Mentor)",
    message: "Sent over the baby monitor comparison chart—let me know if you want to hop on Zoom!",
    time: "Today, 8:10 AM",
  },
  {
    sender: "Concierge Team",
    message: "Your Sip & See inspiration deck is ready for review.",
    time: "Yesterday, 6:45 PM",
  },
];

const ClientPortal = () => {
  const profile = useMemo(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }, []);

  return (
    <main className="min-h-screen bg-cream px-6 py-20 text-darkText">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-babyPink">Client Portal</p>
          <h1 className="font-playful text-4xl text-blueberry">
            Hi {profile?.name || "there"}, your concierge game-plan is ready ✨
          </h1>
          <p className="font-body text-sm text-darkText/70 max-w-2xl mx-auto">
            Track mentoring support, concierge touchpoints, and curated recommendations as you prepare for baby.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-babyBlue/40 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl text-blueberry">Upcoming Support</h2>
            <ul className="mt-4 space-y-4 font-body text-sm text-darkText/80">
              {conciergeHighlights.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-babyBlue/30 bg-babyBlue/10 px-4 py-3"
                >
                  <p className="font-semibold text-darkText">{item.title}</p>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-babyPink/40 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl text-blueberry">Concierge Checklist</h2>
            <ul className="mt-4 space-y-3 font-body text-sm text-darkText/80">
              {conciergeChecklist.map((task) => (
                <li
                  key={task}
                  className="flex items-start gap-3 rounded-2xl border border-babyPink/30 bg-babyPink/10 px-4 py-3"
                >
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-heading text-babyPink">★</span>
                  <p>{task}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-[2.5rem] border border-pastelPurple/40 bg-white p-8 shadow-soft">
          <h2 className="font-heading text-xl text-blueberry text-center">Messages & Updates</h2>
          <div className="mt-6 space-y-4 font-body text-sm text-darkText/80">
            {conciergeMessages.map((item, index) => (
              <article
                key={index}
                className="rounded-3xl border border-pastelPurple/30 bg-pastelPurple/10 px-5 py-4"
              >
                <p className="font-semibold text-darkText">{item.sender}</p>
                <p className="mt-1">{item.message}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-darkText/60">{item.time}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-babyBlue/30 bg-white p-6 shadow-soft">
          <h2 className="font-heading text-xl text-blueberry">Need concierge support right now?</h2>
          <p className="mt-2 text-sm text-darkText/70 font-body">
            Message your mentor directly or email the concierge desk at{' '}
            <a href="mailto:concierge@taylormadebaby.com" className="text-blueberry underline decoration-babyPink/50">
              concierge@taylormadebaby.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
};

export default ClientPortal;
