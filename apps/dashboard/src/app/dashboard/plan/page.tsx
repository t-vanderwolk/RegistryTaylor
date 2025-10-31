import type { Metadata } from "next";
import Image from "next/image";
import { requireMember } from "@/lib/auth";
import { getRegistryItems } from "@/lib/registry";
import { getRegistrySourceMeta } from "@/lib/registryMeta";
import type { RegistryItem } from "@/types/registry";

type PlanPageProps = {
  searchParams: {
    error?: string;
  };
};

export const metadata: Metadata = {
  title: "Registry Planner",
  description: "Curate a concierge-level registry with Taylor’s dynamic recommendations.",
};

function uniqueCategories(items: RegistryItem[]): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    if (!item.category) {
      return;
    }
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  });
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

function formatPrice(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "Concierge priced";
  }
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${value}`;
  }
}

export default async function PlanPage({ searchParams }: PlanPageProps) {
  await requireMember();
  const items = await getRegistryItems();
  const categories = uniqueCategories(items);
  const hasError = searchParams.error === "registry";

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Plan</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Your concierge-crafted registry
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          These items evolve as you complete modules and journal prompts. Each card is sourced via MacroBaby with our
          affiliate tracking automatically applied so gifting stays organized and concierge-ready.
        </p>
      </section>

      {hasError && (
        <div className="rounded-[2rem] border border-[#D97373]/40 bg-[#FFF5F4] p-5 text-sm text-[#5C2E2E] shadow-[0_18px_40px_rgba(217,115,115,0.18)]">
          <p className="font-semibold">We couldn’t add that item automatically.</p>
          <p className="mt-1">
            Try again or let concierge know and we’ll sync it manually. Everything else in your registry is safe and up to
            date.
          </p>
        </div>
      )}

      <section className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Categories</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Where concierge is focusing</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            Request new category →
          </button>
        </header>
        <div className="mt-6 grid gap-4 text-sm text-[#3E2F35]/70 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="rounded-[1.8rem] border border-[#C8A1B4]/30 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-5 shadow-inner"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#3E2F35]">{category.name}</span>
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
                  {category.count} items
                </span>
              </div>
              <p className="mt-3 text-xs text-[#3E2F35]/60">
                Tailored by mentor insights and your questionnaire. Add personal finds to keep gifting aligned.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Recommendations</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Taylor-approved essentials</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_30px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.4)]"
          >
            Share with mentor →
          </button>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => {
            const sourceMeta = getRegistrySourceMeta(item.registrySource);
            return (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(200,161,180,0.22)]"
              >
                <div className="relative overflow-hidden rounded-[1.8rem] border border-[#C8A1B4]/25 bg-white">
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border bg-[#FFFAF8]/90 px-3 py-1 text-xs font-semibold text-[#3E2F35]">
                    <span>{sourceMeta.icon}</span>
                    <span>{sourceMeta.label}</span>
                  </div>
                  <div className="absolute right-4 top-4 rounded-full border border-[#C8A1B4]/50 bg-[#FFFAF8]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                    {item.category ?? "Concierge pick"}
                  </div>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={800}
                      height={340}
                      className="h-52 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-[#FFFAF8] text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
                      Concierge preview
                    </div>
                  )}
                </div>
                <header>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
                    {item.brand ?? sourceMeta.retailer}
                  </p>
                  <h3 className="mt-2 font-[var(--font-playfair)] text-xl text-[#3E2F35]">{item.name}</h3>
                </header>
                <p className="text-sm text-[#3E2F35]/70">
                  {item.description ?? "We’ll add concierge notes shortly to guide gifting."}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#3E2F35]/70">
                  <span className="font-semibold text-[#3E2F35]">{formatPrice(item.price)}</span>
                  <span className="rounded-full bg-[#FFFAF8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                    {item.retailer ?? sourceMeta.retailer}
                  </span>
                </div>
                <div className="mt-auto flex flex-wrap gap-3">
                  {item.affiliateUrl ? (
                    <a
                      href={item.affiliateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#3E2F35] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#C8A1B4]"
                    >
                      View Offer →
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                  >
                    Flag for gifting
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
