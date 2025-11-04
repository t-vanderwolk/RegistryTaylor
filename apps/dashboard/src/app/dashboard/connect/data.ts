import { apiFetch } from "@/lib/apiClient";

export type AnnouncementCard = {
  id: string;
  title: string;
  summary: string;
  authorRole: "Mentor" | "Admin" | "Member";
  createdAt: string;
  cta?: {
    label: string;
    href: string;
  };
};

export type FeedCategory = "All" | "Mentor Insight" | "Parent Reflection";

export type CommunityFeedPost = {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  tags: string[];
  createdAt: string;
  author: {
    displayName: string;
    role: "Mentor" | "Admin" | "Member";
  };
  category: FeedCategory | "Announcement";
  reactions: {
    heart: number;
    clap: number;
    comment: number;
  };
  comments: Array<{
    id: string;
    author: string;
    body: string;
    createdAt: string;
  }>;
};

export type ConnectEvent = {
  id: string;
  title: string;
  description?: string | null;
  startsAt: string | null;
  startsAtLabel?: string;
  location?: string | null;
  attendeeCount?: number;
};

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type WeeklyPoll = {
  id: string;
  question: string;
  description?: string;
  category: "Baby Prep" | "Emotional Wellness" | "Fun & Nostalgic";
  closesAt?: string;
  options: PollOption[];
};

type ApiCommunityPost = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
    role: "MEMBER" | "MENTOR" | "ADMIN";
  };
};

type ApiCommunityPostsResponse = {
  posts: ApiCommunityPost[];
};

type ApiEventsResponse = {
  events: Array<{
    id: string;
    title: string;
    description: string | null;
    startsAt: string;
    location: string;
    rsvps: Array<{
      id: string;
      status: "GOING" | "INTERESTED" | "DECLINED";
    }>;
  }>;
};

const FALLBACK_ANNOUNCEMENTS: AnnouncementCard[] = [
  {
    id: "atelier-refresh",
    title: "Studio salon schedule refresh",
    summary: "New atelier hours begin next week with added evening mentor salons to accommodate working parents.",
    authorRole: "Admin",
    createdAt: new Date().toISOString(),
    cta: { label: "View full calendar", href: "/dashboard/events" },
  },
  {
    id: "registry-drops",
    title: "Registry drops shipping concierge",
    summary: "Mentor Jordan is coordinating weekly shipment reviews. Drop your tracking numbers before Friday at noon.",
    authorRole: "Mentor",
    createdAt: new Date().toISOString(),
    cta: { label: "Message mentor", href: "/dashboard/member" },
  },
  {
    id: "fourth-trimester",
    title: "Fourth trimester care circle",
    summary: "Doula Lola is leading Sunday’s slow studio circle with new postpartum rituals and movement prompts.",
    authorRole: "Mentor",
    createdAt: new Date().toISOString(),
    cta: { label: "Save your spot", href: "/dashboard/connect#events" },
  },
];

