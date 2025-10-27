import type { ReactNode } from "react";
import { requireMember } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import ProfileMenu from "@/components/dashboard/ProfileMenu";
import { greatVibes, nunito, playfair } from "@/app/fonts";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireMember();

  return (
    <div
      className={[
        greatVibes.variable,
        nunito.variable,
        playfair.variable,
        "min-h-screen bg-[#FFFAF8] text-[#3E2F35] antialiased",
      ].join(" ")}
    >
      <div className="flex min-h-screen flex-col">
        <header className="relative z-10 flex flex-col gap-6 border-b border-[#C8A1B4]/40 bg-gradient-to-br from-[#FFFAF8] via-[#EAC9D1]/45 to-[#C8A1B4]/40 px-6 py-6 shadow-[0_20px_45px_rgba(200,161,180,0.18)] lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-[var(--font-great-vibes)] text-3xl text-[#C8A1B4]">Taylor-Made Baby Co.</p>
              <p className="font-[var(--font-playfair)] text-lg text-[#3E2F35]/80">Member Dashboard</p>
            </div>
            <ProfileMenu user={user} />
          </div>
          <div className="lg:hidden">
            <DashboardNav orientation="horizontal" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 px-6 py-8 lg:flex-row lg:px-10 lg:py-10">
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-10 space-y-6">
              <div className="rounded-[2rem] border border-[#C8A1B4]/35 bg-white/85 p-6 shadow-[0_18px_40px_rgba(200,161,180,0.18)]">
                <p className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">Navigate</p>
                <p className="mt-2 text-sm text-[#3E2F35]/65">
                  Explore every part of your bespoke concierge journey with ease.
                </p>
              </div>
              <DashboardNav orientation="vertical" />
            </div>
          </aside>

          <main className="flex-1">
            <div className="mx-auto max-w-5xl space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
