import React, { useMemo, useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { gradients } from "../../design-system/tokens";

const normalizeSlides = (rawSlides = []) =>
  rawSlides
    .map((chunk, index) => {
      if (!chunk) return null;
      const trimmed = chunk.trim();
      if (!trimmed) return null;

      const lines = trimmed.split("\n").map((line) => line.trim());
      const [firstLine, ...restLines] = lines;
      const remaining = restLines.join("\n").trim();

      if (remaining.length > 0) {
        return {
          id: index,
          heading: firstLine,
          body: remaining,
        };
      }

      const sentenceBoundary = trimmed.indexOf(". ");
      if (sentenceBoundary > 0 && sentenceBoundary < 120) {
        return {
          id: index,
          heading: trimmed.slice(0, sentenceBoundary + 1),
          body: trimmed.slice(sentenceBoundary + 1).trim(),
        };
      }

      return {
        id: index,
        heading: `Lecture Highlight ${index + 1}`,
        body: trimmed,
      };
    })
    .filter(Boolean);

const LectureCarousel = ({ slides }) => {
  const memoizedSlides = useMemo(() => normalizeSlides(slides), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (direction) => {
      const total = memoizedSlides.length;
      if (!total) return;
      setActiveIndex((prev) => {
        if (direction === "next") {
          return (prev + 1) % total;
        }
        if (direction === "prev") {
          return (prev - 1 + total) % total;
        }
        return prev;
      });
      setIsTransitioning(true);
    },
    [memoizedSlides.length]
  );

  useEffect(() => {
    if (!memoizedSlides.length) return;
    const timeout = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 420);
    return () => window.clearTimeout(timeout);
  }, [activeIndex, memoizedSlides.length]);

  if (!memoizedSlides.length) {
    return (
      <div className="space-y-3 rounded-2xl border border-tmMauve/20 bg-white/60 p-6 shadow-soft">
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-tmMauve/20" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-3 w-full animate-pulse rounded-full bg-tmMauve/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" role="group" aria-roledescription="carousel" aria-live="polite">
      <div className="overflow-hidden rounded-[1.75rem] border border-tmMauve/30 bg-white/90 shadow-surface">
        <AnimatePresence initial={false} custom={activeIndex}>
          <motion.article
            key={memoizedSlides[activeIndex]?.id}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="min-w-full px-6 py-8 md:px-10 md:py-10"
          >
            <header className="space-y-2">
              <h3 className="font-heading text-lg text-tmMauve">{memoizedSlides[activeIndex]?.heading}</h3>
              <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-tmMauve/20 via-tmGold/50 to-tmMauve/20" />
            </header>
            <p className="mt-4 whitespace-pre-line text-sm text-tmCharcoal/80">
              {memoizedSlides[activeIndex]?.body}
            </p>
          </motion.article>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => goTo("prev")}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-tmMauve/40 bg-white/80 p-3 text-tmMauve shadow-soft transition hover:-translate-y-1/2 hover:bg-white"
        aria-label="Previous highlight"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => goTo("next")}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-tmMauve/40 bg-white/80 p-3 text-tmMauve shadow-soft transition hover:-translate-y-1/2 hover:bg-white"
        aria-label="Next highlight"
      >
        ›
      </button>

      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="relative h-1 w-28 overflow-hidden rounded-full bg-tmMauve/15">
          <motion.span
            key={activeIndex}
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ backgroundImage: gradients.primary }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "easeOut" }}
            aria-hidden
          />
        </div>
        <span className="text-[0.65rem] font-heading uppercase tracking-[0.28em] text-tmCharcoal/50">
          {activeIndex + 1}/{memoizedSlides.length}
        </span>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {memoizedSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => {
              setActiveIndex(index);
              setIsTransitioning(true);
            }}
            className={clsx(
              "h-2.5 w-2.5 rounded-full transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              activeIndex === index
                ? "bg-tmMauve shadow-soft"
                : "bg-tmMauve/30 hover:bg-tmMauve/50"
            )}
            aria-label={`Go to highlight ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
          />
        ))}
      </div>

      <span className="sr-only" aria-live="polite">
        {`Slide ${activeIndex + 1} of ${memoizedSlides.length}${isTransitioning ? ", updating" : ""}`}
      </span>
    </div>
  );
};

export default LectureCarousel;
