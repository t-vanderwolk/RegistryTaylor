import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

export async function POST(request: Request) {
  try {
    const { code } = (await request.json()) as { code?: string };

    const normalizedCode = code?.toUpperCase().trim();
    if (!normalizedCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    let inviteResponse: { invite?: { status?: string | null } } | null = null;
    try {
      inviteResponse = await apiFetch<{ invite?: { status?: string | null } }>(
        `/api/invites/verify/${normalizedCode}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
    } catch {
      return NextResponse.json(
        { error: "That invite code isn’t recognized — please try again or request a new invite." },
        { status: 400 }
      );
    }

    const inviteStatus = inviteResponse?.invite?.status ?? null;

    if (!inviteStatus || inviteStatus === "EXPIRED" || inviteStatus === "ACCEPTED") {
      return NextResponse.json(
        { error: "That invite code isn’t recognized — please try again or request a new invite." },
        { status: 400 }
      );
    }

    return NextResponse.json({ code: normalizedCode });
  } catch (error) {
    console.error("Invite verification failed:", error);
    return NextResponse.json({ error: "Unable to verify invite code" }, { status: 500 });
  }
}
