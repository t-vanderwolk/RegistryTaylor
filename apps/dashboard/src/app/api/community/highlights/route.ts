export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiFetch } from "@/lib/apiClient";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = { Authorization: `Bearer ${session.token}` };

  const [postsResult, eventsResult] = await Promise.allSettled([
    apiFetch<{ posts?: Array<{ id: string; title: string; body: string; createdAt: string; author?: { email: string } }> }>(
      "/api/community/posts",
      { headers },
    ),
    apiFetch<{ events?: Array<{ id: string; title: string; startsAt: string | null; location?: string | null }> }>(
      "/api/events/upcoming",
      { headers },
    ),
  ]);

  const posts =
    postsResult.status === "fulfilled" && Array.isArray(postsResult.value.posts)
      ? postsResult.value.posts
      : [];
  const events =
    eventsResult.status === "fulfilled" && Array.isArray(eventsResult.value.events)
      ? eventsResult.value.events
      : [];

  const highlights = posts.slice(0, 5).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.body.slice(0, 160),
    createdAt: post.createdAt,
    author: post.author?.email ?? "Taylor-Made Mentor",
  }));

  const simplifiedEvents = events.slice(0, 5).map((event) => ({
    id: event.id,
    title: event.title,
    startsAt: event.startsAt,
    location: event.location ?? null,
  }));

  return NextResponse.json({ highlights, events: simplifiedEvents });
}
