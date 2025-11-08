export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

type InviteRequestBody = {
  name?: string;
  email?: string;
  dueDate?: string | null;
  message?: string | null;
};

type NormalizedInviteRequest = {
  name: string;
  email: string;
  dueDate: string | null;
  message: string | null;
  submittedAt: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InviteRequestBody;
    const normalized = normalizeBody(body);

    if (!normalized) {
      return NextResponse.json(
        { error: "Name and valid email are required." },
        { status: 400 }
      );
    }

    await deliverInviteRequest(normalized);

    return NextResponse.json({ status: "submitted" }, { status: 201 });
  } catch (error) {
    console.error("Unable to submit invite request:", error);
    return NextResponse.json(
      { error: "Unable to submit invite request right now." },
      { status: 500 }
    );
  }
}

function normalizeBody(body: InviteRequestBody | null): NormalizedInviteRequest | null {
  if (!body) return null;

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const rawMessage = body.message ? String(body.message).trim() : "";
  const rawDueDate = body.dueDate ? String(body.dueDate).trim() : "";

  if (!name || !email || !EMAIL_REGEX.test(email)) {
    return null;
  }

  const parsedDueDate = rawDueDate && !Number.isNaN(Date.parse(rawDueDate)) ? rawDueDate : null;

  return {
    name,
    email,
    dueDate: parsedDueDate,
    message: rawMessage ? rawMessage.slice(0, 1000) : null,
    submittedAt: new Date().toISOString(),
  };
}

async function deliverInviteRequest(payload: NormalizedInviteRequest): Promise<void> {
  const webhookUrl =
    process.env.INVITE_REQUEST_WEBHOOK_URL ||
    process.env.SLACK_WEBHOOK_URL ||
    process.env.REQUEST_INVITE_WEBHOOK_URL ||
    null;

  if (!webhookUrl) {
    console.info("Invite request captured (no webhook configured):", payload);
    return;
  }

  const webhookBody = {
    text: [
      `✨ New invite request`,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.dueDate ? `Due date: ${payload.dueDate}` : null,
      payload.message ? `Message: ${payload.message}` : null,
      `Submitted: ${payload.submittedAt}`,
    ]
      .filter(Boolean)
      .join("\n"),
    payload,
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webhookBody),
  });

  if (!response.ok) {
    throw new Error(`Invite request webhook failed with status ${response.status}`);
  }
}
