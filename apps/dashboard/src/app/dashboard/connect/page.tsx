import { requireMember } from "@/lib/auth";

const COMMUNITY_POSTS = [
  {
    id: "nursery-design",
    title: "Nursery mood board swap",
    author: "Avery · Concierge Mentor",
    excerpt:
      "Share your current color story or upload inspiration photos. Avery will highlight a member mood board during Friday’s studio salon.",
    tags: ["nursery", "design lab"],
    postedAt: "2 hours ago",
  },
  {
    id: "stroller-labs",
    title: "Stroller field notes",
    author: "Taylor Member Circle",
    excerpt:
      "Our Gear Journey alumni are sharing real-world observations on UPPAbaby vs. Nuna systems—plus travel system hacks.",
    tags: ["gear", "mobility"],
    postedAt: "5 hours ago",
  },
  {
    id: "fourth-trimester-circle",
    title: "Fourth trimester care circle",
    author: "Lola · Postpartum Doula",
    excerpt:
      "Bring your rituals, meal prep wins, and questions for welcoming your baby with ease. Lola is leading affirmations and breathwork.",
    tags: ["postpartum", "rituals"],
    postedAt: "Yesterday",
  },
];

const UPCOMING_EVENTS = [
  {
    id: "mentor-salon",
    name: "Mentor salon · Week 18",
    date: "Tuesday · 11:00 AM ET",
    description: "Live concierge Q&A with nursery stylist Mia & registry strategist Jordan.",
  },
  {
    id: "design-lab",
    name: "Design lab · Custom nursery palette",
    date: "Thursday · 8:00 PM ET",
    description: "Swap palettes, shop links, and meet our featured member mood board.",
  },
  {
    id: "community-circle",
    name: "Fourth trimester circle",
    date: "Sunday · 4:00 PM ET",
    description: "Guided reflection with Lola plus journaling prompts and breathwork.",
  },
];

export const metadata = {
  title: "Connect",
  description: "Tap into the Taylor-Made community and curated event programming.",
};

export default async function ConnectPage() {
  await requireMember();

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Connect</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Community salons, circles, and concierge moments
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Stay inspired with mentor-led salons, curated gear labs, and reflection circles led by our doula and care team.
          Every touchpoint is crafted to keep your registry, nursery, and fourth trimester rituals feeling bespoke.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.65fr,0.35fr]">
        <div className="space-y-5">
          {COMMUNITY_POSTS.map((post) => (
            <article
              key={post.id}
              className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/90 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(200,161,180,0.22)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
                <span>{post.author}</span>
                <span className="text-[#3E2F35]/60">{post.postedAt}</span>
              </div>
              <h2 className="mt-3 font-[var(--font-playfair)] text-xl text-[#3E2F35]">{post.title}</h2>
              <p className="mt-3 text-sm text-[#3E2F35]/70">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gradient-to-r from-[#C8A1B4]/15 via-[#EAC9D1]/25 to-[#FFFAF8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
              >
                Open thread →
              </button>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/35 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Events</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-xl text-[#3E2F35]">Upcoming salons & circles</h2>
            <ul className="mt-5 space-y-5 text-sm text-[#3E2F35]/75">
              {UPCOMING_EVENTS.map((event) => (
                <li key={event.id} className="rounded-[1.75rem] bg-white/85 p-4 shadow-inner">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">{event.date}</p>
                  <p className="mt-2 font-semibold text-[#3E2F35]">{event.name}</p>
                  <p className="mt-2 text-xs text-[#3E2F35]/70">{event.description}</p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_20px_rgba(200,161,180,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,161,180,0.45)]"
                  >
                    RSVP
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/90 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">Need concierge support?</h3>
            <p className="mt-3 text-sm text-[#3E2F35]/70">
              Drop questions for your mentor anytime. We curate responses during live sessions and send personalized
              follow-ups straight to your journal.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Message concierge →
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
