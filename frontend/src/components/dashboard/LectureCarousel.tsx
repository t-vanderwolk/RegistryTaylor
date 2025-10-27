import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Button from "../../design-system/Button";

export type LectureCarouselSection = {
  id: string;
  eyebrow: string;
  title: string;
  content: string;
};

type LectureCarouselProps = {
  sections: LectureCarouselSection[];
};

const carouselVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const LectureCarousel: React.FC<LectureCarouselProps> = ({ sections }) => {
  const orderedSections = useMemo(() => sections.filter((section) => section.content?.trim().length > 0), [sections]);
  const [index, setIndex] = useState(0);

  if (!orderedSections.length) return null;

  const current = orderedSections[Math.min(index, orderedSections.length - 1)];

  const goTo = (nextIndex: number) => {
    setIndex((prev) => {
      if (nextIndex < 0) return orderedSections.length - 1;
      if (nextIndex >= orderedSections.length) return 0;
      return nextIndex;
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-mauve/25 bg-white/95 shadow-soft">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.65fr,0.35fr] lg:gap-10">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              variants={carouselVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              <span className="inline-flex items-center rounded-full bg-mauve/20 px-3 py-1 text-[0.62rem] font-heading uppercase tracking-[0.4em] text-mauve">
                {current.eyebrow}
              </span>
              <h3 className="font-heading text-2xl text-charcoal sm:text-3xl">{current.title}</h3>
              <div className="prose prose-sm max-w-none text-charcoal/75 prose-headings:text-charcoal prose-strong:text-charcoal prose-a:text-mauve">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{current.content}</ReactMarkdown>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <aside className="flex flex-col justify-between gap-6 rounded-[2rem] border border-mauve/20 bg-ivory/80 p-6 text-sm text-charcoal/70 shadow-inner">
          <div className="space-y-2">
            <p className="text-xs font-heading uppercase tracking-[0.4em] text-mauve/80">Module Sections</p>
            <ul className="space-y-2">
              {orderedSections.map((section, sectionIndex) => {
                const active = sectionIndex === index;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => setIndex(sectionIndex)}
                      className={[
                        "w-full rounded-[1.5rem] border px-3 py-2 text-left transition",
                        active
                          ? "border-mauve/40 bg-white/90 text-charcoal shadow-soft"
                          : "border-transparent bg-transparent text-charcoal/60 hover:border-mauve/25 hover:bg-white/70",
                      ].join(" ")}
                    >
                      <span className="block text-[0.7rem] font-heading uppercase tracking-[0.35em] text-mauve/70">
                        {section.eyebrow}
                      </span>
                      <span className="text-sm font-medium text-charcoal">{section.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="gold"
              size="sm"
              className="min-w-[120px]"
              onClick={() => goTo(index - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="mauve"
              size="sm"
              className="min-w-[120px]"
              onClick={() => goTo(index + 1)}
            >
              Next
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LectureCarousel;
