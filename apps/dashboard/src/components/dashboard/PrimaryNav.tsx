"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  ClipboardList,
  PenTool,
  Users,
  LifeBuoy,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

type NavItem = {
  label: string;
  href: Route;
  Icon?: LucideIcon;
  isActive?: (_pathname: string) => boolean;
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
    isActive: (_pathname) => _pathname === "/dashboard",
  },
  {
    label: "Learn",
    href: "/dashboard/learn/welcome" as Route,
    Icon: BookOpen,
    isActive: (_pathname) =>
      _pathname.startsWith("/dashboard/learn") || _pathname.startsWith("/dashboard/academy"),
  },
  {
    label: "Plan",
    href: "/dashboard/plan" as Route,
    Icon: ClipboardList,
    isActive: (_pathname) => _pathname.startsWith("/dashboard/plan"),
  },
  {
    label: "Journal",
    href: "/dashboard/journal" as Route,
    Icon: PenTool,
    isActive: (_pathname) =>
      _pathname.startsWith("/dashboard/journal") || _pathname.startsWith("/dashboard/academy/workbook"),
  },
  {
    label: "Community",
    href: "/dashboard/community" as Route,
    Icon: Users,
    isActive: (_pathname) =>
      _pathname.startsWith("/dashboard/community"),
  },
  {
    label: "Support",
    href: "/dashboard/support" as Route,
    Icon: LifeBuoy,
    isActive: (_pathname) => _pathname.startsWith("/dashboard/support"),
  },
];

const DEFAULT_CTA: CtaLink = {
  label: "Request Invite",
  href: "/request-invite" as Route,
};

function desktopLinkClasses(active: boolean) {
  const base =
    "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-gold after:opacity-0 after:transition after:duration-200";
  const inactive = "text-charcoal hover:text-mauve-500 hover:after:opacity-100";
  const activeClasses = "text-mauve-500 after:opacity-100";
  return [base, active ? activeClasses : inactive].join(" ");
}

function mobileLinkClasses(active: boolean) {
  const base = "flex flex-col items-center gap-1 rounded-full px-3 py-2 text-[11px] font-semibold transition";
  const inactive = "text-charcoal/70 hover:text-mauve-500";
  const activeClasses = "text-charcoal bg-blush-200/40";
  return [base, active ? activeClasses : inactive].join(" ");
}

function mobileMenuLinkClasses(active: boolean) {
  const base =
    "flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-base font-semibold transition";
  const inactive = "text-charcoal/80 hover:border-mauve-300/40 hover:bg-white";
  const activeClasses = "border-mauve-200 bg-white text-mauve-600 shadow-sm";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-40 hidden border-b border-mauve-500/15 bg-ivory/80 px-6 py-3 shadow-md shadow-mauve-500/20 backdrop-blur-sm md:flex">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-6">
          <Link href={brandHref} className="flex items-baseline space-x-2" aria-label="Taylor-Made Baby Co. home">
            <span className="font-script text-3xl text-mauve-500 tracking-tight md:text-4xl">Taylor-Made</span>
            <span className="font-[var(--font-playfair-sc)] text-sm font-semibold uppercase tracking-[0.35em] text-charcoal md:text-base">
              Baby Co.
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-mauve-500/20 bg-white/75 px-3 py-1">
            {computedNavItems.map(({ label, href, Icon, isActive }) => {
              const active = isActive ? isActive(pathname) : pathname === href;
              return (
                <Link key={href} href={href} className={desktopLinkClasses(active)}>
                  {Icon ? <Icon className="h-4 w-4 text-mauve-500" /> : null}
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {showAuthControls ? (
            <div className="flex items-center gap-3">
              {profileMenu}
              <LogoutButton className="rounded-full border border-mauve-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-charcoal transition hover:bg-blush-200/60 hover:text-mauve-600">
                Logout
              </LogoutButton>
            </div>
          ) : ctaLink ? (
            <Link
              href={ctaLink.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-mauve-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-charcoal transition hover:bg-blush-200/60 hover:text-mauve-600"
            >
              {ctaLink.label}
            </Link>
          ) : (
            <div className="h-8" aria-hidden />
          )}
        </div>
      </nav>

      {!showMobileNav ? (
        <nav className="sticky top-0 z-40 border-b border-mauve-500/15 bg-ivory/90 px-4 py-3 shadow-md shadow-mauve-500/15 backdrop-blur md:hidden">
          <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between">
            <Link
              href={brandHref}
              className="flex flex-col leading-tight"
              aria-label="Taylor-Made Baby Co. home"
            >
              <span className="font-script text-2xl text-mauve-500 tracking-tight">Taylor-Made</span>
              <span className="text-[0.65rem] font-[var(--font-playfair-sc)] font-semibold uppercase tracking-[0.35em] text-charcoal">
                Baby Co.
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-mauve-500/30 bg-white/70 text-charcoal shadow-sm transition hover:bg-white"
              aria-expanded={mobileMenuOpen}
              aria-controls="primary-nav-mobile-menu"
            >
              <span className="sr-only">Toggle navigation</span>
              {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
          <div
            id="primary-nav-mobile-menu"
            className={`mx-auto mt-3 flex w-full max-w-screen-lg flex-col gap-2 rounded-3xl border border-mauve-500/15 bg-white/90 p-3 shadow-[0_18px_45px_rgba(62,47,53,0.12)] transition-all duration-200 ${mobileMenuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
          >
            {computedNavItems.map(({ label, href, Icon, isActive }) => {
              const active = isActive ? isActive(pathname) : pathname === href;
              return (
                <Link key={href} href={href} className={mobileMenuLinkClasses(active)}>
                  <span className="flex items-center gap-3">
                    {Icon ? <Icon className="h-5 w-5 text-mauve-500" /> : null}
                    {label}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-mauve-400">Go</span>
                </Link>
              );
            })}

            {showAuthControls ? (
              <div className="mt-1 flex flex-col gap-3 rounded-2xl border border-mauve-100 bg-blush-100/40 p-3">
                {profileMenu ? <div className="rounded-2xl bg-white p-3 shadow-sm">{profileMenu}</div> : null}
                <LogoutButton className="rounded-full border border-mauve-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-charcoal transition hover:bg-blush-200/60 hover:text-mauve-600">
                  Logout
                </LogoutButton>
              </div>
            ) : ctaLink ? (
              <Link
                href={ctaLink.href}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-mauve-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-charcoal transition hover:bg-blush-200/60 hover:text-mauve-600"
              >
                {ctaLink.label}
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}

      {showMobileNav ? (
        <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 flex-col items-center rounded-3xl border border-mauve-500/20 bg-ivory/95 px-4 py-3 text-center shadow-[0_22px_55px_rgba(200,161,180,0.26)] backdrop-blur md:hidden">
          <Link href={brandHref} className="flex flex-col items-center gap-1 pb-3" aria-label="Taylor-Made Baby Co. home">
            <span className="font-script text-2xl text-mauve-500 tracking-tight">Taylor-Made</span>
            <span className="text-[0.65rem] font-[var(--font-playfair-sc)] font-semibold uppercase tracking-[0.35em] text-charcoal">
              Baby Co.
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
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-mauve-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-charcoal transition hover:bg-blush-200/60 hover:text-mauve-600"
            >
              {ctaLink.label}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
