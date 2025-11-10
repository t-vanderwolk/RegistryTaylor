export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

type VotePayload = {
  optionId: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { pollId: string } }
) {
  try {
    const body = (await request.json()) as VotePayload;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    const response = await apiFetch<{ option: unknown }>(
      `/api/polls/${params.pollId}/vote`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit vote.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
