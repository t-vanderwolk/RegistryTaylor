"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

type RegistryBlockProps = {
  title: string;
  description?: string | null;
  productId?: string;
  externalId?: string;
  fallback?: {
    title?: string;
    description?: string | null;
    image?: string | null;
    url?: string | null;
  };
};

type RegistryItemPreview = {
  title: string;
  description?: string | null;
  image?: string | null;
  url?: string | null;
  price?: number | null;
  retailer?: string | null;
};

function coerceFallback(value: RegistryBlockProps["fallback"]): RegistryItemPreview | null {
  if (!value) return null;
  if (!value.title) {
    return null;
  }
  return {
    title: value.title,
    description: value.description ?? null,
    image: value.image ?? undefined,
    url: value.url ?? undefined,
  };
}

export default function RegistryBlock({ title, description, productId, externalId, fallback }: RegistryBlockProps) {
  const [item, setItem] = useState<RegistryItemPreview | null>(coerceFallback(fallback));
  const [loading, setLoading] = useState(Boolean(productId || externalId));

  useEffect(() => {
    let cancelled = false;
    async function fetchItem() {
      if (!productId && !externalId) {
        setLoading(false);
        return;
      }
      try {
        const params = new URLSearchParams();
        if (productId) params.set("productId", productId);
        if (externalId) params.set("externalId", externalId);
        const response = await fetch(`/api/registry/catalog?${params.toString()}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Unable to load registry item");
        }
        const data = (await response.json()) as { item?: RegistryItemPreview | null };
        if (!cancelled && data.item) {
          setItem(data.item);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchItem();
    return () => {
      cancelled = true;
    };
  }, [productId, externalId]);

  const headline = item?.title ?? title;
  const summary = item?.description ?? description;

  return (
    <section className="space-y-3 rounded-3xl border border-[#EED6D3] bg-white p-5">
      <header className="flex items-center gap-2 text-[#3E2F35]">
        <ShoppingBag className="h-4 w-4 text-[#C8A6B6]" aria-hidden />
        <h3 className="font-serif text-xl">Registry spotlight</h3>
      </header>
      <h4 className="font-serif text-lg text-[#3E2F35]">{headline}</h4>
      {summary ? <p className="text-sm leading-relaxed text-[#3E2F35]/80">{summary}</p> : null}
      {item?.image ? (
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-[#F8F6F3]">
          <Image src={item.image} alt={headline} fill className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-[#3E2F35]/60">
        {item?.price ? <span>${item.price.toFixed(0)}</span> : null}
        {item?.retailer ? <span>{item.retailer}</span> : null}
      </div>
      {item?.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-[#C8A6B6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white"
        >
          Add to my registry
        </a>
      ) : loading ? (
        <p className="text-xs uppercase tracking-[0.28em] text-[#3E2F35]/60">Loading item…</p>
      ) : null}
    </section>
  );
}
