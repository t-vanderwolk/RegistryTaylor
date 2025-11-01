import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { getCatalogItems, getRegistryItems } from "@/lib/server/registryStore";
import RegistryPlanner from "./RegistryPlanner";
import type { RegistryCatalogItem, RegistryItem, RegistrySource } from "@/types/registry";

export const metadata: Metadata = {
  title: "Registry Planner",
  description: "Curate a concierge-level registry with Taylor’s dynamic recommendations.",
};

export default async function PlanPage() {
  const user = await requireMember();
  const [itemsRaw, catalogRaw] = await Promise.all([getRegistryItems(user.id), getCatalogItems()]);

  const items: RegistryItem[] = itemsRaw.map((item) => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    image: item.image,
    price: item.price,
    affiliateUrl: item.affiliateUrl,
    category: item.category,
    registrySource: item.registrySource,
    affiliateId: item.affiliateId,
    retailer: item.retailer,
    description: item.description,
    externalId: item.externalId,
    importedFrom: item.importedFrom,
    url: item.url,
    mentorNote: item.mentorNote,
  }));

  const catalog: RegistryCatalogItem[] = catalogRaw.map((item) => ({
    id: item.id,
    externalId: item.externalId,
    title: item.title,
    brand: item.brand,
    price: item.price,
    category: item.category,
    image: item.image,
    url: item.url,
    affiliateUrl: item.affiliateUrl,
    retailer: item.retailer,
    source: item.source as RegistrySource,
  }));

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C9B5C9]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(201,181,201,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C9B5C9]/80">Plan</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Taylor-Made Registry Planner
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Manage your private registry, weave in concierge-curated catalog items, and keep gifting beautifully aligned
          with your journey.
        </p>
      </section>

      <RegistryPlanner initialItems={items} catalog={catalog} />
    </div>
  );
}
