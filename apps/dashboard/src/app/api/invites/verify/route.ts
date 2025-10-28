import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code } = (await request.json()) as { code?: string };

    const normalizedCode = code?.toUpperCase().trim();
    if (!normalizedCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    const invite = await prisma.invite.findUnique({
      where: { code: normalizedCode },
    });

    const inviteStatus = (invite as { status?: string | null } | null)?.status ?? null;

    if (!invite || inviteStatus !== "approved") {
      return NextResponse.json(
        { error: "That invite code isn’t recognized — please try again or request a new invite." },
        { status: 400 }
      );
    }

    await prisma.invite.update({
      where: { code: normalizedCode },
      data: { status: "used" },
    });

    return NextResponse.json({ code: normalizedCode });
  } catch (error) {
    console.error("Invite verification failed:", error);
    return NextResponse.json({ error: "Unable to verify invite code" }, { status: 500 });
  }
}
