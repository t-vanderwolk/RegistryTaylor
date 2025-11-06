import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";
import { getMemberToken } from "@/lib/auth";

function buildQuery(moduleId?: string | null, moduleSlug?: string | null): string {
  const params = new URLSearchParams();
  if (moduleId) params.set("moduleId", moduleId);
  if (moduleSlug) params.set("moduleSlug", moduleSlug);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function GET(request: NextRequest) {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const moduleId = request.nextUrl.searchParams.get("moduleId");
  const moduleSlug = request.nextUrl.searchParams.get("moduleSlug");

  if (!moduleId && !moduleSlug) {
    return NextResponse.json(
      { error: "moduleId or moduleSlug is required." },
      { status: 400 }
    );
  }

  const response = await apiFetch(
    `/api/academy/reflection${buildQuery(moduleId, moduleSlug)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const response = await apiFetch("/api/academy/reflection", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return NextResponse.json(response);
}
