export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiFetch } from "@/lib/apiClient";
import type { WorkbookEntry } from "@/types/workbook";

type RouteContext = {
  params: {
    moduleSlug: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await apiFetch<{ entry?: WorkbookEntry | null }>(
      `/api/workbook/entry/${params.moduleSlug}`,
      {
        cache: "no-store",
        headers: { Authorization: `Bearer ${session.token}` },
        credentials: "include",
      }
    );

    return NextResponse.json({ entry: data.entry ?? null });
  } catch (error) {
    console.error("Unable to load workbook entry:", error);
    return NextResponse.json({ error: "Unable to load workbook entry." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      content?: unknown;
      shared?: boolean;
    };

    const payload = {
      content: body.content ?? {},
      shared: Boolean(body.shared),
    };

    const data = await apiFetch<{ entry: WorkbookEntry }>(`/api/workbook/entry/${params.moduleSlug}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return NextResponse.json({ entry: data.entry });
  } catch (error) {
    console.error("Unable to save workbook entry:", error);
    return NextResponse.json({ error: "Unable to save workbook entry." }, { status: 500 });
  }
}
