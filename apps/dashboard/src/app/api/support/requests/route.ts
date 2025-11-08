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

  const [announcementsResult, pollsResult] = await Promise.allSettled([
    apiFetch<{ announcements?: Array<{ id: string; title: string; body: string; createdAt: string }> }>(
      "/api/announcements",
      { headers },
    ),
    apiFetch<{ polls?: Array<{ id: string; question: string; category: string; isActive: boolean; closesAt?: string | null }> }>(
      "/api/polls?active=true",
      { headers },
    ),
  ]);

  const announcements =
    announcementsResult.status === "fulfilled" && Array.isArray(announcementsResult.value.announcements)
      ? announcementsResult.value.announcements
      : [];
  const polls =
    pollsResult.status === "fulfilled" && Array.isArray(pollsResult.value.polls)
      ? pollsResult.value.polls
      : [];

  return NextResponse.json({
    announcements,
    polls,
  });
}
