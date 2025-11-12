"use client";

import type { Route } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickAccessCards from "@/components/dashboard/QuickAccessCards";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import ReflectionPanel from "@/components/dashboard/ReflectionPanel";
import AnnouncementsFeed from "@/components/dashboard/AnnouncementsFeed";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import MobileFooterNav from "@/components/dashboard/MobileFooterNav";
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
    <div className="relative min-h-screen bg-[#FFF7FA]">
      <main className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 pb-24 pt-16 sm:px-10 lg:px-12">
        <DashboardHeader {...header} />

        <QuickAccessCards {...quickAccess} />

        <LearnSpotlight modules={learn.modules} />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-12">
            <ProgressOverview {...progress} />
            <ReflectionPanel reflections={reflections} communityHighlights={communityHighlights} />
          </div>
          <div className="space-y-12">
            <AnnouncementsFeed
              announcements={announcements.map((item) => ({
                ...item,
                href: item.href as Route,
              }))}
            />
            <MessagesPanel {...messages} />
          </div>
        </div>
      </main>
      <MobileFooterNav />
    </div>
  );
}
