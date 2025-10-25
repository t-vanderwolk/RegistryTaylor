import React, { useMemo, useState } from "react";
import { useRegistryStore } from "../../hooks/useRegistryStore";

const STATUS_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "shortlist", label: "Shortlist" },
  { value: "ordered", label: "Ordered" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "fulfilled", label: "Fulfilled" },
];

const roleCopy = {
  client: {
    eyebrow: "Registry",
    title: "Registry Blueprint",
    description:
      "Track every add-to-cart idea, gifting request, and concierge recommendation. Share outside links so Taylor and your mentor can review in real time.",
  },
  mentor: {
    eyebrow: "Concierge Collaboration",
    title: "Client Registry Workspace",
    description:
      "Capture finds, link outside retailers, and keep statuses current so Taylor sees exactly what’s pending, ordered, or wrapped.",
  },
  admin: {
    eyebrow: "Studio Ops",
    title: "Global Registry Tracker",
    description:
      "Monitor every client registry touchpoint, align gifting budgets, and keep fulfillment dates at a glance.",
  },
};

const emptyFormState = {
  id: null,
  title: "",
  retailer: "",
  category: "",
  quantity: "1",
  price: "",
  status: "planning",
  link: "",
  notes: "",
};

const validateLink = (value) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol && parsed.hostname);
  } catch (error) {
    return false;
  }
};

