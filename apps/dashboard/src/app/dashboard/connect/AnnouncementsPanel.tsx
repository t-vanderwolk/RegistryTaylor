import type { AnnouncementCard } from "./data";

type AnnouncementsPanelProps = {
  announcements: AnnouncementCard[];
};

export default function AnnouncementsPanel({ announcements }: AnnouncementsPanelProps) {
  if (announcements.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          Community Announcements
        </p>
        <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35] sm:text-3xl">
          Fresh studio updates & concierge highlights
        </h2>
        <p className="max-w-2xl text-sm text-[#3E2F35]/70">
          Catch the latest mentor broadcasts, studio schedule tweaks, and concierge actions without leaving Connect.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((announcement) => (
          <article
            key={announcement.id}
            className="flex h-full flex-col justify-between rounded-[2.125rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/45 p-6 shadow-[0_22px_55px_rgba(200,161,180,0.18)]"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
                <span>{announcement.authorRole}</span>
                <time dateTime={announcement.createdAt} className="text-[#3E2F35]/60">
                  {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h3 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">{announcement.title}</h3>
              <p className="text-sm leading-relaxed text-[#3E2F35]/75">{announcement.summary}</p>
            </div>
            {announcement.cta && (
              <a
                href={announcement.cta.href}
                className="mt-6 inline-flex w-max items-center gap-2 rounded-full bg-tm-rose px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
              >
                {announcement.cta.label}
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
