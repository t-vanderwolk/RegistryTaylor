"use client";

import { useState, useMemo } from "react";
import type { ModuleContentBlock, MentorNote } from "@/types/academy";
import SectionBlock from "@/components/academy/blocks/SectionBlock";
import InsightBlock from "@/components/academy/blocks/InsightBlock";
import TipBlock from "@/components/academy/blocks/TipBlock";
import ReflectBlock from "@/components/academy/blocks/ReflectBlock";
import MentorBlock from "@/components/academy/blocks/MentorBlock";
import RegistryBlock from "@/components/academy/blocks/RegistryBlock";
import MilestoneBlock from "@/components/academy/blocks/MilestoneBlock";

type LectureRendererProps = {
  blocks: ModuleContentBlock[];
  mentorNote?: MentorNote | null;
  onReflectionSave?: (_value: string) => Promise<void>;
};

function splitParagraphs(body: string): string[] {
  return body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export default function LectureRenderer({ blocks, mentorNote, onReflectionSave }: LectureRendererProps) {
  const [reflectionCache, setReflectionCache] = useState<Record<number, string>>({});

  const normalizedBlocks = useMemo(() => {
    const list = [...blocks];
    if (mentorNote) {
      list.push({
        type: "mentor",
        body: mentorNote.text,
        heading: mentorNote.author,
        subheading: mentorNote.role ?? undefined,
      });
    }
    return list;
  }, [blocks, mentorNote]);

  return (
    <div className="space-y-10">
      {normalizedBlocks.map((entry, index) => {
        const paragraphs = splitParagraphs(entry.body);
        const key = `${entry.type ?? "section"}-${index}`;

        switch ((entry.type ?? "section").toLowerCase()) {
          case "insight":
            return <InsightBlock key={key} heading={entry.heading} content={entry.body} />;
          case "tip":
            return <TipBlock key={key} heading={entry.heading} content={entry.body} />;
          case "reflect":
          case "reflection": {
            const savedValue = reflectionCache[index] ?? "";
            return (
              <ReflectBlock
                key={key}
                heading={entry.heading}
                prompt={entry.body}
                initialValue={savedValue}
                onSave={async (value) => {
                  setReflectionCache((cache) => ({ ...cache, [index]: value }));
                  await onReflectionSave?.(value);
                }}
              />
            );
          }
          case "mentor":
            return (
              <MentorBlock
                key={key}
                quote={entry.body}
                author={entry.heading}
                role={entry.subheading}
              />
            );
          case "registry": {
            const fallback = entry.fallback ??
              (entry.metadata && typeof entry.metadata === "object" && "fallback" in entry.metadata
                ? (entry.metadata.fallback as { title?: string; description?: string | null; image?: string | null; url?: string | null })
                : undefined);
            return (
              <RegistryBlock
                key={key}
                title={entry.heading ?? "Registry recommendation"}
                description={entry.body}
                productId={entry.productId}
                externalId={entry.externalId}
                fallback={fallback}
              />
            );
          }
          case "milestone":
            return (
              <MilestoneBlock
                key={key}
                title={entry.heading ?? "Milestone"}
                headline={(entry.metadata?.headline as string | undefined) ?? entry.subheading}
                message={entry.body}
                percent={entry.percent ?? null}
              />
            );
          default:
            return (
              <SectionBlock
                key={key}
                heading={entry.heading}
                subheading={entry.subheading}
                paragraphs={paragraphs}
              />
            );
        }
      })}
    </div>
  );
}
