import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useCommunityConnect from "../../hooks/useCommunityConnect";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../design-system/Button";
import MentorSidebar from "../../components/dashboard/MentorSidebar";

const Connect: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useCommunityConnect();

  const events = data?.events || [];
  const announcements = data?.announcements || [];
  const threads = data?.threads || [];

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-[2.75rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-10">
        <header className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-blush/40 px-4 py-2 text-xs font-heading uppercase tracking-[0.35em] text-charcoal">
            Connect · Community & Mentors
          </span>
          <h1 className="font-heading text-3xl text-charcoal sm:text-4xl">Gather inside the Taylor-Made circle</h1>
          <p className="max-w-2xl text-sm text-charcoal/75 sm:text-base">
            RSVP for salons, join live mentor office hours, and revisit concierge conversations. This is the space where
            members become mentors.
          </p>
        </header>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/55">
          <span>{events.length} upcoming events</span>
          <span aria-hidden="true">•</span>
          <span>{threads.length} recent mentor messages</span>
        </div>
      </section>

      {loading && (
        <div className="grid gap-6 lg:grid-cols-[0.65fr,0.35fr]">
          <div className="space-y-4">
            <div className="h-48 animate-pulse rounded-[2.5rem] bg-white/80 shadow-soft" />
            <div className="h-48 animate-pulse rounded-[2.5rem] bg-white/80 shadow-soft" />
          </div>
          <div className="h-96 animate-pulse rounded-[2.5rem] bg-white/80 shadow-soft" />
        </div>
      )}

      {!loading && error && (
        <EmptyState
          title="Unable to load community updates"
          description={error}
          action={
            <button
              type="button"
              onClick={refresh}
              className="rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.35em] text-white shadow-soft"
            >
              Try again
            </button>
          }
        />
      )}

      {!loading && data && (
        <div className="grid gap-8 lg:grid-cols-[0.65fr,0.35fr]">
          <div className="space-y-8">
            <section className="space-y-4 rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8">
              <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">Salon Calendar</p>
                  <h2 className="font-heading text-2xl text-charcoal">Upcoming gatherings</h2>
                </div>
                <Button as={Link} to="/dashboard/community-forum" variant="mauve" size="sm">
                  Open Community Forum
                </Button>
              </header>
              {events.length === 0 ? (
                <EmptyState
                  title="No events on the calendar"
                  description="Taylor will add new salons and office hours shortly."
                />
              ) : (
                <ul className="space-y-3">
                  {events.map((event) => (
                    <li
                      key={event.id}
                      className="rounded-[2rem] border border-mauve/20 bg-ivory/90 p-4 shadow-inner"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-heading text-lg text-charcoal">{event.title}</p>
                          <p className="text-xs font-heading uppercase tracking-[0.3em] text-mauve/70">
                            {event.eventType?.replace(/_/g, " ") || "Salon"} · {new Date(event.startsAt).toLocaleString()}
                          </p>
                        </div>
                        {event.location && (
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-charcoal/60 shadow-inner">
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="mt-2 text-sm text-charcoal/70">{event.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="space-y-4 rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8">
              <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">Mentor Threads</p>
                  <h2 className="font-heading text-2xl text-charcoal">Recent check-ins</h2>
                </div>
                <Button as={Link} to="/dashboard/messages" variant="gold" size="sm">
                  View Messages
                </Button>
              </header>
              {threads.length === 0 ? (
                <EmptyState
                  title="No new messages"
                  description="Your mentor will share notes soon."
                />
              ) : (
                <ul className="space-y-3">
                  {threads.map((thread) => (
                    <li key={thread.id} className="rounded-[2rem] border border-mauve/20 bg-ivory/90 p-4 shadow-inner">
                      <div className="flex items-center justify-between text-xs font-heading uppercase tracking-[0.3em] text-mauve/70">
                        <span>{thread.senderName}</span>
                        <span>{new Date(thread.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 text-sm text-charcoal/75">{thread.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <MentorSidebar
            mentor={data.mentor}
            profile={data.profile}
            events={events}
            announcements={announcements}
            onContactMentor={() => navigate("/dashboard/messages")}
          />
        </div>
      )}
    </div>
  );
};

export default Connect;
