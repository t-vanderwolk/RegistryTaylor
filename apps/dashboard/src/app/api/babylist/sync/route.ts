import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { upsertBabylistItems } from "@/lib/server/registryStore";

type BabylistFeedItem = {
  id?: string;
  external_id?: string;
  name?: string;
  title?: string;
  brand?: string | null;
  price?: number | string | null;
  price_display?: string | null;
  image?: string | null;
  image_url?: string | null;
  url?: string | null;
  link?: string | null;
  category?: string | null;
};

type BabylistFeedResponse = {
  items?: BabylistFeedItem[];
};

function parsePrice(value: number | string | null | undefined): number | string | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return null;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";

  if (!username) {
    return NextResponse.json({ error: "Missing Babylist username" }, { status: 400 });
  }

  const feedUrl = `https://www.babylist.com/${encodeURIComponent(username)}.json`;

  let payload: BabylistFeedResponse | BabylistFeedItem[] | null = null;
  try {
    const response = await fetch(feedUrl, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Babylist responded with ${response.status}`);
    }
    payload = (await response.json()) as BabylistFeedResponse | BabylistFeedItem[];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch Babylist registry. Check the username and try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const itemsArray = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];

  if (!itemsArray.length) {
    return NextResponse.json(
      { error: "We could not find items for that Babylist profile.", items: [] },
      { status: 400 }
    );
  }

  const normalized = itemsArray.map((item) => ({
    externalId: item.external_id ?? item.id ?? item.url ?? item.link ?? item.name ?? item.title ?? "",
    name: item.name ?? item.title ?? "Babylist Registry Item",
    brand: item.brand ?? null,
    price: parsePrice(item.price ?? item.price_display ?? null),
    image: item.image ?? item.image_url ?? null,
    link: item.url ?? item.link ?? null,
    category: item.category ?? null,
  }));

  const items = await upsertBabylistItems(userId, normalized, username);

  return NextResponse.json({
    syncedAt: new Date().toISOString(),
    items,
  });
}
