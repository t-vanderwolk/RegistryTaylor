"use client";

import Image from "next/image";
import { useState } from "react";
import { AffiliateProduct } from "../lib/types";
import { API_BASE } from "../lib/api";
import { cn } from "../lib/utils";

export function RegistryCard({
  product,
  moduleId,
}: {
  product: AffiliateProduct;
  moduleId?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">("idle");

  const handleAdd = async () => {
    try {
      setStatus("loading");
      const response = await fetch(`${API_BASE}/api/registry/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          module_id: moduleId ?? null,
          affiliate_product_id: product.id,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to add registry item");
      }
      setStatus("added");
    } catch (error) {
      console.error(error);
      setStatus("error");
      window.alert("We couldn't add that item. Please try again.");
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <article className="card-surface flex flex-col gap-5 bg-tmIvory/80 px-6 py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tmMauve/70">
            {product.category.replace(/_/g, " ")}
          </p>
          <h4 className="font-heading text-xl text-tmCharcoal/90">
            {product.brand} · {product.name}
          </h4>
          <p className="text-sm font-semibold text-tmMauve">${product.price}</p>
        </div>
        {product.image_url && (
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-tmBlush/40 bg-white/60 shadow-soft">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a
          className="rounded-full border border-tmMauve/50 bg-white px-4 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold"
          href={product.product_url}
          target="_blank"
          rel="noreferrer"
        >
          View on MacroBaby
        </a>
        <button
          type="button"
          onClick={handleAdd}
          disabled={status === "loading"}
          className={cn(
            "rounded-full bg-tmMauve px-5 py-2 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
            status === "added" && "bg-tmGold text-tmCharcoal shadow-soft",
            status === "loading" && "opacity-60"
          )}
        >
          {status === "added" ? "Added" : "Add to Registry"}
        </button>
      </div>
    </article>
  );
}
