export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const cookieHeader = _request.headers.get("cookie") ?? undefined;

    const data = await apiFetch<{ messages?: Message[] }>(`/api/messages/${params.userId}`, {
      cache: "no-store",
      credentials: "include",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });

    return NextResponse.json(data.messages ?? []);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load messages.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
