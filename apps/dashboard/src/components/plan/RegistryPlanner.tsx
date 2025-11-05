"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getRegistrySourceMeta } from "@/lib/registryMeta";
import type { RegistryCatalogItem, RegistryItem } from "@/types/plan";

type RegistryPlannerProps = {
  items: RegistryItem[];
  catalog: RegistryCatalogItem[];
  onItemsChange: (_items: RegistryItem[]) => void;
  onRefresh: () => Promise<unknown>;
};

type FormState = {
  id?: string;
  name: string;
  brand: string;
  price: string;
  url: string;
  retailer: string;
};

const palette = {
  mauve: "#C9B5C9",
  blush: "#F5E3E6",
  ivory: "#FFF8F5",
  gold: "#D9B46F",
  charcoal: "#3E2F35",
};

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
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

function emptyForm(): FormState {
  return {
    name: "",
    brand: "",
    price: "",
    url: "",
    retailer: "",
  };
}

export default function RegistryPlanner({ items, catalog, onItemsChange, onRefresh }: RegistryPlannerProps) {
  const [draftItems, setDraftItems] = useState<RegistryItem[]>(items);
  const [formState, setFormState] = useState<FormState>(emptyForm());
  const [showForm, setShowForm] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraftItems(items);
  }, [items]);

  const handleOpenCreate = () => {
    setFormState(emptyForm());
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (item: RegistryItem) => {
    setFormState({
      id: item.id,
      name: item.name,
      brand: item.brand ?? "",
      price: item.price?.toString() ?? "",
      url: item.url ?? "",
      retailer: item.retailer ?? "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormState(emptyForm());
  };

  const closeCatalog = () => {
    setShowCatalog(false);
  };

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const payload = {
      name: formState.name.trim(),
      brand: formState.brand.trim() || null,
      price: formState.price ? Number.parseFloat(formState.price) : null,
      url: formState.url.trim() || null,
      retailer: formState.retailer.trim() || null,
      source: "static",
    };

    try {
      const response = await fetch("/api/registry-items", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      if (!response.ok) {
        const message = (await response.json())?.error ?? "Unable to save item.";
        throw new Error(message);
      }

      const data = (await response.json()) as { item: RegistryItem };
      setDraftItems((prev) => {
        const without = prev.filter((entry) => entry.id !== data.item.id);
        const next = [data.item, ...without];
        onItemsChange(next);
        return next;
      });
      setStatus(editingId ? "Registry item updated." : "Registry item added.");
      closeForm();
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error while saving.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this item from your registry?")) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/registry-items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const message = (await response.json())?.error ?? "Unable to delete item.";
        throw new Error(message);
      }
      setDraftItems((prev) => {
        const next = prev.filter((item) => item.id !== id);
        onItemsChange(next);
        return next;
      });
      setStatus("Registry item removed.");
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error while deleting.");
    } finally {
      setPending(false);
    }
  }

  async function handleAddCatalog(catalogId: string) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/catalog-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ catalogId }),
      });
      if (!response.ok) {
        const message = (await response.json())?.error ?? "Unable to add catalog item.";
        throw new Error(message);
      }
      const data = (await response.json()) as { item: RegistryItem };
      setDraftItems((prev) => {
        const without = prev.filter((entry) => entry.id !== data.item.id);
        const next = [data.item, ...without];
        onItemsChange(next);
        return next;
      });
      setStatus("Catalog item added to your registry.");
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error while adding catalog item.");
    } finally {
      setPending(false);
    }
  }

  const mentorNotesCount = useMemo(() => draftItems.filter((item) => item.mentorNote?.trim()).length, [draftItems]);

  return (
    <div className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white/95 p-6 shadow-[0_22px_55px_rgba(200,161,180,0.18)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: palette.mauve }}>
            Registry Planner
          </p>
          <h2 className="mt-2 font-[var(--font-playfair)] text-3xl" style={{ color: palette.charcoal }}>
            Your personal registry ledger
          </h2>
          <p className="mt-1 text-sm" style={{ color: `${palette.charcoal}B3` }}>
            Track concierge-curated pieces, add custom finds, and keep mentor guidance close at hand.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_28px_rgba(200,161,180,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.34)]"
          >
            Add Item
          </button>
          <button
            type="button"
            onClick={() => setShowCatalog(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            Browse Catalog
          </button>
        </div>
      </div>

      {status ? (
        <div className="rounded-3xl border border-[#C8A1B4]/25 bg-[#FFF8F5] p-3 text-xs text-[#3E2F35] shadow-sm">
          {status}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-3xl border border-[#D97373]/40 bg-[#FFF5F4] p-3 text-xs text-[#5C2E2E] shadow-sm">
          {error}
        </div>
      ) : null}

      <div className="space-y-3 rounded-[2rem] border border-[#C8A1B4]/20 bg-[#FFF8F5] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: `${palette.charcoal}80` }}>
          Snapshot
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#C8A1B4]/30 bg-white/95 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em]" style={{ color: `${palette.charcoal}80` }}>
              Total items
            </p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: palette.charcoal }}>
              {draftItems.length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#C8A1B4]/30 bg-white/95 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em]" style={{ color: `${palette.charcoal}80` }}>
              Mentor notes saved
            </p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: palette.charcoal }}>
              {mentorNotesCount}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: `${palette.charcoal}80` }}>
          My Items
        </p>
        <ul className="space-y-3">
          {draftItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-[1.75rem] border border-[#C8A1B4]/25 bg-white/95 p-4 shadow-[0_12px_28px_rgba(200,161,180,0.14)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="hidden h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-[#C8A1B4]/25 bg-[#FFF8F5] sm:flex">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={56} height={56} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
                      Concierge
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em]" style={{ color: `${palette.charcoal}80` }}>
                    {item.brand}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: palette.charcoal }}>
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: `${palette.charcoal}70` }}>
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5"
                  style={{ background: `${palette.blush}` }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
          {draftItems.length === 0 ? (
            <li className="rounded-[1.75rem] border border-dashed border-[#C8A1B4]/45 bg-white/95 p-6 text-sm text-[#3E2F35]/70">
              No custom items yet. Add a keepsake from your concierge catalog or log a personal favorite.
            </li>
          ) : null}
        </ul>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSave}
          className="space-y-4 rounded-[2rem] border border-[#C8A1B4]/30 bg-white/95 p-5 shadow-[0_18px_45px_rgba(200,161,180,0.18)]"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-[var(--font-playfair)] text-lg" style={{ color: palette.charcoal }}>
              {editingId ? "Edit registry item" : "Add new registry item"}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: `${palette.charcoal}70` }}
            >
              Close
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: `${palette.charcoal}80` }}>
              Name
              <input
                required
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-2xl border border-[#C8A1B4]/30 bg-[#FFF8F5] p-3 text-sm text-[#3E2F35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A1B4]"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: `${palette.charcoal}80` }}>
              Brand
              <input
                value={formState.brand}
                onChange={(event) => setFormState((prev) => ({ ...prev, brand: event.target.value }))}
                className="w-full rounded-2xl border border-[#C8A1B4]/30 bg-[#FFF8F5] p-3 text-sm text-[#3E2F35]"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: `${palette.charcoal}80` }}>
              Price
              <input
                value={formState.price}
                onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                inputMode="decimal"
                className="w-full rounded-2xl border border-[#C8A1B4]/30 bg-[#FFF8F5] p-3 text-sm text-[#3E2F35]"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: `${palette.charcoal}80` }}>
              Retailer
              <input
                value={formState.retailer}
                onChange={(event) => setFormState((prev) => ({ ...prev, retailer: event.target.value }))}
                className="w-full rounded-2xl border border-[#C8A1B4]/30 bg-[#FFF8F5] p-3 text-sm text-[#3E2F35]"
              />
            </label>
            <label className="sm:col-span-2 space-y-1 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: `${palette.charcoal}80` }}>
              Product URL
              <input
                value={formState.url}
                onChange={(event) => setFormState((prev) => ({ ...prev, url: event.target.value }))}
                className="w-full rounded-2xl border border-[#C8A1B4]/30 bg-[#FFF8F5] p-3 text-sm text-[#3E2F35]"
                placeholder="https://"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_28px_rgba(200,161,180,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Saving…" : editingId ? "Update item" : "Add item"}
            </button>
          </div>
        </form>
      ) : null}

      {showCatalog ? (
        <div className="space-y-4 rounded-[2rem] border border-[#C8A1B4]/30 bg-white/95 p-5 shadow-[0_18px_45px_rgba(200,161,180,0.18)]">
          <div className="flex items-center justify-between">
            <h3 className="font-[var(--font-playfair)] text-lg" style={{ color: palette.charcoal }}>
              Concierge catalog
            </h3>
            <button
              type="button"
              onClick={closeCatalog}
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: `${palette.charcoal}70` }}
            >
              Close
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {catalog.map((item) => {
              const meta = getRegistrySourceMeta(item.source);
              return (
                <div
                  key={item.id}
                  className="space-y-3 rounded-[1.75rem] border border-[#C8A1B4]/25 bg-[#FFF8F5] p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.35em]" style={{ color: `${palette.charcoal}80` }}>
                      {item.brand ?? meta.label}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]">
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: palette.charcoal }}>
                    {item.title}
                  </p>
                  <p className="text-xs" style={{ color: `${palette.charcoal}70` }}>
                    {formatCurrency(item.price ?? null)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAddCatalog(item.id)}
                    disabled={pending}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pending ? "Adding…" : "Add to registry"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
