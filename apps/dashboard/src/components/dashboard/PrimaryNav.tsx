"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    href: "/dashboard/member" as Route,
    Icon: Home,
    isActive: (_pathname) => _pathname === "/dashboard/member",
  },
  {
    label: "Learn",
    href: "/dashboard/member/learn/welcome" as Route,
    Icon: BookOpen,
    isActive: (_pathname) =>
      _pathname.startsWith("/dashboard/member/learn") || _pathname.startsWith("/dashboard/academy"),
  },
  {
    label: "Plan & Registry",
    href: "/dashboard/member/plan" as Route,
    Icon: ClipboardList,
    isActive: (_pathname) =>
      _pathname.startsWith("/dashboard/member/plan") || _pathname.startsWith("/dashboard/member/registry"),
  },
  {
    label: "Journal",
    href: "/dashboard/member/journal" as Route,
    Icon: PenTool,
    isActive: (_pathname) =>
      _pathname.startsWith("/dashboard/member/journal") ||
      _pathname.startsWith("/dashboard/academy/workbook"),
  },
  {
    label: "Community",
    href: "/dashboard/member/community" as Route,
    Icon: Users,
    isActive: (_pathname) =>
      _pathname.startsWith("/dashboard/member/community") ||
      _pathname.startsWith("/dashboard/member/events"),
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

export default function PrimaryNav({
  profileMenu,
  navItems,
  showAuthControls = true,
  ctaLink = DEFAULT_CTA,
  brandHref = "/dashboard/member" as Route,
  showMobileNav = true,
}: PrimaryNavProps) {
  const pathname = usePathname() ?? "";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);

  const computedNavItems = useMemo(() => {
    if (navItems) {
      return navItems;
    }
    if (brandHref !== "/dashboard/member") {
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

  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen((prev) => !prev);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(target) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(target)
      ) {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

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

      {showMobileNav ? (
        <>
          <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-mauve-500/10 bg-ivory/95 px-4 py-3 shadow-sm shadow-mauve-500/10 backdrop-blur md:hidden">
            <Link href={brandHref} className="flex items-center gap-2" aria-label="Taylor-Made Baby Co. home">
              <span className="font-script text-2xl text-mauve-500 tracking-tight">Taylor-Made</span>
              <span className="text-[0.6rem] font-[var(--font-playfair-sc)] font-semibold uppercase tracking-[0.35em] text-charcoal">
                Baby Co.
              </span>
            </Link>
            <button
              type="button"
              onClick={toggleMobileNav}
              ref={mobileToggleRef}
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation menu"
              className={[
                "inline-flex items-center gap-2 rounded-full border border-mauve-500/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition",
                mobileNavOpen ? "bg-mauve-500 text-white" : "text-charcoal hover:bg-blush-200/50",
              ].join(" ")}
            >
              <span>{mobileNavOpen ? "Close" : "Menu"}</span>
              <span
                aria-hidden
                className={[
                  "relative block h-3 w-4",
                  mobileNavOpen ? "text-white" : "text-charcoal",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute left-0 block h-0.5 w-full origin-center rounded-full bg-current transition",
                    mobileNavOpen ? "top-1/2 rotate-45" : "top-0",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 block h-0.5 w-full origin-center rounded-full bg-current transition",
                    mobileNavOpen ? "opacity-0" : "top-1/2 -translate-y-1/2",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 block h-0.5 w-full origin-center rounded-full bg-current transition",
                    mobileNavOpen ? "top-1/2 -rotate-45" : "bottom-0",
                  ].join(" ")}
                />
              </span>
            </button>
          </nav>
          {mobileNavOpen ? (
            <>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="fixed inset-0 z-30 bg-[rgba(17,8,10,0.45)] backdrop-blur-sm md:hidden"
                onClick={closeMobileNav}
              />
              <div className="absolute inset-x-0 top-[3.75rem] z-40 px-4 md:hidden" aria-label="Mobile navigation">
                <div
                  ref={mobilePanelRef}
                  className="rounded-3xl border border-mauve-500/20 bg-ivory px-5 pb-6 pt-5 shadow-[0_25px_60px_rgba(33,12,21,0.25)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-charcoal/50">Navigate</p>
                  {profileMenu ? <div className="mt-3">{profileMenu}</div> : null}
                  <ul className="mt-4 space-y-2">
                    {computedNavItems.map(({ label, href, isActive }) => {
                      const active = isActive ? isActive(pathname) : pathname === href;
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            onClick={closeMobileNav}
                            className={[
                              "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition",
                              active
                                ? "bg-mauve-500 text-white shadow-mauve-card"
                                : "bg-white text-charcoal hover:bg-blush-200/70",
                            ].join(" ")}
                          >
                            <span>{label}</span>
                            <span aria-hidden>→</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-4 space-y-2">
                    {showAuthControls ? (
                      <LogoutButton className="w-full rounded-full border border-mauve-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal transition hover:bg-blush-200/70">
                        Logout
                      </LogoutButton>
                    ) : ctaLink ? (
                      <Link
                        href={ctaLink.href}
                        onClick={closeMobileNav}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mauve-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-mauve-card transition hover:bg-mauve-400"
                      >
                        {ctaLink.label}
                      </Link>
                    ) : null}
                    <p className="text-center text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-charcoal/50">
                      Crafted for calm journeys
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}
