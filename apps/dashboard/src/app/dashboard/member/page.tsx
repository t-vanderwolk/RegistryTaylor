import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickAccessCards from "@/components/dashboard/QuickAccessCards";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import ReflectionPanel from "@/components/dashboard/ReflectionPanel";
import AnnouncementsFeed, { type AnnouncementCard } from "@/components/dashboard/AnnouncementsFeed";
import MobileFooterNav from "@/components/dashboard/MobileFooterNav";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import { apiFetch } from "@/lib/apiClient";
import { getMemberToken, requireMember } from "@/lib/auth";
import { fetchWorkbookEntries, type WorkbookEntry } from "@/app/dashboard/academy/workbook/workbookApi";
import type { AcademyModule } from "@/types/academy";

type ApiProfileResponse = {
  profile?: {
    mentor?: {
      id: string;
      email?: string | null;
    } | null;
  } | null;
};

type ApiEvent = {
  id: string;
  title: string;
  description: string | null;
  startsAt: string | null;
  endsAt: string | null;
  location: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    email: string;
  };
  rsvps: Array<{
    id: string;
    userId: string;
    status: "GOING" | "INTERESTED" | "DECLINED";
  }>;
};

type ApiEventsResponse = {
  events: ApiEvent[];
};

type ApiCommunityPost = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  tags: string[];
  author: {
    email: string;
    role: "MEMBER" | "MENTOR" | "ADMIN";
  };
};

type ApiCommunityPostsResponse = {
  posts: ApiCommunityPost[];
};

type WeeklyEvent = {
  id: string;
  title: string;
  startsAt: string | null;
  location: string | null;
  description: string | null;
};

type Booking = {
  id: string;
  title: string;
  startsAt: string | null;
  location: string | null;
  status: "GOING" | "INTERESTED" | "DECLINED" | null;
};

type CommunityPreviewPost = {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  createdAt: string;
};

type ModulesResponse = {
  modules: AcademyModule[];
};

type RegistryItemsResponse = {
  items: Array<{
    id: string;
    name?: string;
    category?: string | null;
    status?: string | null;
  }>;
};

