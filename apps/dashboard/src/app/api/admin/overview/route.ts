export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiFetch } from "@/lib/apiClient";

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const headers = { Authorization: `Bearer ${session.token}` };

  const [postsResult, eventsResult, announcementsResult, mentorsResult] = await Promise.allSettled([
    apiFetch<{ posts?: Array<{ id: string; title: string; createdAt: string }> }>("/api/community/posts", { headers }),
    apiFetch<{ events?: Array<{ id: string; title: string; startsAt: string | null }> }>("/api/events/upcoming", {
      headers,
    }),
    apiFetch<{ announcements?: Array<{ id: string; title: string; createdAt: string }> }>("/api/announcements", {
      headers,
    }),
    apiFetch<{ mentors?: Array<{ id: string; email: string }> }>("/api/profiles/mentors", { headers }),
  ]);

  const posts =
    postsResult.status === "fulfilled" && Array.isArray(postsResult.value.posts)
      ? postsResult.value.posts
      : [];
  const events =
    eventsResult.status === "fulfilled" && Array.isArray(eventsResult.value.events)
      ? eventsResult.value.events
      : [];
  const announcements =
    announcementsResult.status === "fulfilled" && Array.isArray(announcementsResult.value.announcements)
      ? announcementsResult.value.announcements
      : [];
  const mentors =
    mentorsResult.status === "fulfilled" && Array.isArray(mentorsResult.value.mentors)
      ? mentorsResult.value.mentors
      : [];

  return NextResponse.json({
    posts,
    events,
    announcements,
    mentors,
  });
}