const RegistryBoard = ({ role = "client" }) => {
  const { items, addItem, updateItem, deleteItem, resetRegistry } = useRegistryStore();
  const [form, setForm] = useState(emptyFormState);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const pageCopy = roleCopy[role] || roleCopy.client;

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.retailer.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [items, search, statusFilter]);

  const handleChange = (field) => (event) => {
    const value = field === "quantity" ? event.target.value.replace(/[^0-9]/g, "") : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const link = form.link.trim();

    if (!title) {
      setError("Add a product name before saving.");
      return;
    }

    if (!validateLink(link)) {
      setError("Outside link must be a valid URL.");
      return;
    }

    const payload = {
      title,
      retailer: form.retailer,
      category: form.category,
      quantity: form.quantity || 1,
      price: form.price,
      status: form.status,
      link,
      notes: form.notes,
      addedBy: role,
    };

    if (editingId) {
      updateItem(editingId, payload);
      setMessage("Registry item updated.");
    } else {
      addItem(payload);
      setMessage("Registry item added.");
    }

    setForm({ ...emptyFormState });
    setEditingId(null);
    setError("");
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      retailer: item.retailer,
      category: item.category,
      quantity: String(item.quantity || 1),
      price: item.price,
      status: item.status,
      link: item.link,
      notes: item.notes,
    });
    setEditingId(item.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    deleteItem(id);
    setMessage("Registry item removed.");
    if (editingId === id) {
      setForm({ ...emptyFormState });
      setEditingId(null);
    }
  };

  const handleStatusChange = (id, nextStatus) => {
    updateItem(id, { status: nextStatus });
  };

  const handleCancelEdit = () => {
    setForm({ ...emptyFormState });
    setEditingId(null);
    setMessage("");
    setError("");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-8">
        <header className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-mauve/25 bg-mauve/15 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.4em] text-charcoal">
            {pageCopy.eyebrow}
          </span>
          <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">{pageCopy.title}</h2>
          <p className="max-w-3xl text-sm font-body leading-relaxed text-charcoal/70">{pageCopy.description}</p>
        </header>

        {(message || error) && (
          <div
            className={`mt-6 rounded-3xl border px-4 py-3 text-sm ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-emerald-200 bg-emerald-50 text-emerald-600"
            }`}
          >
            {error || message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-body text-charcoal/70 lg:col-span-2">
            Product name
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="e.g. Kyte Baby Sleep Bag"
              className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-body text-charcoal/70">
            Retailer / Brand
            <input
              type="text"
              value={form.retailer}
              onChange={handleChange("retailer")}
              placeholder="Crate & Barrel, Maisonette, etc."
              className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
            />
          </label>

          <label className="space-y-2 text-sm font-body text-charcoal/70">
            Category
            <input
              type="text"
              value={form.category}
              onChange={handleChange("category")}
              placeholder="Gear, Nursery, Feeding…"
              className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
            />
          </label>

          <label className="space-y-2 text-sm font-body text-charcoal/70">
            Quantity
            <input
              type="text"
              inputMode="numeric"
              value={form.quantity}
              onChange={handleChange("quantity")}
              className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
            />
          </label>

          <label className="space-y-2 text-sm font-body text-charcoal/70">
            Price / Budget
            <input
              type="text"
              value={form.price}
              onChange={handleChange("price")}
              placeholder="$"
              className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
            />
          </label>

          <label className="space-y-2 text-sm font-body text-charcoal/70">
            Status
            <select
              value={form.status}
              onChange={handleChange("status")}
              className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal focus:border-blush focus:outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-body text-charcoal/70 lg:col-span-2">
            Outside link
            <input
              type="url"
              value={form.link}
              onChange={handleChange("link")}
              placeholder="https://www.retailer.com/listing"
              className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
            />
          </label>

          <label className="space-y-2 text-sm font-body text-charcoal/70 lg:col-span-2">
            Notes for Taylor / Mentor
            <textarea
              rows={3}
              value={form.notes}
              onChange={handleChange("notes")}
              placeholder="Color preferences, must-include accessories, shipping reminders…"
              className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal shadow-toy transition hover:-translate-y-0.5 hover:shadow-dreamy"
            >
              {editingId ? "Update item" : "Add item"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center justify-center rounded-full border border-mauve/30 bg-white px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-mauve/10"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                resetRegistry();
                setMessage("Registry reset to sample data.");
                setError("");
                setEditingId(null);
                setForm({ ...emptyFormState });
              }}
              className="ml-auto inline-flex items-center justify-center rounded-full border border-mauve/30 bg-white px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/60 transition hover:-translate-y-0.5 hover:bg-blush/10"
            >
              Reset sample data
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[2.5rem] border border-blush/30 bg-white/95 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:max-w-md">
            <label className="text-xs font-heading uppercase tracking-[0.35em] text-charcoal/50">Search registry</label>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter by product, brand, or category"
              className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-48">
            <label className="text-xs font-heading uppercase tracking-[0.35em] text-charcoal/50">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal focus:border-blush focus:outline-none"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-mauve/20 text-left text-sm">
            <thead>
              <tr className="text-[0.7rem] uppercase tracking-[0.35em] text-charcoal/50">
                <th scope="col" className="px-4 py-3">Item</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Qty</th>
                <th scope="col" className="px-4 py-3">Budget</th>
                <th scope="col" className="px-4 py-3">Notes</th>
                <th scope="col" className="px-4 py-3">Link</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mauve/10">
              {filteredItems.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-heading text-charcoal">{item.title}</p>
                    <p className="text-xs font-body uppercase tracking-[0.25em] text-charcoal/50">
                      {item.retailer || "—"} · {item.category || "General"}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={item.status}
                      onChange={(event) => handleStatusChange(item.id, event.target.value)}
                      className="w-full rounded-2xl border border-mauve/30 bg-white px-3 py-2 text-xs text-charcoal focus:border-blush focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-charcoal/40">
                      Added by {item.addedBy || "client"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-charcoal/80">{item.quantity || 1}</td>
                  <td className="px-4 py-4 text-sm text-charcoal/80">{item.price || "—"}</td>
                  <td className="px-4 py-4 text-sm text-charcoal/70">
                    {item.notes ? item.notes : <span className="text-charcoal/40">No notes yet</span>}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-mauve/30 px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-charcoal hover:-translate-y-0.5 hover:bg-blush/20"
                      >
                        View Link
                      </a>
                    ) : (
                      <span className="text-charcoal/40">No link</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="rounded-full border border-mauve/30 px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-charcoal transition hover:-translate-y-0.5 hover:bg-mauve/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredItems.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-charcoal/60">
                    No registry items match this view yet. Add one above to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default RegistryBoard;
