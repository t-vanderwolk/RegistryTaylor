import type { Route } from "next";
import type { AcademyModule } from "@/types/academy";

export type QuickAccessData = {
  academy: {
    percentComplete: number;
    nextTitle: string | null;
    href: Route;
  };
  registry: {
    itemsAdded: number;
    goalCount: number;
    href: Route;
  };
  reflection: {
    excerpt: string | null;
    updatedAt: string | null;
    href: Route;
  };
  mentor: {
    title: string | null;
    dateLabel: string | null;
    href: Route;
  };
};

export type ReflectionEntryCard = {
  id: string;
  title: string;
  excerpt: string;
  createdAt: string;
  shared: boolean;
};

export type CommunityHighlightCard = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
};

export type AnnouncementCardData = {
  id: string;
  title: string;
  description: string;
  badge: string;
  dateLabel?: string | null;
  href: Route;
  ctaLabel?: string;
};

export type ProgressOverviewData = {
  totalModules: number;
  completedModules: number;
  percentComplete: number;
  streakDays: number;
  badges: string[];
};

export type MessagesPanelData = {
  mentorId: string | null;
  mentorName: string;
  memberName: string;
};

export type LearnSpotlightData = {
  modules: AcademyModule[];
};

export type RegistryItemSummary = {
  id: string;
  name?: string;
  category?: string | null;
  status?: string | null;
};

export type MemberProfileSummary = {
  mentorId: string | null;
  mentorName: string;
  conciergePriority: string | null;
};

export type MemberUserSummary = {
  id: string;
  email: string;
  firstName: string;
  membershipTier: string;
  currentDate: string;
};

export type RegistrySummary = {
  goal: number;
  items: RegistryItemSummary[];
};

export type JournalSummary = {
  reflections: ReflectionEntryCard[];
  latestExcerpt: string | null;
  lastUpdatedAt: string | null;
};

export type WorkbookSummary = {
  entries: ReflectionEntryCard[];
  totalEntries: number;
};

export type CommunitySummary = {
  highlights: CommunityHighlightCard[];
  announcements: AnnouncementCardData[];
  messages: MessagesPanelData;
};

export type EventsSummary = {
  weekly: Array<{
    id: string;
    title: string;
    startsAt: string | null;
    location: string | null;
    description: string | null;
  }>;
  bookings: Array<{
    id: string;
    title: string;
    startsAt: string | null;
    location: string | null;
    status: "GOING" | "INTERESTED" | "DECLINED" | null;
  }>;
};

export type MemberDashboardPayload = {
  user: MemberUserSummary;
  profile: MemberProfileSummary;
  learn: {
    modules: AcademyModule[];
    progress: ProgressOverviewData;
  };
  quickAccess: QuickAccessData;
  registry: RegistrySummary;
  journal: JournalSummary;
  workbook: WorkbookSummary;
  community: CommunitySummary;
  events: EventsSummary;
};
