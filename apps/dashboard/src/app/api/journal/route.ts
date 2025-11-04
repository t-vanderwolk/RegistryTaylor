import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Placeholder endpoint for saving reflections. In a full implementation this
  // would persist to a journal table or external service.
  try {
    const payload = (await request.json()) as {
      moduleSlug?: string;
      content?: string;
    };

    if (!payload?.content) {
      return NextResponse.json({ ok: false, error: "Missing content" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
