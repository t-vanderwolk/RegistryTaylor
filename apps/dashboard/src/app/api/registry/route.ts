import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBabylistConnection, listCatalogItems, mergeAffiliateFeeds } from "@/lib/server/registryStore";
import { filterRegistryItems, loadAffiliateFeed } from "@/utils/registryLoaders";
import type { RegistrySource } from "@/types/registry";

const AFFILIATE_SOURCES: RegistrySource[] = ["macro", "silvercross", "awin", "cj"];
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const categoryParam = url.searchParams.get("category");
  const sourceParam = url.searchParams.get("source");
  const queryUserId = url.searchParams.get("userId");

  const session = await getSession();
  const userId = queryUserId ?? session?.user?.id ?? null;

  const hasBabylistConnection = userId ? Boolean(getBabylistConnection(userId)) : false;

  const requestedSources = sourceParam
    ? (sourceParam
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => {
          if (
            ["macro", "silvercross", "awin", "cj", "myregistry", "babylist", "impact", "static"].includes(
              value
            )
          ) {
            return value as RegistrySource;
          }
          return null;
        })
        .filter((value): value is RegistrySource => value !== null) as RegistrySource[])
    : ([
        ...AFFILIATE_SOURCES,
        ...(userId ? (["myregistry", ...(hasBabylistConnection ? ["babylist"] : [])] as RegistrySource[]) : []),
      ] as RegistrySource[]);

  const affiliateSources = requestedSources.filter(
    (source): source is Exclude<RegistrySource, "myregistry" | "babylist"> =>
      source !== "myregistry" && source !== "babylist"
  );

  const affiliateItems = (
    await Promise.all(affiliateSources.map((source) => loadAffiliateFeed(source).catch(() => [])))
  ).flat();

  let combined = await mergeAffiliateFeeds(userId, affiliateItems);

  if (!userId) {
    const existing = new Set(combined.map((item) => item.id));
    listCatalogItems().forEach((item) => {
      if (!existing.has(item.id)) {
        combined.push(item);
      }
    });
  }

  const filtered = filterRegistryItems(combined, {
    category: categoryParam,
    source: requestedSources,
  });

  return NextResponse.json({
    items: filtered,
    meta: {
      userId,
      sources: requestedSources,
      category: categoryParam ?? null,
    },
  });
}
