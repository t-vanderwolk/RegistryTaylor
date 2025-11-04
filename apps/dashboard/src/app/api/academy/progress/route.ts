import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";
import { getMemberToken } from "@/lib/auth";
import { getAcademyModules } from "@/lib/academy";

function normalizePercent(value: unknown, fallback = 0): number {
  if (typeof value !== "number") {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return clampPercent(numeric);
  }
  return clampPercent(value);
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export async function GET(request: Request) {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("moduleSlug") ?? url.searchParams.get("slug");

  const modules = await getAcademyModules();
  if (slug) {
    const moduleEntry = modules.find((module) => module.slug === slug);
    return NextResponse.json(
      {
        progress: moduleEntry?.progress ?? { percentComplete: 0, completed: false },
      },
      { status: moduleEntry ? 200 : 404 }
    );
  }

  const progress = modules.map((module) => ({
    slug: module.slug,
    moduleId: module.id,
    percentComplete: module.progress?.percentComplete ?? 0,
    completed: module.progress?.completed ?? false,
  }));

  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  const token = await getMemberToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { moduleSlug?: string; moduleId?: string; percent?: number };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload?.moduleSlug && !payload?.moduleId) {
    return NextResponse.json(
      { error: "moduleSlug or moduleId is required." },
      { status: 400 }
    );
  }

  const percent = normalizePercent(payload.percent, 100);

  const response = await apiFetch<{
    progress: { percent: number | null };
  }>("/api/academy/progress", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      moduleSlug: payload.moduleSlug,
      moduleId: payload.moduleId,
      percent,
    }),
  });

  const normalizedPercent = normalizePercent(response?.progress?.percent, percent);

  return NextResponse.json({
    progress: {
      percentComplete: normalizedPercent,
      completed: normalizedPercent >= 100,
    },
  });
}