const FALLBACK_COMMUNITY_POSTS: CommunityFeedPost[] = [
  {
    id: "nursery-design",
    title: "Nursery mood board swap",
    body: "Share the colors, textiles, or textures that are lighting you up this month. Upload swatches or inspo clips—Avery is spotlighting a member board during Friday’s studio salon.",
    excerpt:
      "Share the colors, textiles, or textures that are lighting you up this month. Upload swatches or inspo clips for Avery’s Friday salon.",
    tags: ["nursery", "design lab"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: { displayName: "Avery", role: "Mentor" },
    category: "Mentor Insight",
    reactions: { heart: 18, clap: 9, comment: 6 },
    comments: [
      {
        id: "comment-nursery-1",
        author: "Jules",
        body: "Pinning our terracotta + sage palette! Will bring samples to the salon.",
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      },
      {
        id: "comment-nursery-2",
        author: "Maya",
        body: "We just layered the Lulu & Georgia rug Avery recommended—game changer.",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "stroller-labs",
    title: "Stroller field notes",
    body: "Gear Journey alumni are sharing real-world observations on UPPAbaby vs. Nuna systems, including travel hacks. Add your footage or quick wins before Thursday’s drop-in.",
    excerpt:
      "Gear Journey alumni are sharing real-world observations on UPPAbaby vs. Nuna systems—plus travel system hacks.",
    tags: ["gear", "mobility"],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author: { displayName: "Taylor Circle", role: "Mentor" },
    category: "Mentor Insight",
    reactions: { heart: 26, clap: 11, comment: 8 },
    comments: [
      {
        id: "comment-stroller-1",
        author: "Lena",
        body: "Adding a clip on fan rec changed our park walks. Linking in the thread.",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "fourth-trimester-circle",
    title: "Fourth trimester rituals check-in",
    body: "Bring the rituals helping you soften into recovery. Lola is curating a grounding playlist—share breathwork tracks or recipes you are loving.",
    excerpt:
      "Bring the rituals helping you soften into recovery. Lola is curating a grounding playlist with member favorites.",
    tags: ["postpartum", "rituals"],
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    author: { displayName: "Lola", role: "Mentor" },
    category: "Mentor Insight",
    reactions: { heart: 34, clap: 18, comment: 14 },
    comments: [
      {
        id: "comment-fourth-1",
        author: "Amara",
        body: "Adding our golden milk recipe—it helped so much last month.",
        createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "comment-fourth-2",
        author: "Priya",
        body: "Linking the breathwork track from our doula playlist. Instant reset.",
        createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "member-reflection",
    title: "Morning ritual wins",
    body: "We finalized our sunrise tea ritual and it is finally sticking. Sharing the three prompts that help us reset on the tough mornings.",
    excerpt:
      "We finalized our sunrise tea ritual and it is finally sticking—here are the prompts keeping us grounded.",
    tags: ["reflection", "morning"],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: { displayName: "Morgan", role: "Member" },
    category: "Parent Reflection",
    reactions: { heart: 12, clap: 5, comment: 4 },
    comments: [
      {
        id: "comment-ritual-1",
        author: "Gia",
        body: "Printing these prompts for our nurserys nook board!",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

const FALLBACK_EVENTS: ConnectEvent[] = [
  {
    id: "mentor-salon",
    title: "Mentor salon · Week 18",
    description: "Live concierge Q&A with nursery stylist Mia & registry strategist Jordan.",
    startsAt: null,
    startsAtLabel: "Tuesday · 11:00 AM ET",
    location: "Virtual Studio",
    attendeeCount: 18,
  },
  {
    id: "design-lab",
    title: "Design lab · Custom nursery palette",
    description: "Swap palettes, shop links, and meet our featured member mood board.",
    startsAt: null,
    startsAtLabel: "Thursday · 8:00 PM ET",
    location: "Gather Studio",
    attendeeCount: 22,
  },
  {
    id: "community-circle",
    title: "Fourth trimester care circle",
    description: "Guided reflection with Lola plus journaling prompts and breathwork.",
    startsAt: null,
    startsAtLabel: "Sunday · 4:00 PM ET",
    location: "Slow Studio",
    attendeeCount: 15,
  },
];

const FALLBACK_WEEKLY_POLL: WeeklyPoll = {
  id: "poll-weekly",
  question: "Which ritual is grounding you this trimester?",
  description: "Vote anonymously and see what other members are leaning into this week.",
  category: "Emotional Wellness",
  closesAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  options: [
    { id: "option1", label: "Sunrise stretch + tea", votes: 28 },
    { id: "option2", label: "Evening bath soak reset", votes: 19 },
    { id: "option3", label: "Audio journal check-in", votes: 32 },
    { id: "option4", label: "Mentor-led breathwork", votes: 24 },
  ],
};

const ANNOUNCEMENT_TAGS = ["announcement", "announcements", "connect-updates"];

function deriveDisplayName(email: string): string {
  const namePart = email.split("@")[0] ?? "";
  if (!namePart) {
    return "Community Member";
  }
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function mapRole(role: "MEMBER" | "MENTOR" | "ADMIN"): "Mentor" | "Admin" | "Member" {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "MENTOR":
      return "Mentor";
    default:
      return "Member";
  }
}

function resolveCategory(role: "Mentor" | "Admin" | "Member", tags: string[]): CommunityFeedPost["category"] {
  const hasAnnouncementTag = tags.some((tag) => ANNOUNCEMENT_TAGS.includes(tag.toLowerCase()));
  if (hasAnnouncementTag || role === "Admin") {
    return "Announcement";
  }
  if (role === "Mentor") {
    return "Mentor Insight";
  }
  return "Parent Reflection";
}

function toAnnouncement(cardSource: CommunityFeedPost): AnnouncementCard {
  return {
    id: cardSource.id,
    title: cardSource.title,
    summary: cardSource.excerpt,
    authorRole: cardSource.author.role,
    createdAt: cardSource.createdAt,
    cta: cardSource.tags.includes("event")
      ? { label: "View event details", href: "/dashboard/events" }
      : undefined,
  };
}

async function fetchCommunityPosts(): Promise<CommunityFeedPost[]> {
  try {
    const data = await apiFetch<ApiCommunityPostsResponse>("/api/community/posts", {
      cache: "no-store",
      credentials: "include",
    });

    if (!data?.posts?.length) {
      return FALLBACK_COMMUNITY_POSTS;
    }

    return data.posts.map((post) => {
      const role = mapRole(post.author.role);
      const category = resolveCategory(role, post.tags ?? []);
      return {
        id: post.id,
        title: post.title,
        body: post.body,
        excerpt: post.body.slice(0, 180),
        tags: post.tags ?? [],
        createdAt: post.createdAt,
        author: {
          displayName: deriveDisplayName(post.author.email),
          role,
        },
        category,
        reactions: { heart: 0, clap: 0, comment: 0 },
        comments: [],
      } satisfies CommunityFeedPost;
    });
  } catch (error) {
    console.error("Failed to load community posts", error);
    return FALLBACK_COMMUNITY_POSTS;
  }
}

async function fetchUpcomingEvents(): Promise<ConnectEvent[]> {
  try {
    const data = await apiFetch<ApiEventsResponse>("/api/events/upcoming", {
      cache: "no-store",
      credentials: "include",
    });

    if (!data?.events?.length) {
      return FALLBACK_EVENTS;
    }

    return data.events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startsAt: event.startsAt,
      location: event.location,
      attendeeCount: event.rsvps.filter((rsvp) => rsvp.status === "GOING").length,
    }));
  } catch (error) {
    console.error("Failed to load upcoming events", error);
    return FALLBACK_EVENTS;
  }
}

async function fetchWeeklyPoll(): Promise<WeeklyPoll> {
  return FALLBACK_WEEKLY_POLL;
}

export async function getConnectContent(): Promise<{
  announcements: AnnouncementCard[];
  feedPosts: CommunityFeedPost[];
  events: ConnectEvent[];
  poll: WeeklyPoll;
}> {
  const [posts, events, poll] = await Promise.all([
    fetchCommunityPosts(),
    fetchUpcomingEvents(),
    fetchWeeklyPoll(),
  ]);

  const announcements = posts
    .filter((post) => post.category === "Announcement")
    .map(toAnnouncement)
    .slice(0, 3);

  const feedPosts = posts.filter((post) => post.category !== "Announcement");

  return {
    announcements: announcements.length > 0 ? announcements : FALLBACK_ANNOUNCEMENTS,
    feedPosts,
    events,
    poll,
  };
}
