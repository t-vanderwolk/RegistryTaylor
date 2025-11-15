export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { requireMember } from "@/lib/auth";
import { addCatalogItemToUserRegistry, getCatalogItems } from "@/lib/server/registryStore";

export async function GET() {
  const catalog = await getCatalogItems();
  return NextResponse.json({ catalog });
}

export async function POST(request: NextRequest) {
  const user = await requireMember();
  const payload = await request.json();
  const catalogId = payload?.catalogId ? String(payload.catalogId) : null;

  if (!catalogId) {
    return NextResponse.json({ error: "catalogId is required" }, { status: 400 });
  }

  const item = await addCatalogItemToUserRegistry(user.id, catalogId);
  return NextResponse.json({ item }, { status: 201 });
}
