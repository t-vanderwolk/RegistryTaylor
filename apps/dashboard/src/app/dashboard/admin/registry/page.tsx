import { requireAdmin } from "@/lib/auth";

const REGISTRY_HEALTH = [
  { id: "items", label: "Items tracked", metric: "1,248", detail: "+56 this week" },
  { id: "macrobaby", label: "MacroBaby conversions", metric: "68%", detail: "Affiliate id _j=4496818" },
  { id: "alerts", label: "Fulfillment alerts", metric: "5", detail: "3 backorder, 2 price changes" },
];

const ALERTS = [
  {
    id: "alert-1",
    title: "Price change: Newton Crib Mattress",
    detail: "MacroBaby price increased by $20. Notify affected members (4).",
  },
  {
    id: "alert-2",
    title: "Backorder: Silver Cross Wave",
    detail: "Expected restock in 7 days. Suggest Nuna Mixx to impacted members.",
  },
  {
    id: "alert-3",
    title: "Affiliate tracking jitter",
    detail: "Two sessions missing `_j=4496818`. Ensure marketing links use updated parameter.",
  },
];

const TOP_CATEGORIES = [
  { id: "nursery", name: "Nursery atmosphere", percent: 34 },
  { id: "gear", name: "Gear on-the-go", percent: 28 },
  { id: "care", name: "Fourth trimester care", percent: 22 },
  { id: "feeding", name: "Feeding rituals", percent: 16 },
];

export const metadata = {
  title: "Admin · Registry",
  description: "Monitor registry health, affiliate performance, and fulfillment alerts.",
};

export default async function AdminRegistryPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Registry</p>
        <h1 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Macro view</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Align concierge curation with affiliate performance and fulfillment signals before they impact members.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {REGISTRY_HEALTH.map((card) => (
          <div
            key={card.id}
            className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#3E2F35]">{card.metric}</p>
            <p className="mt-2 text-xs text-[#3E2F35]/65">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.55fr,0.45fr]">
        <div className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Fulfillment alerts</p>
              <h2 className="mt-2 font-[var(--font-playfair)] text-xl text-[#3E2F35]">Needs concierge follow-up</h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Export alerts
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {ALERTS.map((alert) => (
              <article
                key={alert.id}
                className="rounded-[2rem] border border-[#C8A1B4]/20 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-5"
              >
                <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">{alert.title}</h3>
                <p className="mt-2 text-sm text-[#3E2F35]/70">{alert.detail}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_25px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(200,161,180,0.4)]"
                  >
                    Assign mentor follow-up
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                  >
                    Dismiss
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/40 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Category mix</p>
          <h2 className="mt-2 font-[var(--font-playfair)] text-xl text-[#3E2F35]">Member gifting focus</h2>
          <ul className="mt-6 space-y-4 text-sm text-[#3E2F35]/75">
            {TOP_CATEGORIES.map((category) => (
              <li key={category.id}>
                <div className="flex items-center justify-between font-semibold text-[#3E2F35]">
                  <span>{category.name}</span>
                  <span>{category.percent}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E]"
                    style={{ width: `${category.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-[2rem] border border-[#C8A1B4]/30 bg-white/90 p-5 text-sm text-[#3E2F35]/70">
            <p>
              Affiliate tracking: All outbound MacroBaby links automatically append{" "}
              <span className="font-semibold text-[#3E2F35]">`_j=4496818`</span>. Monitor for manual overrides during
              concierge sessions.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
