import type { ComponentType, ReactNode } from "react";
import type { AuthenticatedUser } from "@/lib/auth";
import { requireUser } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import MentorDashboardNav from "@/components/dashboard/MentorDashboardNav";
import AdminDashboardNav from "@/components/dashboard/AdminDashboardNav";
import ProfileMenu from "@/components/dashboard/ProfileMenu";
import { greatVibes, nunito, playfair } from "@/app/fonts";

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
      <div className="flex min-h-screen flex-col bg-ivory">
        <header className="relative z-10 flex flex-col gap-6 border-b border-gold/30 bg-white px-6 py-6 shadow-sm lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-end gap-1">
                <span className="font-script text-3xl text-mauve-700 leading-none">Taylor-Made</span>
                <span className="font-serif text-lg text-charcoal-700 leading-none">Baby Co.</span>
              </p>
              <p className="font-serif text-base text-charcoal-500">{headerSubtitle}</p>
            </div>
            <ProfileMenu user={user} />
          </div>
          <div className="lg:hidden">
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
