export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Route } from "next";
import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";
import { getSession, verifyUserFromToken, type AuthenticatedUser } from "@/lib/auth";
import { MEMBER_DASHBOARD_ROUTES } from "@/constants/memberDashboardRoutes";
import type { WorkbookEntry } from "@/app/dashboard/academy/workbook/workbookApi";
import type {
  AnnouncementCardData,
  CommunityHighlightCard,
  MemberDashboardPayload,
  QuickAccessData,
  ReflectionEntryCard,
  RegistryItemSummary,
} from "@/app/dashboard/member/types";
import type { AcademyModule } from "@/types/academy";

type ApiProfileResponse = {
  profile?: {
    conciergePriority?: string | null;
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

function getTokenFromRequest(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim() || null;
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const bearerToken = getTokenFromRequest(request);
    let tokenToUse: string | null = null;
    let member: AuthenticatedUser | null = null;

    if (bearerToken) {
      tokenToUse = bearerToken;
      member = await verifyUserFromToken(bearerToken);
    } else {
      const session = await getSession();
      if (session) {
        tokenToUse = session.token;
        member = session.user;
      }
    }

    if (!tokenToUse || !member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (member.role !== "MEMBER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const authHeaders = {
      Authorization: `Bearer ${tokenToUse}`,
      Cookie: `token=${tokenToUse}`,
    };

    const hasRegistryEnv = Boolean(process.env.MYREGISTRY_API_KEY && process.env.MYREGISTRY_USER_ID);

    const [profileResult, eventsResult, communityResult, modulesResult, reflectionsResult] =
      await Promise.allSettled([
        apiFetch<ApiProfileResponse>("/api/profiles/me", {
          cache: "no-store",
          credentials: "include",
          headers: authHeaders,
        }),
        apiFetch<ApiEventsResponse>("/api/events/upcoming", {
          cache: "no-store",
          credentials: "include",
          headers: authHeaders,
        }),
        apiFetch<ApiCommunityPostsResponse>("/api/community/posts", {
          cache: "no-store",
          credentials: "include",
          headers: authHeaders,
        }),
        apiFetch<ModulesResponse>("/api/academy/modules", {
          cache: "no-store",
          credentials: "include",
          headers: authHeaders,
        }),
        apiFetch<{ entries?: WorkbookEntry[] }>(`/api/workbook/${member.id}`, {
          cache: "no-store",
          credentials: "include",
          headers: authHeaders,
        }),
      ]);

    const profileResponse = profileResult.status === "fulfilled" ? profileResult.value : null;
    const eventsResponse = eventsResult.status === "fulfilled" ? eventsResult.value : null;
    const communityResponse = communityResult.status === "fulfilled" ? communityResult.value : null;
    const modules = modulesResult.status === "fulfilled" ? modulesResult.value.modules ?? [] : [];
    const workbookEntries =
      reflectionsResult.status === "fulfilled" ? reflectionsResult.value.entries ?? [] : [];

    let registryItems: RegistryItemSummary[] = [];
    if (hasRegistryEnv) {
      try {
        const response = await apiFetch<RegistryItemsResponse>("/api/registry-items", {
          cache: "no-store",
          credentials: "include",
          headers: authHeaders,
        });
        registryItems = response.items ?? [];
      } catch (registryError) {
        console.warn(
          "member-dashboard: registry unavailable in this environment; returning empty registry."
        );
        console.error(registryError);
      }
    } else {
      console.warn(
        "member-dashboard: MYREGISTRY credentials not configured; returning empty registry results."
      );
    }

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

    const reflectionExcerpt = latestReflection ? extractReflectionExcerpt(latestReflection) : null;

    const reflectionEntries: ReflectionEntryCard[] = workbookEntries.slice(0, 4).map((entry) => ({
      id: entry.id,
      title: findModuleTitle(entry.moduleSlug, modules),
      excerpt: extractReflectionExcerpt(entry) ?? "A new reflection is waiting to be written.",
      createdAt: entry.updatedAt ?? entry.createdAt,
      shared: entry.shared,
    }));

    const communityHighlights: CommunityHighlightCard[] = communityPosts.map((post) => ({
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

    const quickAccess: QuickAccessData = {
      academy: {
        percentComplete,
        nextTitle: nextModule?.title ?? null,
        href: buildLearnModuleRoute(nextModule?.slug),
      },
      registry: {
        itemsAdded: registryItems.length,
        goalCount: registryGoal,
        href: MEMBER_DASHBOARD_ROUTES.registryHub as Route,
      },
      reflection: {
        excerpt: reflectionExcerpt,
        updatedAt: latestReflection?.updatedAt ?? latestReflection?.createdAt ?? null,
        href: MEMBER_DASHBOARD_ROUTES.journal as Route,
      },
      mentor: {
        title: mentorMoment?.title ?? bookings[0]?.title ?? null,
        dateLabel: mentorMoment?.startsAt ?? bookings[0]?.startsAt ?? null,
        href: MEMBER_DASHBOARD_ROUTES.events as Route,
      },
    };

    const progressOverview = {
      totalModules,
      completedModules,
      percentComplete,
      streakDays,
      badges,
    };

    const journalSummary = {
      reflections: reflectionEntries,
      latestExcerpt: reflectionExcerpt,
      lastUpdatedAt: latestReflection?.updatedAt ?? latestReflection?.createdAt ?? null,
    };

    const workbookSummary = {
      entries: reflectionEntries,
      totalEntries: workbookEntries.length,
    };

    const communitySummary = {
      highlights: communityHighlights,
      announcements,
      messages: {
        mentorId,
        mentorName,
        memberName: firstName,
      },
    };

    const eventsSummary = {
      weekly: weeklyEvents,
      bookings,
    };

    const registrySummary = {
      goal: registryGoal,
      items: registryItems,
    };

    const userSummary = {
      id: member.id,
      email: member.email,
      firstName,
      membershipTier: "Signature Taylor-Made",
      currentDate: new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    };

    const profileSummary = {
      mentorId,
      mentorName,
      conciergePriority: profileResponse?.profile?.conciergePriority ?? null,
    };

    const payload: MemberDashboardPayload = {
      user: userSummary,
      profile: profileSummary,
      learn: {
        modules,
        progress: progressOverview,
      },
      quickAccess,
      registry: registrySummary,
      journal: journalSummary,
      workbook: workbookSummary,
      community: communitySummary,
      events: eventsSummary,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("api/member-dashboard GET failed", error);
    return NextResponse.json({ error: "Unable to load member dashboard." }, { status: 500 });
  }
}

function buildLearnModuleRoute(slug?: string | null): Route {
  if (slug) {
    return `/dashboard/member/learn/${slug}` as Route;
  }
  return MEMBER_DASHBOARD_ROUTES.learnWelcome as Route;
}

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
): AnnouncementCardData[] {
  const cards: AnnouncementCardData[] = [];

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
      href: MEMBER_DASHBOARD_ROUTES.events as Route,
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
      href: MEMBER_DASHBOARD_ROUTES.community as Route,
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
      href: MEMBER_DASHBOARD_ROUTES.plan as Route,
      ctaLabel: "View perk",
    });
  }

  return cards;
}
