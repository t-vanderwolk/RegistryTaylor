export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiFetch } from "@/lib/apiClient";

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== "MENTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const headers = { Authorization: `Bearer ${session.token}` };

  const [eventsResult, announcementsResult] = await Promise.allSettled([
    apiFetch<{ events?: Array<{ id: string; title: string; startsAt: string | null; location?: string | null }> }>(
      "/api/events/upcoming",
      { headers },
    ),
    apiFetch<{ announcements?: Array<{ id: string; title: string; body: string; createdAt: string }> }>(
      "/api/announcements",
      { headers },
    ),
  ]);

  const events =
    eventsResult.status === "fulfilled" && Array.isArray(eventsResult.value.events)
      ? eventsResult.value.events
      : [];
  const announcements =
    announcementsResult.status === "fulfilled" && Array.isArray(announcementsResult.value.announcements)
      ? announcementsResult.value.announcements
      : [];

  return NextResponse.json({
    events,
    announcements,
  });
}
