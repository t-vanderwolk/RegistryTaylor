import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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

    if (to === "/") {
      event.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      closeMenu();
    } else {
      closeMenu();
    }
  };

  return (
    <header className="border-b border-gold/25 bg-gradient-to-b from-ivory via-ivory/95 to-ivory/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link
          to="/"
          className="flex items-center gap-4 text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-gold/30 bg-white shadow-elevated-sm">
            <img
              src="/images/logo-mark.svg"
              alt="Taylor-Made Baby Co."
              className="h-8 w-8"
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-xl tracking-[0.12em] text-charcoal">Taylor-Made</span>
            <span className="font-heading text-[0.7rem] uppercase tracking-[0.4em] text-charcoal/70">
              Baby Co.
            </span>
          </span>
        </Link>

        <nav className="hidden gap-6 md:flex" aria-label="Primary navigation">
          {items.map((item) => {
            const path = item.to.split("#")[0];
            const isActive =
              (path === "/" && location.pathname === "/") ||
              (path && path !== "/" && location.pathname.startsWith(path) && path.length > 1);

            return (
              <a
                key={item.label}
                href={item.to}
                onClick={(event) => handleNavigation(event, item)}
                className={clsx(
                  "relative inline-flex items-center text-sm font-heading uppercase tracking-[0.32em] transition duration-150",
                  "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:scale-x-0 after:bg-gold after:transition-transform after:duration-150 after:content-['']",
                  isActive
                    ? "text-charcoal after:scale-x-100"
                    : "text-charcoal/60 hover:text-charcoal hover:after:scale-x-100"
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-charcoal/10 text-charcoal transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory md:hidden"
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

      {open && (
        <div id="mobile-nav" className="border-t border-gold/20 bg-ivory/98 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "rounded-lg px-4 py-3 text-sm font-heading uppercase tracking-[0.32em] transition duration-150",
                    isActive ? "bg-white text-charcoal shadow-elevated-sm" : "text-charcoal/70 hover:bg-white/60"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
