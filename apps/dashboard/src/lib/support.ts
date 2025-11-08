export type SupportAnnouncement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type SupportPoll = {
  id: string;
  question: string;
  category: string;
  isActive: boolean;
  closesAt?: string | null;
};

export type SupportOverview = {
  announcements: SupportAnnouncement[];
  polls: SupportPoll[];
};

export async function fetchSupportOverview(): Promise<SupportOverview> {
  try {
    const response = await fetch("/api/support/requests", {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Support overview failed (${response.status})`);
    }

    const payload = (await response.json()) as Partial<SupportOverview>;
    return {
      announcements: payload.announcements ?? [],
      polls: payload.polls ?? [],
    };
  } catch (error) {
    console.error("fetchSupportOverview failed", error);
    return { announcements: [], polls: [] };
  }
}
