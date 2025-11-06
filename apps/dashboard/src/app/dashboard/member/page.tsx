import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import WeeklyOverview from "@/components/dashboard/WeeklyOverview";
import ConciergeBookings from "@/components/dashboard/ConciergeBookings";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import CommunityPreview from "@/components/dashboard/CommunityPreview";
import NavigationCards from "@/components/dashboard/NavigationCards";
import { apiFetch } from "@/lib/apiClient";
import { getMemberToken, requireMember } from "@/lib/auth";

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

  const [profileResult, eventsResult, communityResult] = await Promise.allSettled([
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
  ]);

  const profileResponse = profileResult.status === "fulfilled" ? profileResult.value : null;
  const eventsResponse = eventsResult.status === "fulfilled" ? eventsResult.value : null;
  const communityResponse =
    communityResult.status === "fulfilled" ? communityResult.value : null;

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

  return (
    <div className="min-h-screen bg-[#FFFAF8]">
      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.64fr)_minmax(0,0.36fr)]">
          <div className="space-y-16">
            <WelcomeHeader
              firstName={firstName}
              membershipTier="Signature Taylor-Made"
              mentorName={mentorName}
            />
            <WeeklyOverview events={weeklyEvents} />
            <ConciergeBookings
              bookings={bookings}
              mentorId={mentorId}
              mentorName={mentorName}
              memberName={firstName}
            />
            <NavigationCards />
          </div>
          <div className="space-y-16">
            <MessagesPanel mentorId={mentorId} mentorName={mentorName} memberName={firstName} />
            <CommunityPreview posts={communityPosts} />
          </div>
        </div>
      </main>
    </div>
  );
}
