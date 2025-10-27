import React from "react";
import Button from "../../design-system/Button";

export type MentorSummary = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  specialty?: string | null;
  availability?: string | null;
};

export type MentorProfileMeta = {
  mentorEligible: boolean;
  mentorEligibleAt?: string | null;
  coreModulesCompleted: number;
  totalCore?: number;
};

export type CommunityEvent = {
  id: string;
  title: string;
  description?: string | null;
  eventType?: string | null;
  startsAt: string;
  location?: string | null;
  virtual?: boolean;
  featured?: boolean;
};

export type CommunityAnnouncement = {
  id: string;
  title: string;
  category?: string | null;
  createdAt: string;
  excerpt?: string | null;
};

type MentorSidebarProps = {
  mentor?: MentorSummary | null;
  profile?: MentorProfileMeta | null;
  events?: CommunityEvent[];
  announcements?: CommunityAnnouncement[];
  onContactMentor?: (mentor: MentorSummary) => void;
};

const MentorSidebar: React.FC<MentorSidebarProps> = ({
  mentor,
  profile,
  events = [],
  announcements = [],
  onContactMentor,
}) => {
  const eligibilityCopy = profile?.mentorEligible
    ? "Mentor-Eligible"
    : "Completing modules unlocks mentorship";

  const totalCore = profile?.totalCore ?? 0;
  const completedCore = profile?.coreModulesCompleted ?? 0;
  const progressPercent = totalCore > 0 ? Math.round((completedCore / totalCore) * 100) : 0;

  return (
    <aside className="space-y-6 rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft lg:sticky lg:top-[112px]">
      <section className="space-y-4">
        <header className="space-y-1">
          <span className="inline-flex items-center rounded-full bg-mauve/20 px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.4em] text-mauve">
            Mentor Circle
          </span>
          <h3 className="font-heading text-xl text-charcoal">Your Concierge Mentor</h3>
        </header>
        {mentor ? (
          <div className="space-y-3 rounded-[1.75rem] border border-mauve/20 bg-ivory/90 p-4 shadow-inner">
            <p className="font-heading text-lg text-charcoal">{mentor.name}</p>
            {mentor.specialty && <p className="text-sm text-charcoal/70">{mentor.specialty}</p>}
            <dl className="space-y-2 text-xs text-charcoal/70">
              {mentor.email && (
                <div className="flex gap-2">
                  <dt className="w-16 uppercase tracking-[0.28em]">Email</dt>
                  <dd>{mentor.email}</dd>
                </div>
              )}
              {mentor.phone && (
                <div className="flex gap-2">
                  <dt className="w-16 uppercase tracking-[0.28em]">Phone</dt>
                  <dd>{mentor.phone}</dd>
                </div>
              )}
              {mentor.availability && (
                <div className="flex gap-2">
                  <dt className="w-16 uppercase tracking-[0.28em]">Hours</dt>
                  <dd>{mentor.availability}</dd>
                </div>
              )}
            </dl>
            <Button
              type="button"
              variant="gold"
              size="sm"
              className="w-full"
              onClick={() => mentor && onContactMentor?.(mentor)}
            >
              Message Mentor
            </Button>
          </div>
        ) : (
          <p className="text-sm text-charcoal/70">
            Taylor is pairing you with the perfect mentor. Expect a welcome note shortly.
          </p>
        )}
      </section>

      <section className="space-y-4 rounded-[1.75rem] border border-mauve/20 bg-ivory/90 p-4 shadow-inner">
        <header className="space-y-1">
          <p className="text-xs font-heading uppercase tracking-[0.4em] text-mauve/80">Mentor Journey</p>
          <p className="font-heading text-lg text-charcoal">{eligibilityCopy}</p>
        </header>
        {totalCore > 0 && (
          <div className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/80 shadow-inner">
              <div
                className="h-full rounded-full bg-mauve transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs font-heading uppercase tracking-[0.35em] text-charcoal/55">
              {completedCore}/{totalCore} core modules complete
            </p>
          </div>
        )}
        {profile?.mentorEligibleAt && (
          <p className="text-xs text-charcoal/70">
            Marked mentor-eligible {new Date(profile.mentorEligibleAt).toLocaleDateString()}
          </p>
        )}
      </section>

      {events.length > 0 && (
        <section className="space-y-3">
          <header className="space-y-1">
            <p className="text-xs font-heading uppercase tracking-[0.4em] text-mauve/80">Upcoming</p>
            <p className="font-heading text-lg text-charcoal">Learn · Plan · Connect events</p>
          </header>
          <ul className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <li
                key={event.id}
                className="rounded-[1.75rem] border border-mauve/20 bg-white/90 p-4 text-sm text-charcoal/75 shadow-inner"
              >
                <p className="font-heading text-base text-charcoal">{event.title}</p>
                <p className="mt-1 text-xs font-heading uppercase tracking-[0.3em] text-mauve/70">
                  {event.eventType && `${event.eventType.replace(/_/g, " ")} · `}
                  {new Date(event.startsAt).toLocaleString()}
                </p>
                {event.location && <p className="mt-1 text-xs text-charcoal/60">{event.location}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {announcements.length > 0 && (
        <section className="space-y-3">
          <header className="space-y-1">
            <p className="text-xs font-heading uppercase tracking-[0.4em] text-mauve/80">Community</p>
            <p className="font-heading text-lg text-charcoal">Latest announcements</p>
          </header>
          <ul className="space-y-2 text-sm text-charcoal/70">
            {announcements.slice(0, 3).map((announcement) => (
              <li key={announcement.id} className="rounded-[1.5rem] border border-mauve/15 bg-white/80 p-3 shadow-inner">
                <p className="font-heading text-sm text-charcoal">{announcement.title}</p>
                <p className="text-xs text-charcoal/55">
                  {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  {announcement.category ? ` · ${announcement.category}` : ""}
                </p>
                {announcement.excerpt && (
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/65">{announcement.excerpt}…</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
};

export default MentorSidebar;
