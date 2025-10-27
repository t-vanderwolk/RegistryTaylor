import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import useAcademyModule, {
  AcademyModuleChecklistItem,
  AcademyModuleDetail,
} from "../../hooks/useAcademyModule";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../design-system/Button";
import { LectureCarousel, JournalPrompt } from "../../components/dashboard";

const LearnModule: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { module, loading, saving, error, updateProgress } = useAcademyModule({ moduleId: moduleId || null });
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [checklist, setChecklist] = useState<AcademyModuleChecklistItem[]>([]);
  const [localModule, setLocalModule] = useState<AcademyModuleDetail | null>(null);

  useEffect(() => {
    if (module) {
      setLocalModule(module);
      setJournalEntry(module.progress.journalEntry || "");
      setChecklist(module.checklist || []);
    }
  }, [module]);

  const sections = useMemo(() => {
    if (!localModule) return [];
    const applyContent =
      localModule.checklist && localModule.checklist.length
        ? localModule.checklist.map((item) => `- ${item.label}`).join("\n")
        : "Use the checklist below to translate insights into action.";

    return [
      {
        id: "explore",
        eyebrow: "Explore",
        title: "Overview",
        content: localModule.overview || "",
      },
      {
        id: "lecture",
        eyebrow: "Lecture",
        title: localModule.subtitle || localModule.title,
        content: localModule.lecture || "",
      },
      {
        id: "apply",
        eyebrow: "Apply",
        title: "Checklist & Planning",
        content: applyContent,
      },
    ];
  }, [localModule]);

  const stageButtons = useMemo(() => {
    if (!localModule) return [];
    return [
      {
        key: "exploreCompleted" as const,
        label: "Explore",
        description: "Mark the overview as reviewed",
      },
      {
        key: "lectureCompleted" as const,
        label: "Lecture",
        description: "Mark the lecture content as complete",
      },
    ];
  }, [localModule]);

  const handleStageToggle = async (key: "exploreCompleted" | "lectureCompleted") => {
    if (!localModule) return;
    const current = localModule.progress[key];
    await updateProgress({
      exploreCompleted: key === "exploreCompleted" ? !current : localModule.progress.exploreCompleted,
      lectureCompleted: key === "lectureCompleted" ? !current : localModule.progress.lectureCompleted,
      checklist,
      journalEntry,
    });
  };

  const handleChecklistToggle = async (item: AcademyModuleChecklistItem) => {
    const updated = checklist.map((entry) =>
      entry.id === item.id ? { ...entry, completed: !entry.completed } : entry
    );
    setChecklist(updated);
    await updateProgress({
      exploreCompleted: localModule?.progress.exploreCompleted,
      lectureCompleted: localModule?.progress.lectureCompleted,
      checklist: updated,
      journalEntry,
    });
  };

  const handleJournalSave = async (value: string) => {
    await updateProgress({
      exploreCompleted: localModule?.progress.exploreCompleted,
      lectureCompleted: localModule?.progress.lectureCompleted,
      checklist,
      journalEntry: value,
    });
  };

  if (!moduleId) {
    return <EmptyState title="No module selected" description="Choose a module from the Academy overview." />;
  }

  if (loading && !localModule) {
    return (
      <div className="space-y-8">
        <div className="h-36 animate-pulse rounded-[2.5rem] bg-white/80 shadow-soft" />
        <div className="h-64 animate-pulse rounded-[2.5rem] bg-white/80 shadow-soft" />
      </div>
    );
  }

  if (error && !localModule) {
    return (
      <EmptyState
        title="Unable to load module"
        description={error}
        action={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.35em] text-white shadow-soft"
          >
            Return to Academy
          </button>
        }
      />
    );
  }

  if (!localModule) return null;

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Link
            to=".."
            className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.35em] text-mauve transition hover:text-charcoal"
          >
            ← Back to Academy
          </Link>
          <h1 className="font-heading text-3xl text-charcoal sm:text-4xl">{localModule.title}</h1>
          {localModule.subtitle && <p className="text-sm text-charcoal/70">{localModule.subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/55">
          <span>{localModule.progress.percentComplete}% Complete</span>
          <span aria-hidden="true">•</span>
          <span>{localModule.registryFocus || "Academy Module"}</span>
        </div>
      </div>

      <LectureCarousel sections={sections} />

      <div className="grid gap-8 lg:grid-cols-[0.65fr,0.35fr]">
        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-4 rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8"
          >
            <header className="space-y-1">
              <p className="text-xs font-heading uppercase tracking-[0.4em] text-mauve/80">Module Progress</p>
              <p className="font-heading text-xl text-charcoal">Mark each stage complete</p>
            </header>
            <div className="grid gap-4">
              {stageButtons.map((stage) => {
                const isActive = localModule?.progress[stage.key];
                return (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => handleStageToggle(stage.key)}
                    className={[
                      "flex w-full flex-col gap-2 rounded-[1.75rem] border px-4 py-3 text-left transition",
                      isActive
                        ? "border-mauve/35 bg-mauve/10 text-charcoal shadow-soft"
                        : "border-mauve/15 bg-white/80 text-charcoal/60 hover:border-mauve/35 hover:bg-mauve/10",
                    ].join(" ")}
                  >
                    <span className="text-sm font-semibold text-charcoal">{stage.label}</span>
                    <span className="text-xs text-charcoal/60">{stage.description}</span>
                  </button>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
            className="space-y-4 rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8"
          >
            <header className="space-y-1">
              <p className="text-xs font-heading uppercase tracking-[0.4em] text-mauve/80">Apply Checklist</p>
              <p className="font-heading text-xl text-charcoal">Turn insight into action</p>
            </header>
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleChecklistToggle(item)}
                    className={[
                      "mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border  transition",
                      item.completed
                        ? "border-mauve bg-mauve text-white"
                        : "border-mauve/40 bg-white text-mauve hover:border-mauve",
                    ].join(" ")}
                    aria-pressed={item.completed}
                  >
                    {item.completed ? "✓" : ""}
                  </button>
                  <span className="text-sm text-charcoal/75">{item.label}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <JournalPrompt
            prompt={localModule.journalPrompt}
            value={journalEntry}
            onChange={setJournalEntry}
            onSave={handleJournalSave}
            saving={saving}
            updatedAt={localModule.progress?.journalUpdatedAt ?? null}
          />
        </div>

        <AnimatePresence>
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-4 rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8"
          >
            <p className="text-xs font-heading uppercase tracking-[0.4em] text-mauve/80">Module Stats</p>
            <div className="space-y-3 text-sm text-charcoal/70">
              <div className="flex items-center justify-between">
                <span>Completion</span>
                <span className="font-heading text-mauve">{localModule.progress.percentComplete}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Registry Focus</span>
                <span className="font-heading text-mauve">{localModule.registryFocus || "Curated"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Minutes</span>
                <span className="font-heading text-mauve">{localModule.estimatedMinutes || 20} min</span>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-mauve/20 bg-ivory/90 p-4 text-xs text-charcoal/65 shadow-inner">
              <p>
                Completed modules unlock curated registry suggestions inside Plan. Finish the checklist above to see new
                recommendations.
              </p>
            </div>
            <Button
              type="button"
              variant="gold"
              size="sm"
              className="w-full"
              onClick={() => navigate("/dashboard/plan")}
            >
              Continue to Plan
            </Button>
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LearnModule;
