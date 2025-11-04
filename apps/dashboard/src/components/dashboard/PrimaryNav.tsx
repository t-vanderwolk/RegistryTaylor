"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  ClipboardList,
  PenTool,
  Users,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: Route;
  Icon?: LucideIcon;
  isActive?: (pathname: string) => boolean;
};

type CtaLink = {
  label: string;
  href: Route;
};

type PrimaryNavProps = {
  profileMenu?: ReactNode;
  navItems?: ReadonlyArray<NavItem>;
  showAuthControls?: boolean;
  ctaLink?: CtaLink | null;
  brandHref?: Route;
  showMobileNav?: boolean;
};

const DASHBOARD_NAV_ITEMS: ReadonlyArray<NavItem> = [
  {
    label: "Home",
    href: "/dashboard" as Route,
    Icon: Home,
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    label: "Learn",
    href: "/dashboard/learn" as Route,
    Icon: BookOpen,
    isActive: (pathname) =>
      pathname.startsWith("/dashboard/learn") || pathname.startsWith("/dashboard/academy"),
  },
  {
    label: "Plan",
    href: "/dashboard/plan" as Route,
    Icon: ClipboardList,
    isActive: (pathname) =>
      pathname.startsWith("/dashboard/plan") || pathname.startsWith("/dashboard/registry"),
  },
  {
    label: "Journal",
    href: "/dashboard/journal" as Route,
    Icon: PenTool,
    isActive: (pathname) =>
      pathname.startsWith("/dashboard/journal") || pathname.startsWith("/dashboard/academy/workbook"),
  },
  {
    label: "Community",
    href: "/dashboard/community" as Route,
    Icon: Users,
    isActive: (pathname) =>
      pathname.startsWith("/dashboard/community") || pathname.startsWith("/dashboard/connect"),
  },
];

const DEFAULT_CTA: CtaLink = {
  label: "Request Invite",
  href: "/request-invite" as Route,
};

function desktopLinkClasses(active: boolean) {
  const base =
    "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAC9D1]/60 after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-[#EAC9D1] after:opacity-0 after:transition after:duration-200";
  const inactive = "text-[#3E2F35] hover:text-[#C8A1B4] hover:after:opacity-100";
  const activeClasses =
    "text-[#3E2F35] after:opacity-100";
  return [base, active ? activeClasses : inactive].join(" ");
}

function mobileLinkClasses(active: boolean) {
  const base = "flex flex-col items-center gap-1 rounded-full px-3 py-2 text-[11px] font-semibold transition";
  const inactive = "text-[#3E2F35]/70 hover:text-[#C8A1B4]";
  const activeClasses = "text-[#3E2F35] bg-[#EAC9D1]/30";
  return [base, active ? activeClasses : inactive].join(" ");
}

export default function PrimaryNav({
  profileMenu,
  navItems,
  showAuthControls = true,
  ctaLink = DEFAULT_CTA,
  brandHref = "/dashboard" as Route,
  showMobileNav = true,
}: PrimaryNavProps) {
  const pathname = usePathname();

  const computedNavItems = useMemo(() => {
    if (navItems) {
      return navItems;
    }
    if (brandHref !== "/dashboard") {
      return DASHBOARD_NAV_ITEMS.map((item) => {
        if (item.label !== "Home") {
          return item;
        }

        return {
          ...item,
          href: brandHref,
          isActive: (currentPath: string) => currentPath === brandHref,
        } satisfies NavItem;
      });
    }

    return DASHBOARD_NAV_ITEMS;
  }, [navItems, brandHref]);

  return (
    <>
      <nav className="sticky top-0 z-40 hidden border-b border-[#C8A1B4]/30 bg-white/90 px-6 py-3 shadow-[0_18px_45px_rgba(200,161,180,0.14)] backdrop-blur-sm md:flex">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-6">
          <Link href={brandHref} className="flex items-center gap-2" aria-label="Taylor-Made Baby Co. home">
            <span className="font-script text-2xl leading-none text-[#3E2F35]">Taylor-Made</span>
            <span className="mx-2 inline-block h-4 w-px bg-[#D9C48E]/25 align-middle" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3E2F35]">Baby Co.</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-[#C8A1B4]/20 bg-white/80 px-3 py-1">
            {computedNavItems.map(({ label, href, Icon, isActive }) => {
              const active = isActive ? isActive(pathname) : pathname === href;
              return (
                <Link key={href} href={href} className={desktopLinkClasses(active)}>
                  {Icon ? <Icon className="h-4 w-4 text-[#C8A1B4]" /> : null}
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {showAuthControls ? (
            <div className="flex items-center gap-3">
              {profileMenu}
              <Link
                href={"/logout" as Route}
                className="rounded-full border border-[#C8A1B4]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/30"
              >
                Logout
              </Link>
            </div>
          ) : ctaLink ? (
            <Link
              href={ctaLink.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/30"
            >
              {ctaLink.label}
            </Link>
          ) : (
            <div className="h-8" aria-hidden />
          )}
        </div>
      </nav>

      {showMobileNav ? (
        <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 flex-col items-center rounded-3xl border border-[#C8A1B4]/30 bg-white/95 px-4 py-3 text-center shadow-[0_22px_55px_rgba(200,161,180,0.26)] backdrop-blur-lg md:hidden">
          <Link href={brandHref} className="flex flex-col items-center gap-2 pb-3" aria-label="Taylor-Made Baby Co. home">
            <span className="font-script text-2xl leading-none text-[#3E2F35]">Taylor-Made</span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-px bg-[#D9C48E]/25 align-middle" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]">Baby Co.</span>
              <span className="inline-block h-4 w-px bg-[#D9C48E]/25 align-middle" />
            </span>
          </Link>
          {computedNavItems.map(({ label, href, Icon, isActive }) => {
            const active = isActive ? isActive(pathname) : pathname === href;
            return (
              <Link key={href} href={href} className={mobileLinkClasses(active)}>
                {Icon ? <Icon className={`h-5 w-5 ${active ? "text-[#C8A1B4]" : "text-[#3E2F35]/70"}`} /> : null}
                <span>{label}</span>
              </Link>
            );
          })}
          {ctaLink && !showAuthControls ? (
            <Link
              href={ctaLink.href}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/30"
            >
              {ctaLink.label}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
