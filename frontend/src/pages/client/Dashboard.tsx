import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClientOverview } from "../../features/clients";
import useAcademyModules from "../../hooks/useAcademyModules";
import useRegistryOverview from "../../hooks/useRegistryOverview";
import useCommunityConnect from "../../hooks/useCommunityConnect";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../design-system/Button";
import { AcademyModuleCard, MentorSidebar } from "../../components/dashboard";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { modules, loading: modulesLoading, error: modulesError } = useAcademyModules({ limit: 3 });
  const { overview, loading: registryLoading, error: registryError } = useRegistryOverview();
  const { data: community, loading: communityLoading, error: communityError } = useCommunityConnect();

  const upcomingEvents = community?.events?.slice(0, 2) || [];
  const recentThreads = community?.threads?.slice(0, 2) || [];
  const curatorSuggestions = overview?.suggestions?.slice(0, 2) || [];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.65fr,0.35fr]">
      <div className="space-y-8">
        <ClientOverview />

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6 rounded-[2.75rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8"
        >
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">Learn</p>
              <h2 className="font-heading text-2xl text-charcoal">Taylor-Made Baby Academy</h2>
            </div>
            <Button variant="mauve" size="sm" onClick={() => navigate("/dashboard/learn")}>View all modules</Button>
          </header>
          {modulesLoading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`module-skeleton-${index}`} className="h-48 animate-pulse rounded-[2.25rem] bg-white/80 shadow-soft" />
              ))}
            </div>
          )}
          {!modulesLoading && modulesError && (
            <EmptyState title="Unable to load modules" description={modulesError} />
          )}
          {!modulesLoading && !modulesError && modules.length === 0 && (
            <EmptyState title="Modules coming soon" description="Taylor is preparing new lessons for you." />
          )}
          {!modulesLoading && !modulesError && modules.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map((module) => (
                <AcademyModuleCard key={module.id} module={module} onSelect={() => navigate(`/dashboard/learn/${module.id}`)} />
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="space-y-6 rounded-[2.75rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8"
        >
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">Plan</p>
              <h2 className="font-heading text-2xl text-charcoal">Dynamic registry synopsis</h2>
            </div>
            <Button variant="gold" size="sm" onClick={() => navigate("/dashboard/plan")}>Open Plan</Button>
          </header>
          {registryLoading && <div className="h-24 animate-pulse rounded-[2rem] bg-white/80 shadow-soft" />}
          {!registryLoading && registryError && <EmptyState title="Registry unavailable" description={registryError} />}
          {!registryLoading && overview && (
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-mauve/20 bg-ivory/90 p-4 text-sm text-charcoal/75 shadow-inner">
                <p>
                  {overview.unlocked
                    ? "Your dynamic registry is unlocked—new favorites appear as you complete modules."
                    : "Finish your core modules to unlock personalized registry suggestions."}
                </p>
              </div>
              {curatorSuggestions.length > 0 && (
                <ul className="space-y-3 text-sm text-charcoal/75">
                  {curatorSuggestions.map((suggestion) => (
                    <li key={suggestion.id} className="flex flex-col rounded-[1.75rem] border border-mauve/20 bg-white/90 p-4 shadow-inner sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-heading text-base text-charcoal">{suggestion.title}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-mauve/70">
                          {suggestion.category || "Curated"}
                          {suggestion.brand ? ` · ${suggestion.brand}` : ""}
                        </p>
                      </div>
                      <Button
                        variant="mauve"
                        size="sm"
                        className="mt-3 w-full sm:mt-0 sm:w-auto"
                        onClick={() => navigate("/dashboard/plan")}
                      >
                        Add from Plan
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="space-y-6 rounded-[2.75rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8"
        >
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">Connect</p>
              <h2 className="font-heading text-2xl text-charcoal">Community moments</h2>
            </div>
            <Button variant="mauve" size="sm" onClick={() => navigate("/dashboard/connect")}>Connect hub</Button>
          </header>
          {communityLoading && <div className="h-24 animate-pulse rounded-[2rem] bg-white/80 shadow-soft" />}
          {!communityLoading && communityError && (
            <EmptyState title="Community offline" description={communityError} />
          )}
          {!communityLoading && community && (
            <div className="space-y-4">
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-charcoal/70">No upcoming events scheduled. Check back soon.</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="rounded-[1.75rem] border border-mauve/20 bg-ivory/90 p-4 shadow-inner">
                      <p className="font-heading text-base text-charcoal">{event.title}</p>
                      <p className="text-xs font-heading uppercase tracking-[0.3em] text-mauve/70">
                        {event.eventType?.replace(/_/g, " ") || "Salon"} · {new Date(event.startsAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              {recentThreads.length > 0 && (
                <div className="rounded-[1.75rem] border border-mauve/20 bg-ivory/90 p-4 shadow-inner">
                  <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">Latest mentor note</p>
                  <p className="mt-2 text-sm text-charcoal/75">{recentThreads[0].body}</p>
                </div>
              )}
            </div>
          )}
        </motion.section>
      </div>

      <MentorSidebar
        mentor={community?.mentor || null}
        profile={community?.profile || null}
        events={community?.events || []}
        announcements={community?.announcements || []}
        onContactMentor={() => navigate("/dashboard/messages")}
      />
    </div>
  );
};

export default Dashboard;
