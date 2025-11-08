export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

type MessagePayload = {
  receiverId: string;
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MessagePayload;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    const response = await apiFetch<{ message: unknown }>("/api/messages", {
      method: "POST",
      body: JSON.stringify(body),
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
