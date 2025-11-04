import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listCatalogItems, getRegistryItems } from "@/lib/server/registryStore";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const externalId = searchParams.get("externalId");

  if (!productId && !externalId) {
    return NextResponse.json({ item: null }, { status: 400 });
  }

  const catalog = listCatalogItems();
  const catalogMatch = externalId
    ? catalog.find((candidate) => candidate.externalId === externalId || candidate.id === externalId)
    : null;

  if (catalogMatch) {
    return NextResponse.json({
      item: {
        title: catalogMatch.name,
        description: catalogMatch.description,
        image: catalogMatch.image,
        url: catalogMatch.affiliateUrl ?? catalogMatch.url ?? undefined,
        price: catalogMatch.price ?? null,
        retailer: catalogMatch.retailer ?? null,
      },
    });
  }

  if (productId) {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ item: null }, { status: 401 });
    }
    const owned = await getRegistryItems(session.user.id);
    const ownedMatch = owned.find((candidate) => candidate.id === productId || candidate.externalId === productId);
    if (ownedMatch) {
      return NextResponse.json({
        item: {
          title: ownedMatch.name,
          description: ownedMatch.description ?? null,
          image: ownedMatch.image ?? undefined,
          url: ownedMatch.affiliateUrl ?? ownedMatch.url ?? undefined,
          price: ownedMatch.price ?? null,
          retailer: ownedMatch.retailer ?? null,
        },
      });
    }
  }

  return NextResponse.json({ item: null }, { status: 404 });
}
