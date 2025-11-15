"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ModuleCard from "@/components/academy/ModuleCard";
import type { AcademyModule } from "@/types/academy";

type AcademyCarouselProps = {
  modules: AcademyModule[];
  initialSlug?: string;
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 140 : -140,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 140 : -140,
    opacity: 0,
    scale: 0.96,
  }),
};

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

export default function AcademyCarousel({ modules, initialSlug }: AcademyCarouselProps) {
  const resolvedInitialIndex = useMemo(() => {
    if (!initialSlug) {
      return 0;
    }
    const match = modules.findIndex((module) => module.slug === initialSlug);
    return match === -1 ? 0 : match;
  }, [initialSlug, modules]);

  const [index, setIndex] = useState(resolvedInitialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setIndex(resolvedInitialIndex);
  }, [resolvedInitialIndex]);

  const hasModules = modules.length > 0;
  const activeModule = useMemo(
    () => (hasModules ? modules[wrapIndex(index, modules.length)] : null),
    [index, modules, hasModules]
  );

  const paginate = useCallback(
    (step: number) => {
      if (!modules.length) return;
      setDirection(step);
      setIndex((current) => wrapIndex(current + step, modules.length));
    },
    [modules.length]
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 80;
      if (Math.abs(info.offset.x) < threshold) {
        return;
      }
      paginate(info.offset.x > 0 ? -1 : 1);
    },
    [paginate]
  );

  if (!hasModules) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E8E3E1] bg-white/70 p-10 text-center text-sm text-[#3E2F35]/70">
        Modules are on the way. Taylor is curating new lessons for you.
      </div>
    );
  }

  if (!activeModule) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="relative flex items-center justify-center">
        {modules.length > 1 ? (
          <button
            type="button"
            onClick={() => paginate(-1)}
            className="absolute left-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#EED6D3] bg-white text-[#3E2F35] transition hover:bg-[#EED6D3]/40"
            aria-label="Previous module"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <div className="relative w-full max-w-3xl overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeModule.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: "easeOut" }}
              drag={modules.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={modules.length > 1 ? handleDragEnd : undefined}
            >
              <ModuleCard module={activeModule} isActive />
            </motion.div>
          </AnimatePresence>
        </div>

        {modules.length > 1 ? (
          <button
            type="button"
            onClick={() => paginate(1)}
            className="absolute right-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#EED6D3] bg-white text-[#3E2F35] transition hover:bg-[#EED6D3]/40"
            aria-label="Next module"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      {modules.length > 1 ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {modules.map((module, dotIndex) => {
              const isActive = wrapIndex(index, modules.length) === dotIndex;
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => {
                    const current = wrapIndex(index, modules.length);
                    if (dotIndex === current) {
                      return;
                    }
                    const step = dotIndex > current ? dotIndex - current : -(current - dotIndex);
                    paginate(step);
                  }}
                  className={`h-2.5 rounded-full transition ${
                    isActive ? "w-6 bg-[#D6C1C7]" : "w-2.5 bg-[#E8E3E1]"
                  }`}
                  aria-label={`Go to ${module.title}`}
                />
              );
            })}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/60">
            {wrapIndex(index, modules.length) + 1} / {modules.length}
          </p>
        </div>
      ) : null}
    </div>
  );
}
