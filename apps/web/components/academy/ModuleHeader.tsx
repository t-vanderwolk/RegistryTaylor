"use client";

import Link from "next/link";
import { ProgressRing } from "../ProgressRing";
import { Badge } from "./Badge";

export type ModuleHeaderProps = {
  journeyTitle: string;
  trackTitle: string;
  trackSlug: string;
  moduleTitle: string;
  moduleSubtitle?: string | null;
  progressCompleted: number;
  progressTotal: number;
  achievement?: {
    code: string;
    title: string;
    description: string;
    iconSvg?: string;
  } | null;
  isTrackComplete: boolean;
};

export function ModuleHeader({
  journeyTitle,
  trackTitle,
  trackSlug,
  moduleTitle,
  moduleSubtitle,
  progressCompleted,
  progressTotal,
  achievement,
  isTrackComplete,
}: ModuleHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-mauve-blush px-6 py-10 shadow-soft md:px-12">
      <div className="absolute inset-y-0 -left-20 hidden h-full w-64 bg-gradient-to-br from-tmBlush/60 to-transparent blur-3xl md:block" />
      <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 text-center md:text-left">
          <span className="font-display text-3xl text-tmMauve">{journeyTitle}</span>
          <h1 className="font-heading text-4xl text-tmCharcoal md:text-5xl">
            {moduleTitle}
          </h1>
          {moduleSubtitle && (
            <p className="mx-auto max-w-2xl text-sm text-tmCharcoal/70 md:mx-0 md:text-base">
              {moduleSubtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70 md:justify-start">
            <span>{trackTitle}</span>
            <span>·</span>
            <Link
              href={`/dashboard/academy/tracks/${trackSlug}`}
              className="text-tmMauve transition duration-200 hover:text-tmGold"
            >
              View track
            </Link>
          </div>
        </div>
        <ProgressRing
          label={`${trackTitle} progress`}
          value={progressCompleted}
          total={progressTotal}
        />
      </div>
      {achievement && isTrackComplete ? (
        <div className="relative mt-6 flex justify-center md:justify-start">
          <Badge
            title={achievement.title}
            description={achievement.description}
            iconSvg={achievement.iconSvg}
          />
        </div>
      ) : null}
    </header>
  );
}
