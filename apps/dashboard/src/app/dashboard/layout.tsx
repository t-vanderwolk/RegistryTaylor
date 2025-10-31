import type { ComponentType, ReactNode } from "react";
import type { AuthenticatedUser } from "@/lib/auth";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import DashboardNav from "@/components/dashboard/DashboardNav";
import MentorDashboardNav from "@/components/dashboard/MentorDashboardNav";
import AdminDashboardNav from "@/components/dashboard/AdminDashboardNav";
import ProfileMenu from "@/components/dashboard/ProfileMenu";
import { greatVibes, nunito, playfair } from "@/app/fonts";
import DashboardPrimaryNav from "@/components/dashboard/PrimaryNav";

type DashboardLayoutProps = {
  children: ReactNode;
};

type NavComponent = ComponentType<{ orientation?: "horizontal" | "vertical" }>;

type DashboardShellCopy = {
  headerSubtitle: string;
  asideTitle: string;
  asideDescription: string;
};

type DashboardShellProps = DashboardShellCopy & {
  user: AuthenticatedUser;
  children: ReactNode;
  NavComponent: NavComponent;
};

function DashboardShell({
  user,
  children,
  headerSubtitle,
  asideTitle,
  asideDescription,
  NavComponent,
}: DashboardShellProps) {
  return (
    <div
      className={[
        greatVibes.variable,
        nunito.variable,
        playfair.variable,
        "min-h-screen bg-ivory text-charcoal-500 antialiased",
      ].join(" ")}
    >
      <DashboardPrimaryNav profileMenu={<ProfileMenu user={user} />} />

      <div className="flex min-h-screen flex-col bg-ivory pb-24 md:pb-0">
        <header className="relative z-10 border-b border-gold/30 bg-white/85 px-6 py-6 shadow-[0_12px_35px_rgba(200,161,180,0.12)] backdrop-blur-sm lg:px-10">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mauve-500/80">
              {headerSubtitle}
            </p>
            <h1 className="font-serif text-2xl text-charcoal-700">{asideTitle}</h1>
            <p className="text-sm text-charcoal-500/80">{asideDescription}</p>
          </div>
          <div className="mt-4 flex items-center justify-between md:hidden">
            <ProfileMenu user={user} />
            <Link
              href="/logout"
              className="rounded-full border border-[#C8A1B4]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/30"
            >
              Logout
            </Link>
          </div>
          <div className="mt-4 lg:hidden">
            <NavComponent orientation="horizontal" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 px-6 py-10 lg:flex-row lg:px-10">
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-10 space-y-6">
              <div className="rounded-2xl border border-gold/30 bg-white p-6 shadow-md">
                <p className="font-serif text-xl text-charcoal-700">{asideTitle}</p>
                <p className="mt-3 text-sm text-charcoal-500">{asideDescription}</p>
              </div>
              <NavComponent orientation="vertical" />
            </div>
          </aside>

          <main className="flex-1">
            <div className="mx-auto max-w-screen-xl space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireUser();

  if (user.role === "MENTOR") {
    return (
      <DashboardShell
        user={user}
        NavComponent={MentorDashboardNav}
        headerSubtitle="Mentor Studio"
        asideTitle="Guide families"
        asideDescription="Monitor mentees, confirm salon events, and celebrate milestones tailored to your cohort."
      >
        {children}
      </DashboardShell>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <DashboardShell
        user={user}
        NavComponent={AdminDashboardNav}
        headerSubtitle="Admin Control Center"
        asideTitle="Operations overview"
        asideDescription="Manage invites, mentor availability, and registry health to deliver concierge-level care."
      >
        {children}
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      user={user}
      NavComponent={DashboardNav}
      headerSubtitle="Member Dashboard"
      asideTitle="Navigate"
      asideDescription="Explore every part of your bespoke concierge journey with ease."
    >
      {children}
    </DashboardShell>
  );
}
