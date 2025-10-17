"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AffiliateProduct, RegistryItem } from "../lib/types";
import { API_BASE } from "../lib/api";
import { cn } from "../lib/utils";

type RegistryDashboardProps = {
  initialProducts: AffiliateProduct[];
  initialRegistry: RegistryItem[];
};

type ProductStatus = "suggested" | "added" | "removed";

export function RegistryDashboard({
  initialProducts,
  initialRegistry,
}: RegistryDashboardProps) {
  const [registry, setRegistry] = useState<Map<string, RegistryItem>>(() => {
    return new Map(initialRegistry.map((item) => [item.affiliate_product_id, item]));
  });
  const [filter, setFilter] = useState<"suggested" | "added" | "all">("suggested");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const products = useMemo(() => {
    return initialProducts.map((product) => {
      const record = registry.get(product.id);
      return {
        product,
        status: (record?.status ?? "suggested") as ProductStatus,
        record,
      };
    });
  }, [initialProducts, registry]);

  const filteredProducts = useMemo(() => {
    return products.filter(({ status }) => {
      if (filter === "all") return true;
      if (filter === "added") return status === "added";
      return status !== "added";
    });
  }, [products, filter]);

  const updateRegistry = (productId: string, nextStatus: ProductStatus) => {
    setRegistry((prev) => {
      const next = new Map(prev);
      const existing = next.get(productId);
      if (existing) {
        next.set(productId, { ...existing, status: nextStatus });
      } else {
        next.set(productId, {
          id: productId,
          user_id: "",
          affiliate_product_id: productId,
          status: nextStatus,
          mentor_notes: null,
          created_at: new Date().toISOString(),
          product: initialProducts.find((item) => item.id === productId) ?? null,
        } as RegistryItem);
      }
      return next;
    });
  };

  const handleAdd = async (productId: string) => {
    setLoadingId(productId);
    try {
      const response = await fetch(`${API_BASE}/api/registry/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ affiliate_product_id: productId }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to add registry item.");
      }
      updateRegistry(productId, "added");
    } catch (error) {
      console.error(error);
      window.alert("We couldn’t add that item. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setLoadingId(productId);
    try {
      const response = await fetch(`${API_BASE}/api/registry/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ affiliate_product_id: productId }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to remove registry item.");
      }
      updateRegistry(productId, "removed");
    } catch (error) {
      console.error(error);
      window.alert("We couldn’t remove that item. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["suggested", "added", "all"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition duration-200",
                filter === option
                  ? "bg-tmBlush text-tmMauve shadow-soft"
                  : "border border-transparent bg-white text-tmCharcoal/70 hover:border-tmBlush/60 hover:text-tmMauve"
              )}
            >
              {option === "suggested"
                ? "Suggested"
                : option === "added"
                ? "Added"
                : "All"}
            </button>
          ))}
        </div>
        <p className="text-xs text-tmCharcoal/60">
          Every link includes our affiliate attribution automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map(({ product, status }) => {
          const isAdded = status === "added";
          const isLoading = loadingId === product.id;
          return (
            <motion.article
              key={product.id}
              className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-tmBlush/60 bg-white/95 p-6 shadow-soft"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <div className="absolute -right-16 top-16 h-32 w-32 rounded-full bg-tmBlush/30 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
                    {product.category.replace(/_/g, " ")}
                  </p>
                  <h3 className="font-heading text-xl text-tmCharcoal/90">
                    {product.brand} · {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-tmMauve">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
                {product.image_url && (
                  <div className="overflow-hidden rounded-xl border border-tmBlush/40 bg-white/60 shadow-inner">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-24 w-24 object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                    isAdded
                      ? "bg-tmGold/70 text-tmCharcoal"
                      : status === "removed"
                      ? "bg-tmIvory text-tmCharcoal/60"
                      : "bg-tmBlush/60 text-tmMauve"
                  )}
                >
                  {isAdded ? (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      ✓
                    </motion.span>
                  ) : (
                    "•"
                  )}
                  {isAdded ? "Added" : status === "removed" ? "Removed" : "Suggested"}
                </span>
                <a
                  className="inline-flex items-center gap-2 text-xs font-semibold text-tmMauve transition hover:text-tmGold"
                  href={product.product_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View with affiliate →
                </a>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    isAdded ? handleRemove(product.id) : handleAdd(product.id)
                  }
                  disabled={isLoading}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
                    isAdded
                      ? "border border-tmMauve/50 bg-white text-tmMauve hover:border-tmGold hover:text-tmGold"
                      : "bg-tmMauve text-tmGold hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft",
                    isLoading && "opacity-60"
                  )}
                >
                  {isAdded ? "Remove from Registry" : "Add to My Registry"}
                </button>
                {!isAdded && status === "removed" && (
                  <button
                    type="button"
                    onClick={() => handleAdd(product.id)}
                    disabled={isLoading}
                    className={cn(
                      "rounded-full border border-tmMauve/30 px-5 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold",
                      isLoading && "opacity-60"
                    )}
                  >
                    Re-add
                  </button>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
