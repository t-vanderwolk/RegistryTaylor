import React from "react";

const Portal = () => {
  return (
    <main className="min-h-screen bg-cloudWhite text-deepSlate px-6 py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-softGold/40 bg-white/85 p-10 text-center shadow-soft backdrop-blur-sm">
        <h1 className="font-serif text-3xl mb-4">Member Portal</h1>
        <p className="text-sm leading-relaxed text-cozyGray/75">
          Taylor-Made’s private portal is coming soon. Approved members will be able to review their packages, add-ons, Mentor Circle messages, and upcoming concierge touchpoints here.
        </p>
        <p className="mt-4 text-sm text-cozyGray/60">
          Need support right now? Email <a href="mailto:concierge@taylormadebaby.com" className="text-deepSlate underline decoration-softGold/50">concierge@taylormadebaby.com</a> and Taylor will be in touch within 24 hours.
        </p>
      </div>
    </main>
  );
};

export default Portal;
