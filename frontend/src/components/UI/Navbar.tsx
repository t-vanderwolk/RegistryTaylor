import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

export type NavItem = {
  label: string;
  to: string;
  target?: string;
};

type NavbarProps = {
  items: NavItem[];
};

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    item: NavItem
  ) => {
    const { target, to } = item;
    const normalizedPath = to.toLowerCase();

    // ✅ Direct route for "About" (/how-it-works)
    if (normalizedPath === "/how-it-works" || normalizedPath === "/howitworks") {
      event.preventDefault();
      navigate("/how-it-works");
      closeMenu();
      return;
    }

    // ✅ Scroll behavior for in-page sections (home only)
    if (target && location.pathname === "/") {
      event.preventDefault();
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        section.focus?.({ preventScroll: true });
        closeMenu();
        return;
      }
    }

    // ✅ Home button (scroll to top)
    if (to === "/") {
      event.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      closeMenu();
      return;
    }

    // ✅ Default route
    event.preventDefault();
    navigate(to);
    closeMenu();
  };

  return (
    <header className="border-b border-tmGold/20 bg-gradient-to-r from-tmMauve via-tmMauve/95 to-tmBlush/90 text-tmIvory shadow-soft">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-4 text-tmIvory focus:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-tmMauve"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-tmIvory/40 bg-tmIvory/10 shadow-soft">
            <img
              src="/images/logo-mark.svg"
              alt="Taylor-Made Baby Co."
              className="h-8 w-8 object-contain"
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </span>
          <span className="flex flex-col leading-tight text-tmIvory">
            <span className="font-display text-3xl tracking-tight">
              Taylor-Made
            </span>
            <span className="font-heading text-[0.7rem] uppercase tracking-[0.5em] text-tmIvory/80">
              Baby Co.
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-3 md:flex" aria-label="Primary navigation">
          {items.map((item) => {
            const path = item.to.split("#")[0].toLowerCase();
            const isActive =
              (path === "/" && location.pathname === "/") ||
              location.pathname.toLowerCase() === path;

            return (
              <a
                key={item.label}
                href={item.to}
                onClick={(event) => handleNavigation(event, item)}
                className={clsx(
                  "relative inline-flex items-center rounded-2xl border border-transparent px-4 py-2 text-[0.68rem] font-heading uppercase tracking-[0.3em] transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmMauve",
                  isActive
                    ? "border-tmGold bg-tmIvory/10 text-tmIvory shadow-soft"
                    : "text-tmIvory/85 hover:text-tmIvory hover:border-tmGold/60 hover:bg-tmIvory/10 hover:shadow-soft"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-tmIvory/30 text-tmIvory transition hover:bg-tmIvory/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-tmMauve md:hidden"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div
          id="mobile-nav"
          className="border-t border-tmGold/30 bg-gradient-to-r from-tmMauve via-tmMauve/95 to-tmBlush/90 px-6 py-4 text-tmIvory md:hidden backdrop-blur"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {items.map((item) => {
              const isActive = location.pathname.toLowerCase() === item.to.split("#")[0].toLowerCase();
              return (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={(event) => handleNavigation(event, item)}
                  className={clsx(
                    "rounded-2xl px-4 py-3 text-sm font-heading uppercase tracking-[0.3em] transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60",
                    isActive
                      ? "border border-tmGold/60 bg-tmIvory/10 text-tmIvory shadow-soft"
                      : "text-tmIvory/80 hover:border hover:border-tmGold/40 hover:bg-tmIvory/5"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
