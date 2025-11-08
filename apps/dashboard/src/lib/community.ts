export type CommunityHighlight = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
};

export type CommunityEvent = {
  id: string;
  title: string;
  startsAt: string | null;
  location: string | null;
};

export type CommunityOverview = {
  highlights: CommunityHighlight[];
  events: CommunityEvent[];
};

export async function fetchCommunityOverview(): Promise<CommunityOverview> {
  try {
    const response = await fetch("/api/community/highlights", {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Community request failed (${response.status})`);
    }

    const payload = (await response.json()) as Partial<CommunityOverview>;
    return {
      highlights: payload.highlights ?? [],
      events: payload.events ?? [],
    };
  } catch (error) {
    console.error("fetchCommunityOverview failed", error);
    return { highlights: [], events: [] };
  }
}
