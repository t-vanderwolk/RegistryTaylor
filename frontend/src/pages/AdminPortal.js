import React, { useMemo } from "react";

const adminStats = [
  { label: "Active Members", value: 42 },
  { label: "Mentor Team", value: 6 },
  { label: "Open Invites", value: 9 },
];

const adminAnnouncements = [
  {
    id: 1,
    title: "Bespoke package launch",
    detail: "Coordinate concierge touchpoints ahead of the fall pilot cohort.",
  },
  {
    id: 2,
    title: "Mentor onboarding survey",
    detail: "Collect day-one feedback from all new mentors by Friday.",
  },
];

const adminQuickLinks = [
  { id: "invites", label: "Invite Requests", description: "Approve or deny new requests" },
  { id: "packages", label: "Membership Packages", description: "Update pricing and perks" },
  { id: "add-ons", label: "Add-On Library", description: "Maintain concierge menu" },
];

const AdminPortal = () => {
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
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-babyBlue">Admin Portal</p>
          <h1 className="font-playful text-4xl text-blueberry">
            Welcome back, {profile?.name || "Admin"}
          </h1>
          <p className="font-body text-sm text-darkText/70 max-w-2xl mx-auto">
            Oversee concierge operations, mentor assignments, and member experiences all in one glossy dashboard.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {adminStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-3xl border border-babyBlue/40 bg-white p-6 text-center shadow-soft"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-darkText/60">{stat.label}</p>
              <p className="mt-2 font-heading text-3xl text-blueberry">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-babyPink/40 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl text-blueberry">Today’s Announcements</h2>
            <ul className="mt-4 space-y-4 font-body text-sm text-darkText/80">
              {adminAnnouncements.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-babyPink/30 bg-babyPink/10 px-4 py-3"
                >
                  <p className="font-semibold text-darkText">{item.title}</p>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-pastelPurple/40 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-xl text-blueberry">Quick Actions</h2>
            <ul className="mt-4 space-y-4 font-body text-sm text-darkText/80">
              {adminQuickLinks.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl border border-pastelPurple/30 bg-pastelPurple/10 px-4 py-3"
                >
                  <span className="font-heading text-blueberry">{item.label}</span>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white p-8 shadow-soft">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-xl text-blueberry">Mentor Coverage</h2>
              <p className="mt-2 text-sm text-darkText/75 font-body">
                Review which mentors are at capacity and who’s available for new member pairings.
              </p>
              <ul className="mt-4 space-y-3 text-sm font-body text-darkText/80">
                <li className="rounded-2xl border border-babyBlue/30 bg-babyBlue/10 px-4 py-3">
                  Morgan Ellis · <span className="text-blueberry">3 active members</span>
                </li>
                <li className="rounded-2xl border border-babyBlue/30 bg-babyBlue/10 px-4 py-3">
                  Jade Rivera · <span className="text-blueberry">2 active members</span>
                </li>
                <li className="rounded-2xl border border-babyBlue/30 bg-babyBlue/10 px-4 py-3">
                  Samira Cho · <span className="text-blueberry">Open for onboarding</span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-babyPink/40 bg-babyPink/10 p-6">
              <h3 className="font-heading text-lg text-blueberry">VIP Concierge Queue</h3>
              <p className="mt-2 text-sm text-darkText/75 font-body">
                Track high-touch requests awaiting admin approval.
              </p>
              <ul className="mt-4 space-y-3 text-sm font-body text-darkText/80">
                <li className="rounded-2xl border border-babyPink/30 bg-white px-4 py-3">
                  Avery Parker · Approve travel nursery install upgrade
                </li>
                <li className="rounded-2xl border border-babyPink/30 bg-white px-4 py-3">
                  Harper Family · Confirm Sip & See production vendors
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPortal;
