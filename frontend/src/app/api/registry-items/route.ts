export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getSession, requireMember } from "@/lib/auth";
import {
  addRegistryItem,
  deleteRegistryItem,
  getRegistryItems,
  updateRegistryItem,
} from "@/lib/server/registryStore";

function parsePrice(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numeric = Number.parseFloat(String(value));
  return Number.isFinite(numeric) ? numeric : null;
}

export async function GET() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ items: [] });
  }

  const items = await getRegistryItems(userId);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const user = await requireMember();
  const payload = await request.json();

  if (!payload?.name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const item = await addRegistryItem({
    userId: user.id,
    name: String(payload.name),
    brand: payload.brand ?? null,
    price: parsePrice(payload.price),
    url: payload.url ?? null,
    retailer: payload.retailer ?? null,
    category: payload.category ?? null,
    image: payload.image ?? null,
    description: payload.description ?? null,
    affiliateUrl: payload.affiliateUrl ?? null,
    affiliateId: payload.affiliateId ?? null,
    externalId: payload.externalId ?? null,
    source: payload.source ?? "static",
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await requireMember();
  const payload = await request.json();

  const id = payload?.id ? String(payload.id) : null;
  if (!id) {
    return NextResponse.json({ error: "Item id is required." }, { status: 400 });
  }

  const owned = await getRegistryItems(user.id);
  if (!owned.some((item) => item.id === id)) {
    return NextResponse.json({ error: "Registry item not found." }, { status: 404 });
  }

  const item = await updateRegistryItem(id, {
    name: payload.name,
    brand: payload.brand ?? null,
    price: payload.price !== undefined ? parsePrice(payload.price) : undefined,
    url: payload.url ?? undefined,
    retailer: payload.retailer ?? undefined,
    category: payload.category ?? undefined,
    image: payload.image ?? undefined,
    description: payload.description ?? undefined,
    affiliateUrl: payload.affiliateUrl ?? undefined,
    affiliateId: payload.affiliateId ?? undefined,
    externalId: payload.externalId ?? undefined,
    // source: payload.source ?? undefined,
  });

  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const user = await requireMember();
  const payload = await request.json();
  const id = payload?.id ? String(payload.id) : null;

  if (!id) {
    return NextResponse.json({ error: "Item id is required." }, { status: 400 });
  }

  const owned = await getRegistryItems(user.id);
  if (!owned.some((item) => item.id === id)) {
    return NextResponse.json({ error: "Registry item not found." }, { status: 404 });
  }

  await deleteRegistryItem(id);
  return NextResponse.json({ ok: true });
}