function toDisplayName(email?: string | null): string {
  if (!email) {
    return "Taylor-Made Mentor";
  }
  const namePart = email.split("@")[0] ?? "";
  if (!namePart) {
    return email;
  }
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function toExcerpt(body: string, max = 160): string {
  const trimmed = body.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1)}…`;
}

export default async function MemberDashboardPage() {
  const member = await requireMember();
  const token = await getMemberToken();

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const [profileResult, eventsResult, communityResult, modulesResult, registryResult, reflectionsResult] =
    await Promise.allSettled([
      apiFetch<ApiProfileResponse>("/api/profiles/me", {
        cache: "no-store",
        credentials: "include",
        headers: authHeaders,
      }),
      apiFetch<ApiEventsResponse>("/api/events/upcoming", {
        cache: "no-store",
        credentials: "include",
      }),
      apiFetch<ApiCommunityPostsResponse>("/api/community/posts", {
        cache: "no-store",
        credentials: "include",
      }),
      apiFetch<ModulesResponse>("/api/academy/modules", {
        cache: "no-store",
        credentials: "include",
      }),
      apiFetch<RegistryItemsResponse>("/api/registry-items", {
        cache: "no-store",
        credentials: "include",
      }),
      fetchWorkbookEntries(member.id),
    ]);

  const profileResponse = profileResult.status === "fulfilled" ? profileResult.value : null;
  const eventsResponse = eventsResult.status === "fulfilled" ? eventsResult.value : null;
  const communityResponse =
    communityResult.status === "fulfilled" ? communityResult.value : null;
  const modules = modulesResult.status === "fulfilled" ? modulesResult.value.modules ?? [] : [];
  const registryItems =
    registryResult.status === "fulfilled" ? registryResult.value.items ?? [] : [];
  const workbookEntries =
    reflectionsResult.status === "fulfilled" ? reflectionsResult.value : [];

  const mentorId = profileResponse?.profile?.mentor?.id ?? null;
  const mentorEmail = profileResponse?.profile?.mentor?.email ?? null;
  const mentorName = mentorId ? toDisplayName(mentorEmail) : "Your Mentor Team";

  const firstName = toDisplayName(member.email);

  const weeklyEvents: WeeklyEvent[] =
    eventsResponse?.events?.slice(0, 4).map((event) => ({
      id: event.id,
      title: event.title,
      startsAt: event.startsAt,
      location: event.location,
      description: event.description,
    })) ?? [];

  const bookings: Booking[] =
    eventsResponse?.events
      ?.filter((event) =>
        event.rsvps.some((rsvp) => rsvp.userId === member.id && rsvp.status === "GOING")
      )
      .map((event) => ({
        id: event.id,
        title: event.title,
        startsAt: event.startsAt,
        location: event.location,
        status: event.rsvps.find((rsvp) => rsvp.userId === member.id)?.status ?? null,
      })) ?? [];

  const communityPosts: CommunityPreviewPost[] =
    communityResponse?.posts
      ?.slice(0, 3)
      .map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: toExcerpt(post.body),
        authorName: toDisplayName(post.author.email),
        createdAt: post.createdAt,
      })) ?? [];

  const totalModules = modules.length;
  const completedModules = modules.filter((module) => module.progress?.completed).length;
  const percentComplete = totalModules
    ? Math.round(
        modules.reduce((acc, module) => acc + (module.progress?.percentComplete ?? 0), 0) / totalModules
      )
    : 0;
  const nextModule = modules.find((module) => !module.progress?.completed) ?? modules[0] ?? null;

  const registryGoal = Math.max(40, registryItems.length + 10);

  const latestReflection = [...workbookEntries]
    .sort(
      (a, b) =>
        new Date(b.updatedAt ?? b.createdAt).getTime() -
        new Date(a.updatedAt ?? a.createdAt).getTime()
    )
    .at(0);

  const reflectionExcerpt = latestReflection
    ? extractReflectionExcerpt(latestReflection)
    : null;

  const reflectionEntries = workbookEntries.slice(0, 4).map((entry) => ({
    id: entry.id,
    title: findModuleTitle(entry.moduleSlug, modules),
    excerpt: extractReflectionExcerpt(entry) ?? "A new reflection is waiting to be written.",
    createdAt: entry.updatedAt ?? entry.createdAt,
    shared: entry.shared,
  }));

  const communityHighlights = communityPosts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.authorName,
    createdAt: post.createdAt,
  }));

  const announcements = buildAnnouncements(weeklyEvents, communityPosts, registryItems);
  const mentorMoment = weeklyEvents[0] ?? null;
  const streakDays = Math.max(completedModules * 2, workbookEntries.length ? 3 : 1);
  const badges = buildBadges(percentComplete, completedModules, registryItems.length);

  return (
    <div className="relative min-h-screen bg-[#FFF7FA]">
      <main className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 pb-24 pt-16 sm:px-10 lg:px-12">
        <DashboardHeader
          firstName={firstName}
          membershipTier="Signature Taylor-Made"
          mentorName={mentorName}
          currentDate={new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        />

        <QuickAccessCards
          academy={{
            percentComplete,
            nextTitle: nextModule?.title ?? null,
            href: nextModule ? `/dashboard/learn/${nextModule.slug}` : "/dashboard/learn",
          }}
          registry={{
            itemsAdded: registryItems.length,
            goalCount: registryGoal,
            href: "/dashboard/plan",
          }}
          reflection={{
            excerpt: reflectionExcerpt,
            updatedAt: latestReflection?.updatedAt ?? latestReflection?.createdAt ?? null,
            href: "/dashboard/academy/workbook",
          }}
          mentor={{
            title: mentorMoment?.title ?? bookings[0]?.title ?? null,
            dateLabel: mentorMoment?.startsAt ?? bookings[0]?.startsAt ?? null,
            href: mentorId ? `/dashboard/connect?mentor=${mentorId}` : "/dashboard/connect",
          }}
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-12">
            <ProgressOverview
              totalModules={totalModules}
              completedModules={completedModules}
              percentComplete={percentComplete}
              streakDays={streakDays}
              badges={badges}
            />
            <ReflectionPanel reflections={reflectionEntries} communityHighlights={communityHighlights} />
          </div>
          <div className="space-y-12">
            <AnnouncementsFeed announcements={announcements} />
            <MessagesPanel mentorId={mentorId} mentorName={mentorName} memberName={firstName} />
          </div>
        </div>
      </main>
      <MobileFooterNav />
    </div>
  );
}

function extractReflectionExcerpt(entry: WorkbookEntry): string | null {
  const content = entry.content;
  if (content?.text?.trim()) {
    return content.text.trim();
  }
  if (content?.sections) {
    const values = Object.values(content.sections)
      .map((section) => section.text ?? section.reflection ?? "")
      .filter(Boolean);
    if (values.length) {
      return values[0]?.trim() ?? null;
    }
  }
  return null;
}

function findModuleTitle(slug: string, modules: AcademyModule[]): string {
  const match = modules.find((module) => module.slug === slug);
  return match?.title ?? "Taylor-Made Reflection";
}

function buildBadges(percentComplete: number, completedModules: number, registryItems: number): string[] {
  const badges: string[] = [];
  if (percentComplete >= 75) {
    badges.push("Calm Momentum");
  } else if (percentComplete >= 40) {
    badges.push("Steady Glow");
  } else {
    badges.push("Gentle Start");
  }

  if (completedModules >= 3) {
    badges.push("Chapter Collector");
  }

  if (registryItems >= 15) {
    badges.push("Registry Maven");
  }

  return badges;
}

function buildAnnouncements(
  events: WeeklyEvent[],
  community: CommunityPreviewPost[],
  registryItems: RegistryItemsResponse["items"]
): AnnouncementCard[] {
  const cards: AnnouncementCard[] = [];

  events.slice(0, 4).forEach((event) => {
    cards.push({
      id: `event-${event.id}`,
      title: event.title,
      description: event.description ?? "Mentor salon crafted for your season.",
      badge: "Upcoming Salon",
      dateLabel: event.startsAt
        ? new Date(event.startsAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : null,
      href: "/dashboard/connect/events",
      ctaLabel: "RSVP",
    });
  });

  community.slice(0, 3).forEach((post) => {
    cards.push({
      id: `community-${post.id}`,
      title: post.title,
      description: post.excerpt,
      badge: "Community Highlight",
      dateLabel: new Date(post.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      href: "/dashboard/community",
      ctaLabel: "Read post",
    });
  });

  const featureItem = registryItems[0];
  if (featureItem) {
    cards.push({
      id: `perk-${featureItem.id}`,
      title: featureItem.name ?? "Concierge Pick of the Week",
      description:
        "Curated by your mentor to keep gifting beautifully coordinated. Tap through to explore details.",
      badge: "Affiliate Perk",
      href: "/dashboard/plan",
      ctaLabel: "View perk",
    });
  }

  return cards;
}
