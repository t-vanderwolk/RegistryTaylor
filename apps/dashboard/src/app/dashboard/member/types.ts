export type QuickAccessData = {
  academy: {
    percentComplete: number;
    nextTitle: string | null;
    href: string;
  };
  registry: {
    itemsAdded: number;
    goalCount: number;
    href: string;
  };
  reflection: {
    excerpt: string | null;
    updatedAt: string | null;
    href: string;
  };
  mentor: {
    title: string | null;
    dateLabel: string | null;
    href: string;
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
  href: string;
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

export type MemberDashboardPayload = {
  header: {
    firstName: string;
    membershipTier: string;
    mentorName: string;
    currentDate: string;
  };
  quickAccess: QuickAccessData;
  progress: ProgressOverviewData;
  reflections: ReflectionEntryCard[];
  communityHighlights: CommunityHighlightCard[];
  announcements: AnnouncementCardData[];
  messages: MessagesPanelData;
};
