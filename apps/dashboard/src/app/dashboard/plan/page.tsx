"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { nunito, playfair, playfairSc, greatVibes } from "@/app/fonts";
import { API_URL } from "@/lib/apiClient";
import { STORED_TOKEN_KEY } from "@/lib/sessionKeys";

type RegistryItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  url: string;
  retailer: string;
  mentorNote: string | null;
};

type ApiRegistryResponse = {
  items?: RegistryItem[];
};

const CATEGORY_FILTERS = ["All", "Nursery", "Gear", "Feeding", "Travel"] as const;
type RegistryFilter = (typeof CATEGORY_FILTERS)[number];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number.isFinite(price) ? price : 0,
  );

const matchesFilter = (item: RegistryItem, filter: RegistryFilter) => {
  if (filter === "All") return true;
  return item.category?.toLowerCase().includes(filter.toLowerCase());
};

export default function PlanPage() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<RegistryFilter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadRegistry = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = window.localStorage.getItem(STORED_TOKEN_KEY);
        if (!token) {
          throw new Error("We couldn't find your session. Please log in again.");
        }

        const response = await fetch(`${API_URL}/api/registry`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          const upstreamError = await response.text();
          throw new Error(
            upstreamError || "We had trouble loading your registry. Please try again.",
          );
        }

        const data: ApiRegistryResponse = await response.json();
        if (!isMounted) return;

        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (registryError) {
        if (controller.signal.aborted || !isMounted) return;
        const message =
          registryError instanceof Error
            ? registryError.message
            : "Something went wrong while loading your registry.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRegistry();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const filteredItems = useMemo(
    () => items.filter((item) => matchesFilter(item, activeFilter)),
    [items, activeFilter],
  );

  const productCards = filteredItems.length
    ? filteredItems
    : activeFilter === "All"
      ? items
      : [];

  return (
    <div
      className={`min-h-screen bg-[#FDF7F9] text-[#3E2F35] ${nunito.variable} ${playfair.variable} ${playfairSc.variable} ${greatVibes.variable}`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/70 font-[var(--font-playfair-sc)]">
            Learn · Plan · Connect
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[#3E2F35] md:text-5xl font-[var(--font-playfair)]">
            Your Dynamic Registry
          </h1>
          <p className="max-w-3xl text-base text-[#3E2F35]/80 font-[var(--font-nunito)]">
            This living list keeps your mentor insights, Academy lessons, and shoppable picks
            in one blush-mauve home. Filter by focus, peek at mentor notes, and tap through
            curated affiliate links when you&apos;re ready to add to your plan.
          </p>
        </motion.header>

        <div className="flex flex-wrap gap-3">
          {CATEGORY_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-all shadow-[0_4px_18px_rgba(200,161,180,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A1B4]",
                  isActive
                    ? "bg-[#3E2F35] text-white border-[#3E2F35]"
                    : "bg-white/70 text-[#3E2F35]/80 border-transparent hover:text-[#C9A26B]",
                ].join(" ")}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-[#C8A1B4]/50 bg-white/80 p-4 text-sm text-[#C13C54]"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-[#EAD6DE]/60 bg-white/60"
              />
            ))}
          </div>
        ) : productCards.length ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {productCards.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -6 }}
                className="flex h-full flex-col gap-4 rounded-2xl border border-[#EAD6DE]/50 bg-white/80 p-5 shadow-[0_4px_25px_rgba(200,161,180,0.1)]"
              >
                <div className="relative h-48 overflow-hidden rounded-2xl bg-[#FDF7F9]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-[#3E2F35]/60">
                      Image coming soon
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4] font-[var(--font-playfair-sc)]">
                    {item.category || "Registry Item"}
                  </p>
                  <h2 className="text-xl font-semibold text-[#3E2F35] font-[var(--font-playfair)]">
                    {item.name}
                  </h2>
                  <p className="text-sm text-[#3E2F35]/70">{item.retailer}</p>
                  <p className="text-lg font-semibold text-[#3E2F35]">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {item.mentorNote && (
                  <div className="rounded-2xl border border-[#EAD6DE]/70 bg-[#FDF7F9]/80 p-3 text-sm text-[#3E2F35]/90">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C9A26B] font-[var(--font-playfair-sc)]">
                      Mentor Note
                    </p>
                    <p className="mt-1 leading-relaxed">{item.mentorNote}</p>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60 font-[var(--font-playfair-sc)]">
                    Curated Link
                  </span>
                  <a
                    href={item.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#3E2F35] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#C9A26B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A26B]"
                  >
                    View Product
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-dashed border-[#EAD6DE] bg-white/70 p-8 text-center"
          >
            <p className="text-lg font-semibold text-[#3E2F35]">
              No matches in {activeFilter} just yet.
            </p>
            <p className="mt-2 text-sm text-[#3E2F35]/70">
              We&apos;ll pull fresh picks from your synced registry as soon as they&apos;re
              available.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
