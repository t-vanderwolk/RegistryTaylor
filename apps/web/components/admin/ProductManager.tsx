"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { AffiliateProduct } from "../../lib/types";
import { API_BASE } from "../../lib/api";
import { cn } from "../../lib/utils";

type ProductManagerProps = {
  initialProducts: AffiliateProduct[];
};

const CATEGORY_OPTIONS = [
  "cribs",
  "strollers",
  "car_seats",
  "highchairs",
  "feeding_accessories",
  "sleep_aids",
  "play_yards",
  "postpartum",
  "monitors",
  "tubs",
];

export function ProductManager({ initialProducts }: ProductManagerProps) {
  const [products, setProducts] = useState<AffiliateProduct[]>(initialProducts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    category: CATEGORY_OPTIONS[0],
    brand: "",
    name: "",
    image_url: "",
    product_url: "",
    price: "",
  });
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/affiliate/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formState,
          price: Number(formState.price),
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to add product.");
      }
      setProducts((prev) => [json.data as AffiliateProduct, ...prev]);
      setFormState({
        category: CATEGORY_OPTIONS[0],
        brand: "",
        name: "",
        image_url: "",
        product_url: "",
        price: "",
      });
    } catch (error) {
      console.error(error);
      window.alert("We couldn't add that product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProduct = async (id: string) => {
    setTogglingId(id);
    try {
      const response = await fetch(`${API_BASE}/api/affiliate/products/${id}/toggle`, {
        method: "POST",
        credentials: "include",
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to toggle product.");
      }
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...json.data } : product
        )
      );
    } catch (error) {
      console.error(error);
      window.alert("We couldn't update that product. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-tmCharcoal">
          Affiliate Catalog
        </h2>
        <p className="text-sm text-tmCharcoal/70">
          Add curated products and manage their availability inside the registry experience.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-tmBlush/60 bg-white/95 p-6 shadow-soft md:grid-cols-2"
      >
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Category
          </label>
          <select
            value={formState.category}
            onChange={(event) => handleChange("category", event.target.value)}
            className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-3 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Brand
          </label>
          <input
            value={formState.brand}
            onChange={(event) => handleChange("brand", event.target.value)}
            className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-3 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
            placeholder="Brand"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Name
          </label>
          <input
            value={formState.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-3 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
            placeholder="Product name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Image URL
          </label>
          <input
            value={formState.image_url}
            onChange={(event) => handleChange("image_url", event.target.value)}
            className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-3 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
            placeholder="https://"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Product URL
          </label>
          <input
            value={formState.product_url}
            onChange={(event) =>
              handleChange("product_url", event.target.value)
            }
            className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-3 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
            placeholder="https://"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Price
          </label>
          <input
            value={formState.price}
            onChange={(event) => handleChange("price", event.target.value)}
            className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-3 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
            placeholder="0.00"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "md:col-span-2 inline-flex items-center justify-center rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
            isSubmitting && "opacity-60"
          )}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? "Saving..." : "Add Product"}
        </motion.button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <motion.article
            key={product.id}
            className="flex flex-col gap-3 rounded-2xl border border-tmBlush/60 bg-white/95 p-5 shadow-soft"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
                  {product.category.replace(/_/g, " ")}
                </p>
                <h3 className="font-heading text-xl text-tmCharcoal/90">
                  {product.brand} · {product.name}
                </h3>
                <p className="text-sm font-semibold text-tmMauve">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                  product.active
                    ? "bg-tmGold/70 text-tmCharcoal"
                    : "bg-tmIvory text-tmCharcoal/60"
                )}
              >
                {product.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-tmCharcoal/60">
              <a
                href={product.product_url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-tmMauve transition hover:text-tmGold"
              >
                View product →
              </a>
              <button
                type="button"
                onClick={() => toggleProduct(product.id)}
                disabled={togglingId === product.id}
                className={cn(
                  "rounded-full border border-tmMauve/40 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-tmMauve transition hover:border-tmGold hover:text-tmGold",
                  togglingId === product.id && "opacity-50"
                )}
              >
                {togglingId === product.id
                  ? "Updating..."
                  : product.active
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
