export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

type RsvpPayload = {
  eventId: string;
  status?: "GOING" | "INTERESTED" | "DECLINED";
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RsvpPayload;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    const response = await apiFetch<{ rsvp: unknown }>("/api/events/rsvp", {
      method: "POST",
      body: JSON.stringify(body),
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update RSVP.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
