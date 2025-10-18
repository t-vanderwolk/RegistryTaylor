"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";
import { RegistryItem } from "../../lib/types";

export function RegistryPreview({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/registry/list`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const json = await response.json();
        if (!json.success || !isMounted) return;
        setItems(json.data ?? []);
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          console.error("Failed to load registry preview", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [refreshKey]);

  const visibleItems = items.filter((item) => item.status !== "removed").slice(0, 3);

  return (
    <section className="rounded-3xl border border-tmBlush/60 bg-white/95 px-6 py-7 shadow-soft md:px-10 md:py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Registry Preview
          </p>
          <h3 className="mt-1 font-heading text-xl text-tmCharcoal">Curated items in your queue</h3>
        </div>
        <Link
          href="/dashboard/registry"
          className="text-sm font-semibold text-tmMauve transition hover:text-tmGold"
        >
          View all →
        </Link>
      </div>
      <div className="mt-6 space-y-4">
        {loading && <p className="text-sm text-tmCharcoal/60">Loading registry...</p>}
        {!loading && visibleItems.length === 0 ? (
          <p className="text-sm text-tmCharcoal/60">
            Nothing here yet. Add favorites directly from each insight.
          </p>
        ) : null}
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between rounded-2xl bg-tmIvory/70 px-4 py-3 text-sm text-tmCharcoal shadow-inner"
          >
            <div>
              <p className="font-semibold text-tmCharcoal">
                {item.product ? `${item.product.brand} · ${item.product.name}` : "Registry item"}
              </p>
              {item.product?.category && (
                <p className="text-xs uppercase tracking-[0.2em] text-tmMauve/70">
                  {item.product.category}
                </p>
              )}
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-tmMauve/70">
              {item.status === "added" ? "Added" : item.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
