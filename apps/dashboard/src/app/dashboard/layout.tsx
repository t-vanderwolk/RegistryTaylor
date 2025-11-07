"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AuthenticatedUser, UserRole } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import MentorDashboardNav from "@/components/dashboard/MentorDashboardNav";
import AdminDashboardNav from "@/components/dashboard/AdminDashboardNav";
import ProfileMenu from "@/components/dashboard/ProfileMenu";
import { greatVibes, nunito, playfair } from "@/app/fonts";
import DashboardPrimaryNav from "@/components/dashboard/PrimaryNav";
import MemberLayout from "@/components/layouts/MemberLayout";
import LogoutButton from "@/components/LogoutButton";

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

type RoleConfig = DashboardShellCopy & { NavComponent: NavComponent };

const STORAGE_KEY = "tm_user";

const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  MEMBER: {
    NavComponent: DashboardNav,
    headerSubtitle: "Member Dashboard",
    asideTitle: "Navigate",
    asideDescription: "Explore every part of your bespoke concierge journey with ease.",
  },
  MENTOR: {
    NavComponent: MentorDashboardNav,
    headerSubtitle: "Mentor Studio",
    asideTitle: "Guide families",
    asideDescription: "Monitor mentees, confirm salon events, and celebrate milestones tailored to your cohort.",
  },
  ADMIN: {
    NavComponent: AdminDashboardNav,
    headerSubtitle: "Admin Control Center",
    asideTitle: "Operations overview",
    asideDescription: "Manage invites, mentor availability, and registry health to deliver concierge-level care.",
  },
};

function hydrateStoredUser(): AuthenticatedUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthenticatedUser) : null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function DashboardShell({
  user,
  children,
  headerSubtitle,
  asideTitle,
  asideDescription,
  NavComponent,
}: DashboardShellProps) {
  const homeHref =
    user.role === "ADMIN"
      ? ("/dashboard/admin" as const)
      : user.role === "MENTOR"
      ? ("/dashboard/mentor" as const)
      : ("/dashboard/member" as const);

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
          <div className="mt-4 lg:hidden">
            <NavComponent orientation="horizontal" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 px-6 py-10 lg:flex-row lg:px-10">
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-10 space-y-6">
              <div className="rounded-2xl border border-tm-gold/40 bg-white p-6 shadow-soft">
                <p className="font-serif text-xl text-tm-mauve">{asideTitle}</p>
                <p className="mt-3 text-sm text-tm-charcoal/80">{asideDescription}</p>
              </div>
              <NavComponent orientation="vertical" />
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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [checked, setChecked] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (checked || hasRedirected.current) {
      return;
    }

    const stored = hydrateStoredUser();
    if (stored) {
      setUser(stored);
      setChecked(true);
      return;
    }

    setChecked(true);
    hasRedirected.current = true;
    router.replace("/login");
  }, [checked, router]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      const next = hydrateStoredUser();
      if (next) {
        setUser(next);
        return;
      }
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace("/login");
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  const config = useMemo(() => {
    if (!user) return null;
    return ROLE_CONFIG[user.role] ?? ROLE_CONFIG.MEMBER;
  }, [user]);

  if (!checked || !user || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tm-ivory text-tm-charcoal">
        <p className="text-sm font-semibold tracking-[0.35em] uppercase text-tm-mauve/70">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <DashboardShell user={user} {...config}>
      {children}
    </DashboardShell>
  );
}
