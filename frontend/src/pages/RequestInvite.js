import React from "react";
import InviteForm from "../components/InviteForm";

const RequestInvite = () => {
  return (
    <main className="bg-softBeige/40 pb-16 text-midnight">
      <section className="mx-auto mt-16 max-w-4xl rounded-[3rem] bg-white/80 px-8 py-16 text-center shadow-soft">
        <p className="text-xs font-heading uppercase tracking-[0.5em] text-blueberry/70">
          Concierge Applications
        </p>
        <h1 className="mt-4 text-4xl font-heading text-blueberry">Apply for a Taylor-Made Invite</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-midnight/75">
          We work with a limited number of expecting parents each season so every detail receives playful, personal attention. Share a glimpse of your family and we’ll respond with availability, next steps, and a handcrafted welcome.
        </p>
      </section>
      <InviteForm />
    </main>
  );
};

export default RequestInvite;
