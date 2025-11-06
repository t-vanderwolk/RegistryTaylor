"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { AcademyModule } from "@/types/academy";

type LectureContentProps = {
  module: AcademyModule;
};

function buildParagraphs(module: AcademyModule): string[] {
  const paragraphs: string[] = [];
  const rawLecture = module.content.lecture ?? "";

  if (rawLecture.trim()) {
    const chunks = rawLecture
      .split(/\n{2,}/)
      .map((chunk) => chunk.trim())
      .filter(Boolean);
    paragraphs.push(...chunks);
  }

  if (paragraphs.length === 0 && module.summary) {
    paragraphs.push(module.summary);
  }

  if (paragraphs.length < 2 && module.content?.insight) {
    paragraphs.push(module.content.insight);
  }

  while (paragraphs.length < 3) {
    const cadence = [
      `Inside ${module.title}, we ditch perfection and build rhythms that actually fit your family. Consider this your permission slip to edit, adapt, and try again.`,
      `We blend mentor wisdom with research-backed guidance so you can savor the calm moments and feel confident handling the chaotic ones.`,
      `Take what resonates, personalize the details, and remember: luxury is feeling supported, not following a script.`,
    ];
    const nextLine = cadence[paragraphs.length % cadence.length];
    paragraphs.push(nextLine);
  }

  return paragraphs.slice(0, 3);
}

export default function LectureContent({ module }: LectureContentProps) {
  const paragraphs = useMemo(() => buildParagraphs(module), [module]);
  const takeaways = useMemo(() => {
    if (Array.isArray(module.content.apply) && module.content.apply.length > 0) {
      return module.content.apply.slice(0, 5);
    }
    if (Array.isArray(module.content.sections) && module.content.sections.length > 0) {
      return module.content.sections
        .map((section) => section.heading ?? section.body)
        .filter(Boolean)
        .slice(0, 5);
    }
    return [];
  }, [module.content.apply, module.content.sections]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 rounded-academy-xl border border-blush-300/70 bg-ivory/95 p-8 text-charcoal-500 shadow-mauve-card"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-mauve-500/80">Concierge lecture</p>
        <h2 className="text-[2.2rem] font-serif leading-tight text-charcoal-700 md:text-[2.4rem]">{module.title}</h2>
        {module.subtitle ? (
          <p className="text-sm text-charcoal-400">{module.subtitle}</p>
        ) : null}
      </div>

      <div className="space-y-6 text-[1.05rem] leading-[1.7] text-charcoal-500">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={`paragraph-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            {index === 0 ? (
              (() => {
                const trimmed = paragraph.trimStart();
                const leading = paragraph.slice(0, paragraph.length - trimmed.length);
                const firstChunk = trimmed.slice(0, 2);
                const firstChar = firstChunk.charAt(0);
                const isLetter = /[A-Za-z]/.test(firstChar);
                const dropContent = isLetter ? firstChar : firstChunk;
                const remainder = trimmed.slice(dropContent.length);
                return (
                  <span className="block">
                    {leading}
                    <span className="float-left mr-3 font-serif text-5xl font-semibold leading-none text-mauve-500">
                      {dropContent}
                    </span>
                    {remainder}
                  </span>
                );
              })()
            ) : (
              paragraph
            )}
          </motion.p>
        ))}
      </div>

      {takeaways.length ? (
        <div className="space-y-3 rounded-academy border border-blush-300/70 bg-white/90 p-6 shadow-blush-soft">
          <p className="text-xs uppercase tracking-[0.32em] text-mauve-500">Key takeaways</p>
          <ul className="space-y-2 text-sm text-charcoal-500">
            {takeaways.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[6px] inline-flex h-2 w-2 rounded-full bg-mauve-500/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </motion.section>
  );
}
