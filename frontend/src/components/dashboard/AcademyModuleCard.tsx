import React from "react";
import { motion } from "framer-motion";
import Card from "../../design-system/Card";
import Button from "../../design-system/Button";
import { H2, P } from "../../design-system/Typography";

export type AcademyModuleProgress = {
  exploreCompleted: boolean;
  lectureCompleted: boolean;
  applyCompleted: boolean;
  journalEntry: string;
  percentComplete: number;
  completed: boolean;
  completedAt?: string | null;
  journalUpdatedAt?: string | null;
};

export type AcademyModuleSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category?: string | null;
  registryFocus?: string | null;
  estimatedMinutes?: number | null;
  isCore?: boolean;
  overview?: string;
  progress: AcademyModuleProgress;
};

type ModuleCardProps = {
  module: AcademyModuleSummary;
  onSelect?: (module: AcademyModuleSummary) => void;
  actionLabel?: string;
};

const badgeCopy: Record<string, string> = {
  foundations: "Foundations",
  nursery: "Nursery",
  gear: "Gear",
  postpartum: "Postpartum",
  community: "Community",
};

const AcademyModuleCard: React.FC<ModuleCardProps> = ({ module, onSelect, actionLabel }) => {
  const { progress } = module;

  const statusLabel = progress.completed
    ? "Completed"
    : progress.percentComplete > 0
    ? "In Progress"
    : "New Module";

  const buttonLabel =
    actionLabel ||
    (progress.completed ? "Review Module" : progress.percentComplete > 0 ? "Resume Module" : "Start Module");

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="h-full rounded-2xl border-mauve/30 bg-ivory/90 shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy">
        <div className="flex flex-col gap-5">
          <header className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-mauve/20 px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.4em] text-mauve">
              {module.isCore ? "Core Module" : "Elective"} · {badgeCopy[module.category || "foundations"] || "Learn"}
            </span>
            <H2 className="text-mauve text-xl sm:text-2xl">{module.title}</H2>
            {module.subtitle && <P className="text-sm text-charcoal/70">{module.subtitle}</P>}
          </header>

          {module.overview && (
            <P className="text-sm leading-relaxed text-charcoal/75">
              {module.overview.length > 160 ? `${module.overview.slice(0, 160)}…` : module.overview}
            </P>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/60">
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-inner">{statusLabel}</span>
              {typeof module.estimatedMinutes === "number" && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{module.estimatedMinutes} min</span>
                </>
              )}
              {module.registryFocus && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{module.registryFocus}</span>
                </>
              )}
            </div>
            <Button
              variant="mauve"
              size="sm"
              className="min-w-[160px]"
              onClick={() => onSelect?.(module)}
            >
              {buttonLabel}
            </Button>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/55 shadow-inner">
            <span>Progress</span>
            <span className="inline-flex h-2 w-2 rounded-full bg-mauve" aria-hidden="true" />
            <span>{progress.percentComplete}%</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AcademyModuleCard;
