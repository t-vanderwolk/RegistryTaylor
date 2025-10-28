import { requireAdmin } from "@/lib/auth";

const SETTINGS_SECTIONS = [
  {
    id: "branding",
    title: "Branding & typography",
    description: "Update fonts, color palette, and imagery guidelines for concierge collateral.",
    actions: ["Upload assets", "View style guide"],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Control cadence for mentor alerts, registry churn signals, and operations escalations.",
    actions: ["Edit channels", "Manage escalation rules"],
  },
  {
    id: "roles",
    title: "Roles & permissions",
    description: "Configure mentor, admin, and concierge access. Align with onboarding template updates.",
    actions: ["Review access", "Sync onboarding"],
  },
];

export const metadata = {
  title: "Admin · Settings",
  description: "Configure Taylor-Made operations settings.",
};

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Settings</p>
        <h1 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Taylor-Made controls</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Update branding, operations alerts, and role permissions. Everything cascades to member experiences in real
          time.
        </p>
      </header>

      <section className="space-y-5">
        {SETTINGS_SECTIONS.map((section) => (
          <article
            key={section.id}
            className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/35 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
          >
            <h2 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">{section.title}</h2>
            <p className="mt-3 text-sm text-[#3E2F35]/70">{section.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {section.actions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                >
                  {action} →
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <h2 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Automation rules</h2>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Align concierge workflows with marketing automation. Use tags to trigger sequences when mentors mark modules
          complete or add registry essentials.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.9rem] border border-[#C8A1B4]/25 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Automation</p>
            <h3 className="mt-2 font-semibold text-[#3E2F35]">Registry milestone nudges</h3>
            <p className="mt-2 text-xs text-[#3E2F35]/65">
              Send concierge reminders when members add fewer than 3 essentials within 7 days of module completion.
            </p>
          </div>
          <div className="rounded-[1.9rem] border border-[#C8A1B4]/25 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Automation</p>
            <h3 className="mt-2 font-semibold text-[#3E2F35]">Mentor capacity alerts</h3>
            <p className="mt-2 text-xs text-[#3E2F35]/65">
              Flag admin team when mentors cross 20 active members or journal response time exceeds 24 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
