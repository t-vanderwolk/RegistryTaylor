"use client";

import type { Route } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickAccessCards from "@/components/dashboard/QuickAccessCards";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import ReflectionPanel from "@/components/dashboard/ReflectionPanel";
import AnnouncementsFeed from "@/components/dashboard/AnnouncementsFeed";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import LearnSpotlight from "@/components/dashboard/LearnSpotlight";
import type { MemberDashboardPayload } from "@/app/dashboard/member/types";

type MemberDashboardClientProps = {
  payload: MemberDashboardPayload;
};

export default function MemberDashboardClient({ payload }: MemberDashboardClientProps) {
  const header = {
    firstName: payload.user.firstName,
    membershipTier: payload.user.membershipTier,
    mentorName: payload.profile.mentorName,
    currentDate: payload.user.currentDate,
  };

  const quickAccess = payload.quickAccess;
  const progress = payload.learn.progress;
  const reflections = payload.journal.reflections;
  const communityHighlights = payload.community.highlights;
  const announcements = payload.community.announcements;
  const messages = payload.community.messages;
  const learn = { modules: payload.learn.modules };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <DashboardHeader {...header} />

      <QuickAccessCards {...quickAccess} />

      <LearnSpotlight modules={learn.modules} />

      <ProgressOverview {...progress} />

      <ReflectionPanel reflections={reflections} communityHighlights={communityHighlights} />

      <AnnouncementsFeed
        announcements={announcements.map((item) => ({
          ...item,
          href: item.href as Route,
        }))}
      />

      <MessagesPanel {...messages} />
    </div>
  );
}
