import React, { useEffect, useMemo, useState } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import { useRegistry, RegistryItem, RegistryInput } from "../hooks/useRegistry";

type RegistryTabProps = {
  userId?: string;
};

type ToastState = {
  tone: "success" | "error";
  message: string;
} | null;

const CATEGORY_ORDER = ["Nursery", "Gear", "Postpartum"];

const formatUrl = (url?: string | null) => {
  if (!url) return null;
  try {
    const instance = new URL(url);
    return instance.hostname.replace("www.", "");
  } catch {
    return url;
  }
};

const RegistryCard: React.FC<{
  item: RegistryItem;
  onEdit: (item: RegistryItem) => void;
  onRemove: (id: number) => Promise<void>;
  busy?: boolean;
}> = ({ item, onEdit, onRemove, busy }) => {
  const handleRemove = () => {
    onRemove(item.id).catch(() => undefined);
  };

  return (
    <article
      className="flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/95 p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
      aria-label={`${item.productName} registry item`}
    >
      <header>
        <h3 className="text-base font-heading text-charcoal">{item.productName}</h3>
        <p className="text-sm font-body text-charcoal/70">
          {item.brand ? item.brand : "Brand TBD"}
          {item.mentorTag ? ` • Tagged ${item.mentorTag}` : ""}
        </p>
      </header>
      {item.productUrl && (
        <a
          href={item.productUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-tmMauve/30 bg-tmMauve/5 px-3 py-1 text-xs font-heading uppercase tracking-[0.28em] text-tmMauve transition hover:border-tmMauve/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          View {formatUrl(item.productUrl)}
        </a>
      )}
      <footer className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="inline-flex items-center gap-1.5 rounded-full border border-tmMauve/30 bg-tmMauve/10 px-3 py-2 text-xs font-heading uppercase tracking-[0.28em] text-tmMauve transition hover:border-tmMauve hover:bg-tmMauve/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <PencilLine className="h-3.5 w-3.5" aria-hidden />
          Edit
        </button>
        <button
          type="button"
          onClick={handleRemove}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-heading uppercase tracking-[0.28em] text-rose-500 transition hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          Remove
        </button>
      </footer>
    </article>
  );
};

const RegistryTab: React.FC<RegistryTabProps> = ({ userId }) => {
  const { items, grouped, status, error, addItem, updateItem, removeItem } = useRegistry(userId);
  const [editing, setEditing] = useState<RegistryItem | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [form, setForm] = useState<RegistryInput>({
    moduleId: "",
    category: "Nursery",
    productName: "",
    brand: "",
    productUrl: "",
    mentorTag: "",
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleEdit = (item: RegistryItem) => {
    setEditing(item);
    setForm({
      moduleId: item.moduleId,
      category: item.category,
      productName: item.productName,
      brand: item.brand || "",
      productUrl: item.productUrl || "",
      mentorTag: item.mentorTag || "",
    });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      moduleId: "",
      category: "Nursery",
      productName: "",
      brand: "",
      productUrl: "",
      mentorTag: "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editing) {
      setBusyId(editing.id);
      try {
        await updateItem(editing.id, {
          category: form.category,
          productName: form.productName,
          brand: form.brand,
          productUrl: form.productUrl,
          mentorTag: form.mentorTag,
        });
        setToast({ tone: "success", message: "Registry item updated." });
        resetForm();
      } catch (err: any) {
        setToast({
          tone: "error",
          message: err.response?.data?.error || err.message || "Unable to update registry item.",
        });
      } finally {
        setBusyId(null);
      }
    } else {
      if (!form.moduleId || !form.productName) {
        setToast({ tone: "error", message: "Select a module and product name before saving." });
        return;
      }
      try {
        await addItem(form);
        setToast({ tone: "success", message: "Item added to your registry." });
        resetForm();
      } catch (err: any) {
        setToast({
          tone: "error",
          message: err.response?.data?.error || err.message || "Unable to add registry item.",
        });
      }
    }
  };

  const handleRemove = async (id: number) => {
    setBusyId(id);
    try {
      await removeItem(id);
      setToast({ tone: "success", message: "Registry item removed." });
    } catch (err: any) {
      setToast({
        tone: "error",
        message: err.response?.data?.error || err.message || "Unable to remove registry item.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const orderedCategories = useMemo(() => {
    const categories = new Set<string>(Object.keys(grouped));
    CATEGORY_ORDER.forEach((category) => {
      if (grouped[category]?.length) {
        categories.delete(category);
      }
    });
    return [...CATEGORY_ORDER.filter((category) => grouped[category]?.length), ...Array.from(categories)];
  }, [grouped]);

  return (
    <div className="space-y-8" data-testid="registry-tab">
      <section className="rounded-[2.5rem] border border-tmMauve/25 bg-tmMauve/10 p-6 shadow-soft">
        <header className="mb-4 space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-tmMauve/30 bg-white/80 px-4 py-1 text-[0.7rem] font-heading uppercase tracking-[0.32em] text-tmMauve">
            Personalized Registry
          </p>
          <h2 className="text-2xl font-heading text-charcoal sm:text-3xl">Curate Taylor-approved essentials</h2>
          <p className="text-sm font-body text-charcoal/70">
            Save concierge picks as you move through each module. Organize by journey and tag mentors when you want a
            sourcing assist.
          </p>
        </header>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60">
            Module
            <input
              type="text"
              value={form.moduleId}
              onChange={(event) => setForm((prev) => ({ ...prev, moduleId: event.target.value }))}
              placeholder="Paste module ID or slug"
              className="rounded-2xl border border-tmMauve/30 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Module identifier"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60">
            Journey
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-2xl border border-tmMauve/30 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {CATEGORY_ORDER.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60">
            Product name
            <input
              type="text"
              value={form.productName}
              onChange={(event) => setForm((prev) => ({ ...prev, productName: event.target.value }))}
              placeholder="Feather-light stroller"
              className="rounded-2xl border border-tmMauve/30 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60">
            Brand
            <input
              type="text"
              value={form.brand}
              onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
              placeholder="Maison Bébé"
              className="rounded-2xl border border-tmMauve/30 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60 md:col-span-2">
            Product link
            <input
              type="url"
              value={form.productUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, productUrl: event.target.value }))}
              placeholder="https://"
              className="rounded-2xl border border-tmMauve/30 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60">
            Mentor tag
            <input
              type="text"
              value={form.mentorTag}
              onChange={(event) => setForm((prev) => ({ ...prev, mentorTag: event.target.value }))}
              placeholder="@taylor"
              className="rounded-2xl border border-tmMauve/30 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-tmMauve via-tmBlush to-tmMauve px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label={editing ? "Update registry item" : "Add registry item"}
            >
              {editing ? "Update Item" : "Add to Registry"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-2xl border border-tmMauve/30 bg-white px-5 py-3 text-xs font-heading uppercase tracking-[0.28em] text-tmMauve shadow-soft transition hover:border-tmMauve focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {status === "loading" && (
        <p className="rounded-[2rem] border border-tmMauve/20 bg-white/80 px-5 py-4 text-sm font-body text-charcoal/60">
          Loading your registry...
        </p>
      )}
      {status === "error" && error && (
        <p className="rounded-[2rem] border border-rose-200 bg-rose-50/80 px-5 py-4 text-sm font-body text-rose-600">
          {error}
        </p>
      )}
      {status === "success" && !items.length && (
        <p className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-5 py-4 text-sm font-body text-charcoal/60">
          Your registry is empty — start capturing favourites from each module’s Apply section.
        </p>
      )}

      {orderedCategories.map((category) => (
        <section
          key={category}
          className="space-y-4 rounded-[2rem] border border-charcoal/10 bg-ivory/60 p-5 shadow-inner"
        >
          <header className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-heading text-charcoal">{category}</h3>
            <span className="text-xs font-heading uppercase tracking-[0.32em] text-charcoal/40">
              {grouped[category]?.length || 0} items
            </span>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {(grouped[category] || []).map((item) => (
              <RegistryCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onRemove={handleRemove}
                busy={busyId === item.id}
              />
            ))}
          </div>
        </section>
      ))}

      {toast && (
        <div
          role="status"
          aria-live="assertive"
          className={`rounded-2xl border px-4 py-3 text-sm font-body ${
            toast.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default RegistryTab;
