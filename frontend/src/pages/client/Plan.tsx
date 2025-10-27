import React from "react";
import { Link } from "react-router-dom";
import useRegistryOverview, { MemberRegistryItem } from "../../hooks/useRegistryOverview";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../design-system/Button";
import { RegistryCard, type Product } from "../../components/dashboard";

const STATUS_OPTIONS: Array<{ value: MemberRegistryItem["status"]; label: string }> = [
  { value: "wishlist", label: "Wishlist" },
  { value: "shortlist", label: "Shortlist" },
  { value: "ordered", label: "Ordered" },
  { value: "arriving", label: "Arriving" },
  { value: "fulfilled", label: "Fulfilled" },
];

const Plan: React.FC = () => {
  const { overview, loading, error, refresh, addItem, updateItem, removeItem } = useRegistryOverview();

  const handleAddProduct = async (product: Product) => {
    await addItem({
      title: product.title ?? product.name,
      productId: product.productId || product.id,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      affiliateUrl: product.affiliateUrl,
      priceCents: product.priceCents,
      status: "wishlist",
    });
  };

  const handleStatusChange = async (item: MemberRegistryItem, nextStatus: MemberRegistryItem["status"]) => {
    if (item.status === nextStatus) return;
    await updateItem(item.id, { status: nextStatus });
  };

  const handleRemove = async (item: MemberRegistryItem) => {
    await removeItem(item.id);
  };

  const unlocked = overview?.unlocked ?? false;
  const completedCore = overview?.completedCore ?? 0;
  const totalCore = overview?.totalCore ?? 0;

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-[2.75rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-10">
        <header className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-gold/30 px-4 py-2 text-xs font-heading uppercase tracking-[0.35em] text-charcoal">
            Plan · Dynamic Registry
          </span>
          <h1 className="font-heading text-3xl text-charcoal sm:text-4xl">Curate your Taylor-Made registry</h1>
          <p className="max-w-2xl text-sm text-charcoal/75 sm:text-base">
            Personalized suggestions arrive the moment you finish a module. Add items to your registry, note mentor
            feedback, and track fulfillment with calm clarity.
          </p>
        </header>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/55">
          <span>
            Core modules completed: {completedCore}/{totalCore || 3}
          </span>
          <span aria-hidden="true">•</span>
          <span>{overview?.items?.length || 0} items saved</span>
        </div>
      </section>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`registry-skeleton-${index}`} className="h-72 animate-pulse rounded-[2.5rem] bg-white/80 shadow-soft" />
          ))}
        </div>
      )}

      {!loading && error && (
        <EmptyState
          title="Unable to load registry"
          description={error}
          action={
            <button
              type="button"
              onClick={refresh}
              className="rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.35em] text-white shadow-soft"
            >
              Try again
            </button>
          }
        />
      )}

      {!loading && overview && !unlocked && (
        <section className="rounded-[2.5rem] border border-mauve/25 bg-ivory/95 p-6 text-sm text-charcoal/75 shadow-soft sm:p-8">
          <p className="font-heading text-xl text-charcoal">
            Finish the core Academy modules to unlock dynamic registry recommendations.
          </p>
          <p className="mt-3">
            As soon as you mark a module complete, Plan will suggest curated pieces—from bassinets to postpartum care—aligned to
            that lesson.
          </p>
          <Button as={Link} to="/dashboard/learn" variant="mauve" size="sm" className="mt-4">
            Return to Learn
          </Button>
        </section>
      )}

      {!loading && overview && overview.suggestions.length > 0 && (
        <section className="space-y-4">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">Mentor Suggested</p>
              <h2 className="font-heading text-2xl text-charcoal">Recommended for your journey</h2>
            </div>
            <p className="text-xs text-charcoal/60">
              Suggestions update as you complete modules.
            </p>
          </header>
          <div className="grid gap-6 lg:grid-cols-3">
            {overview.suggestions.map((product) => (
              <RegistryCard
                key={product.id}
                product={product}
                onAdd={() => handleAddProduct(product)}
                onOpenLink={(url) => window.open(url, "_blank", "noopener")}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && overview && overview.macroBaby?.length > 0 && (
        <section className="space-y-4">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">MacroBaby Affiliates</p>
              <h2 className="font-heading text-2xl text-charcoal">Fresh from the boutique</h2>
            </div>
            <p className="text-xs text-charcoal/60">Sourced via affiliate ID 4496818.</p>
          </header>
          <div className="grid gap-6 lg:grid-cols-3">
            {overview.macroBaby.slice(0, 6).map((product) => (
              <RegistryCard
                key={product.id || product.title}
                product={product}
                onAdd={() => handleAddProduct(product)}
                onOpenLink={(url) => window.open(url, "_blank", "noopener")}
                showMentorNotes={false}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && overview && (
        <section className="space-y-4">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">My Registry</p>
              <h2 className="font-heading text-2xl text-charcoal">Saved items</h2>
            </div>
          </header>
          {overview.items.length === 0 ? (
            <EmptyState
              title="No items yet"
              description="Add recommendations above or capture bespoke finds from your mentor."
            />
          ) : (
            <ul className="space-y-3">
              {overview.items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-[2rem] border border-mauve/25 bg-white/95 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-heading text-lg text-charcoal">{item.title}</p>
                    <p className="text-sm text-charcoal/65">
                      {item.brand ? `${item.brand} · ` : ""}
                      {item.category || "Curated"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={item.status}
                      onChange={(event) => handleStatusChange(item, event.target.value as MemberRegistryItem["status"])}
                      className="rounded-full border border-mauve/30 bg-white px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal/70 shadow-inner"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="gold"
                      size="sm"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default Plan;
