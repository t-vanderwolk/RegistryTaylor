import React from "react";
import ProgressTracker from "./ProgressTracker";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const clampProgress = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
};

const ModuleCard = ({ module, onSelect, isActive = false, disabled = false }) => {
  if (!module) return null;
  const { id, title, section, content = {}, progress = 0, totalPrompts, completedPrompts } = module;
  const hero = content.hero || {};
  const summary = content.overview || content.explore || hero.subtitle || hero.tagline || "";
  const objectives = Array.isArray(content.objectives) ? content.objectives.slice(0, 3) : [];
  const safeProgress = clampProgress(progress);

  const handleClick = () => {
    if (disabled || !onSelect) return;
    onSelect(module);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={[
        "group flex w-full flex-col justify-between rounded-2xl border px-6 py-6 text-left shadow-soft backdrop-blur-sm transition duration-200",
        disabled ? "cursor-not-allowed opacity-60" : "hover:-translate-y-1 hover:shadow-dreamy",
        isActive ? "border-mauve/50 ring-4 ring-mauve/20" : "border-charcoal/10",
      ].join(" ")}
      aria-pressed={isActive}
      disabled={disabled}
      data-module-id={id}
      whileHover={!disabled ? { y: -4 } : undefined}
      whileFocus={!disabled ? { y: -2 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-mauve/30 bg-mauve/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-mauve">
            {section}
          </span>
          <span className="text-xs font-heading uppercase tracking-[0.32em] text-gold">
            {hero.duration || hero.format ? `${hero.duration ?? ""}${hero.duration && hero.format ? " • " : ""}${hero.format ?? ""}` : "Masterclass"}
          </span>
        </div>

        <div>
          <h3 className="font-playful text-2xl text-charcoal">{title}</h3>
          {summary && (
            <p className="mt-2 line-clamp-3 text-sm font-body text-charcoal/70">
              {summary}
            </p>
          )}
        </div>

        {!!objectives.length && (
          <ul className="mt-2 space-y-1.5 rounded-[1.75rem] border border-ivory/60 bg-ivory/70 px-4 py-3 text-xs font-body text-charcoal/70">
            {objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-2">
                <span aria-hidden className="mt-[2px] h-1.5 w-1.5 rounded-full bg-mauve/70" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between text-[0.7rem] font-heading uppercase tracking-[0.28em] text-charcoal/60">
            <span>Progress</span>
            <span>
              {safeProgress}%{typeof completedPrompts === "number" && typeof totalPrompts === "number"
                ? ` · ${completedPrompts}/${totalPrompts}`
                : ""}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ivory/70">
            <div
              className="h-full rounded-full bg-mauve/70 transition-all duration-500 ease-out group-hover:bg-mauve"
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>
        <div className="hidden w-24 sm:flex sm:flex-col sm:items-center sm:justify-center sm:gap-1">
          <ProgressTracker value={safeProgress} label="Complete" />
          <ArrowRight className="h-4 w-4 text-tmMauve/70" aria-hidden />
        </div>
      </div>
    </motion.button>
  );
};

export default ModuleCard;
