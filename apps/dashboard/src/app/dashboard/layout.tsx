export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { ReactNode } from "react";
import { fetchAuthenticatedUser, type AuthenticatedUser, type UserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileMenu from "@/components/dashboard/ProfileMenu";
import { greatVibes, nunito, playfair } from "@/app/fonts";
import DashboardPrimaryNav from "@/components/dashboard/PrimaryNav";
import MemberLayout from "@/components/layouts/MemberLayout";
import LogoutButton from "@/components/LogoutButton";
import DashboardSidebar from "@/components/navigation/DashboardSidebar";
import { getNavForRole } from "@/config/navigation";
import Link from "next/link";

type DashboardLayoutProps = {
  children: ReactNode;
};

type DashboardShellCopy = {
  headerSubtitle: string;
  asideTitle: string;
  asideDescription: string;
};

type DashboardShellProps = DashboardShellCopy & {
  user: AuthenticatedUser;
  children: ReactNode;
};

type RoleConfig = DashboardShellCopy;

const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  MEMBER: {
    headerSubtitle: "Member Dashboard",
    asideTitle: "Navigate",
    asideDescription: "Explore every part of your bespoke concierge journey with ease.",
  },
  MENTOR: {
    headerSubtitle: "Mentor Studio",
    asideTitle: "Guide families",
    asideDescription:
      "Monitor mentees, confirm salon events, and celebrate milestones tailored to your cohort.",
  },
  ADMIN: {
    headerSubtitle: "Admin Control Center",
    asideTitle: "Operations overview",
    asideDescription:
      "Manage invites, mentor availability, and registry health to deliver concierge-level care.",
  },
};

function DashboardShell({ user, children, headerSubtitle, asideTitle, asideDescription }: DashboardShellProps) {
  const homeHref =
    user.role === "ADMIN"
      ? ("/dashboard/admin" as const)
      : user.role === "MENTOR"
        ? ("/dashboard/mentor" as const)
        : ("/dashboard/member" as const);
  const navItems = getNavForRole(user.role);

  return (
    <div
      className={[
        greatVibes.variable,
        nunito.variable,
        playfair.variable,
        "min-h-screen bg-tm-ivory text-tm-charcoal antialiased",
      ].join(" ")}
    >
      <DashboardPrimaryNav profileMenu={<ProfileMenu user={user} />} brandHref={homeHref} />

      <div className="flex min-h-screen flex-col bg-tm-ivory pb-24 md:pb-0">
        <header className="relative z-10 border-b border-tm-gold/40 bg-white/85 px-6 py-6 shadow-[0_12px_35px_rgba(177,132,153,0.12)] backdrop-blur-sm lg:px-10">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-tm-mauve/80">
              {headerSubtitle}
            </p>
            <h1 className="font-serif text-2xl text-tm-charcoal">{asideTitle}</h1>
            <p className="text-sm text-tm-charcoal/80">{asideDescription}</p>
          </div>
          <div className="mt-4 flex items-center justify-between md:hidden">
            <ProfileMenu user={user} />
            <LogoutButton className="rounded-full border border-tm-mauve/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-tm-charcoal transition hover:bg-tm-blush/60 hover:text-tm-mauve">
              Logout
            </LogoutButton>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto rounded-full border border-tm-gold/30 bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-tm-mauve lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-3 py-1 hover:bg-tm-blush/30">
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 px-6 py-10 lg:flex-row lg:px-10">
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-10 space-y-6">
              <div className="rounded-2xl border border-tm-gold/40 bg-white p-6 shadow-soft">
                <p className="font-serif text-xl text-tm-mauve">{asideTitle}</p>
                <p className="mt-3 text-sm text-tm-charcoal/80">{asideDescription}</p>
              </div>
              <DashboardSidebar role={user.role} />
            </div>
          </aside>

          <main className="flex-1">
            <MemberLayout>{children}</MemberLayout>
          </main>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }
  const config = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.MEMBER;

  return (
    <DashboardShell user={user} {...config}>
      {children}
    </DashboardShell>
  );
}
