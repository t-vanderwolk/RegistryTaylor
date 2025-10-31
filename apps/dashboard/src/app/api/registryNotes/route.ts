import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getRegistryNote,
  listRegistryNotesForUser,
  upsertRegistryNote,
} from "@/lib/server/registryStore";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  const queryUserId = url.searchParams.get("userId");
  const session = await getSession();
  const userId = queryUserId ?? session?.user?.id ?? null;

  if (!userId) {
    return NextResponse.json({ error: "User not specified" }, { status: 400 });
  }

  if (productId) {
    const note = getRegistryNote(userId, productId);
    return NextResponse.json({ note });
  }

  const notes = listRegistryNotesForUser(userId);
  return NextResponse.json({ notes });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const session = await getSession();

  const userId = body?.userId ?? session?.user?.id ?? null;
  const productId = body?.productId;
  const note = typeof body?.note === "string" ? body.note : "";

  if (!userId || !productId) {
    return NextResponse.json({ error: "Missing userId or productId" }, { status: 400 });
  }

  const entry = upsertRegistryNote(userId, productId, note);
  return NextResponse.json({ note: entry });
}
