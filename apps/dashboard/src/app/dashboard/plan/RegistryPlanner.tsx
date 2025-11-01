"use client";

import { useState } from "react";
import Image from "next/image";
import { getRegistrySourceMeta } from "@/lib/registryMeta";
import type { RegistryCatalogItem, RegistryItem } from "@/types/registry";

type RegistryPlannerProps = {
  initialItems: RegistryItem[];
  catalog: RegistryCatalogItem[];
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

export default function RegistryPlanner({ initialItems, catalog }: RegistryPlannerProps) {
  const [items, setItems] = useState<RegistryItem[]>(initialItems);
  const [formState, setFormState] = useState<FormState>(emptyForm());
  const [showForm, setShowForm] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setItems((prev) => {
        const without = prev.filter((entry) => entry.id !== data.item.id);
        return [data.item, ...without];
      });
      setStatus(editingId ? "Registry item updated." : "Registry item added.");
      closeForm();
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
      setItems((prev) => prev.filter((item) => item.id !== id));
      setStatus("Registry item removed.");
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
      setItems((prev) => {
        const without = prev.filter((entry) => entry.id !== data.item.id);
        return [data.item, ...without];
      });
      setStatus("Catalog item added to your registry.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error while adding catalog item.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: palette.mauve }}>
            Registry Planner
          </p>
          <h2 className="mt-2 font-[var(--font-playfair)] text-3xl" style={{ color: palette.charcoal }}>
            Your personal registry ledger
          </h2>
          <p className="mt-1 text-sm" style={{ color: `${palette.charcoal}B3` }}>
            Add your own discoveries or pull from Taylor’s affiliate catalog to keep gifting aligned.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-full bg-gradient-to-r from-[#C9B5C9] via-[#F5E3E6] to-[#D9B46F] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_28px_rgba(201,181,201,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(201,181,201,0.45)]"
            disabled={pending}
          >
            + Add Item
          </button>
          <button
            type="button"
            onClick={() => setShowCatalog(true)}
            className="rounded-full border border-[#C9B5C9] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9B46F]"
            disabled={pending}
          >
            Browse Catalog
          </button>
        </div>
      </div>

      {status ? (
        <div className="rounded-3xl border border-[#C9B5C9]/40 bg-[#FFF8F5] px-5 py-3 text-sm text-[#3E2F35] shadow-[0_12px_30px_rgba(201,181,201,0.25)]">
          {status}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-3xl border border-[#D97373]/40 bg-[#FFF1F1] px-5 py-3 text-sm text-[#5C2E2E] shadow-[0_12px_30px_rgba(217,115,115,0.25)]">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[2rem] border border-[#C9B5C9]/40 bg-white shadow-[0_24px_55px_rgba(201,181,201,0.18)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#F5E3E6]/60">
            <thead className="bg-[#FFF8F5]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.35em] text-[#C9B5C9]">
                  Image
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.35em] text-[#C9B5C9]">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.35em] text-[#C9B5C9]">
                  Brand
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.35em] text-[#C9B5C9]">
                  Price
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.35em] text-[#C9B5C9]">
                  Retailer
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.35em] text-[#C9B5C9]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E3E6]/40 bg-white">
              {items.map((item) => {
                const sourceMeta = getRegistrySourceMeta(item.registrySource);
                return (
                  <tr key={item.id} className="hover:bg-[#FFF1F6]/60">
                    <td className="px-6 py-4">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-[#C9B5C9]/70 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9B5C9]">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#3E2F35]">{item.name}</div>
                      <div className="text-xs text-[#3E2F35]/60">{sourceMeta.label}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#3E2F35]/80">{item.brand ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-[#3E2F35]/80">{formatCurrency(item.price)}</td>
                    <td className="px-6 py-4 text-sm text-[#3E2F35]/80">{item.retailer ?? sourceMeta.retailer}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="rounded-full border border-[#C9B5C9] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9B46F]"
                          disabled={pending}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-full border border-[#D97373] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#5C2E2E] transition hover:-translate-y-0.5 hover:border-[#B25A5A]"
                          disabled={pending}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#3E2F35]/60">
                    No registry items yet. Start by adding your own finds or browse our curated catalog.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-[#C9B5C9]/50 bg-white p-8 shadow-[0_40px_80px_rgba(62,47,53,0.25)]">
            <h3 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">
              {editingId ? "Edit Registry Item" : "Add Registry Item"}
            </h3>
            <form className="mt-6 space-y-4 text-sm" onSubmit={handleSave}>
              <label className="block">
                <span className="text-[#3E2F35]/70">Title</span>
                <input
                  required
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#C9B5C9]/60 bg-[#FFF8F5] px-4 py-2 text-[#3E2F35] focus:border-[#D9B46F] focus:outline-none"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[#3E2F35]/70">
                  Brand
                  <input
                    value={formState.brand}
                    onChange={(event) => setFormState((prev) => ({ ...prev, brand: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#C9B5C9]/60 bg-[#FFF8F5] px-4 py-2 text-[#3E2F35] focus:border-[#D9B46F] focus:outline-none"
                  />
                </label>
                <label className="block text-[#3E2F35]/70">
                  Price
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formState.price}
                    onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#C9B5C9]/60 bg-[#FFF8F5] px-4 py-2 text-[#3E2F35] focus:border-[#D9B46F] focus:outline-none"
                  />
                </label>
              </div>
              <label className="block text-[#3E2F35]/70">
                Product URL
                <input
                  type="url"
                  value={formState.url}
                  onChange={(event) => setFormState((prev) => ({ ...prev, url: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#C9B5C9]/60 bg-[#FFF8F5] px-4 py-2 text-[#3E2F35] focus:border-[#D9B46F] focus:outline-none"
                />
              </label>
              <label className="block text-[#3E2F35]/70">
                Retailer
                <input
                  value={formState.retailer}
                  onChange={(event) => setFormState((prev) => ({ ...prev, retailer: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#C9B5C9]/60 bg-[#FFF8F5] px-4 py-2 text-[#3E2F35] focus:border-[#D9B46F] focus:outline-none"
                />
              </label>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-[#C9B5C9]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5"
                  disabled={pending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-[#C9B5C9] via-[#F5E3E6] to-[#D9B46F] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_32px_rgba(201,181,201,0.35)] transition hover:-translate-y-0.5"
                  disabled={pending}
                >
                  {pending ? "Saving…" : editingId ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showCatalog ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-black/20 backdrop-blur-sm">
          <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-6 px-6 py-12">
            <div className="flex items-center justify-between">
              <h3 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Browse Catalog</h3>
              <button
                type="button"
                onClick={closeCatalog}
                className="rounded-full border border-[#C9B5C9] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9B46F]"
              >
                Close
              </button>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {catalog.map((item) => {
                const sourceMeta = getRegistrySourceMeta(item.source);
                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-3 rounded-[1.8rem] border border-[#C9B5C9]/35 bg-white p-6 shadow-[0_20px_48px_rgba(201,181,201,0.22)]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">{item.title}</h4>
                        <p className="text-sm text-[#3E2F35]/70">{item.brand ?? sourceMeta.retailer}</p>
                      </div>
                      <span className="rounded-full bg-[#FFF8F5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                        {sourceMeta.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#3E2F35]/70">{formatCurrency(item.price ?? null)}</p>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={640}
                        height={360}
                        className="h-40 w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-dashed border-[#C9B5C9]/60 text-xs font-semibold uppercase tracking-[0.3em] text-[#C9B5C9]">
                        Concierge curated
                      </div>
                    )}
                    <div className="mt-auto flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddCatalog(item.id)}
                        className="rounded-full bg-gradient-to-r from-[#C9B5C9] via-[#F5E3E6] to-[#D9B46F] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5"
                        disabled={pending}
                      >
                        Add to My Registry
                      </button>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[#C9B5C9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9B46F]"
                        >
                          View Product
                        </a>

                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
