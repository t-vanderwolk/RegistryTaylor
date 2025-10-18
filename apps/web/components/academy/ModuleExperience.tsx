"use client";

import { useEffect, useMemo, useState } from "react";
import { Module, ModuleContent, LectureSlide } from "../../lib/types";
import { ModuleHeader } from "./ModuleHeader";
import { ExploreCard } from "./ExploreCard";
import { LectureCarousel } from "./LectureCarousel";
import { JournalPrompt } from "../JournalPrompt";
import { RegistryPreview } from "./RegistryPreview";
import { ParallaxWrap } from "../visual/ParallaxWrap";
import { Confetti } from "../visual/Confetti";
import { awardAchievement } from "../../lib/api";
import { ApplyChecklist } from "../ApplyChecklist";

const TRACK_ACHIEVEMENTS: Record<
  string,
  { code: string; title: string; description: string; iconSvg?: string }
> = {
  "vision-foundations": {
    code: "VISION_COMPLETE",
    title: "Visionary Curator",
    description: "Completed every module in the Vision & Foundations track.",
    iconSvg:
      '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" stroke="#7A5968" stroke-width="4" fill="#EED8DF"/><path d="M20 34l8 8 16-20" stroke="#7A5968" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  "sleep-space": {
    code: "SLEEP_SPACE_SERIES",
    title: "Sleep Sanctuary",
    description: "Completed the full Sleep & Space track with confidence.",
    iconSvg:
      '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="22" width="40" height="28" rx="6" stroke="#7A5968" stroke-width="4" fill="#FAF7F4"/><path d="M20 30h8m8 0h8" stroke="#7A5968" stroke-width="4" stroke-linecap="round"/><path d="M20 38h24" stroke="#7A5968" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  "atmosphere-organization": {
    code: "POSTPARTUM_READY",
    title: "Postpartum Ready",
    description: "Curated care systems to welcome the fourth trimester.",
    iconSvg:
      '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="24" r="10" stroke="#7A5968" stroke-width="4" fill="#FAF7F4"/><path d="M18 48c2-8 8-12 14-12s12 4 14 12" stroke="#7A5968" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
};

type ModuleExperienceProps = {
  journeyTitle: string;
  trackTitle: string;
  trackSlug: string;
  moduleData: Module & { track_slug: string; track_title: string; journey_title: string };
  content: ModuleContent;
  slides: LectureSlide[];
  trackModules: Module[];
  checklistInitialState: Record<string, boolean>;
};

export function ModuleExperience({
  journeyTitle,
  trackTitle,
  trackSlug,
  moduleData,
  content,
  slides,
  trackModules,
  checklistInitialState,
}: ModuleExperienceProps) {
  const [registryRefresh, setRegistryRefresh] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [celebratedOnce, setCelebratedOnce] = useState(false);

  const totalModules = trackModules.length;
  const completedModules = trackModules.filter((module) => module.completed).length;
  const isTrackComplete = totalModules > 0 && completedModules === totalModules;

  const achievement = TRACK_ACHIEVEMENTS[trackSlug];

  useEffect(() => {
    if (!isTrackComplete || !achievement || celebratedOnce) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await awardAchievement(achievement.code);
        if (!cancelled) {
          setCelebrate(true);
          setCelebratedOnce(true);
          window.setTimeout(() => setCelebrate(false), 2800);
        }
      } catch (error) {
        console.error("Unable to award achievement", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [achievement, celebratedOnce, isTrackComplete]);

  const displaySlides = useMemo(() => {
    if (slides.length > 0) return slides;
    if (content.lecture?.bullets) {
      return content.lecture.bullets.map((text) => ({ text }));
    }
    return [];
  }, [slides, content.lecture]);

  return (
    <ParallaxWrap>
      <div className="relative space-y-10">
        <Confetti active={celebrate} />
        <ModuleHeader
          journeyTitle={journeyTitle}
          trackTitle={trackTitle}
          trackSlug={trackSlug}
          moduleTitle={moduleData.title}
          moduleSubtitle={moduleData.subtitle}
          progressCompleted={completedModules}
          progressTotal={totalModules}
          achievement={isTrackComplete ? achievement ?? null : null}
          isTrackComplete={isTrackComplete}
        />
        <ExploreCard explore={content.explore} />
        <LectureCarousel
          moduleCode={moduleData.code}
          slides={displaySlides}
          onRegistryChange={() => setRegistryRefresh((value) => value + 1)}
        />
        <JournalPrompt moduleCode={moduleData.code} prompt={content.journal_prompt} />
        <ApplyChecklist
          moduleId={moduleData.id}
          items={content.apply.items}
          initialState={checklistInitialState}
        />
        <RegistryPreview refreshKey={registryRefresh} />
      </div>
    </ParallaxWrap>
  );
}
