import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const portalDestinations = useMemo(
    () => ({
      admin: "/admin",
      mentor: "/mentor",
      client: "/dashboard",
    }),
    []
  );

  const navLinks = useMemo(
    () => [
      { label: "Home", target: "home", to: "/" },
      { label: "How It Works", target: "how-it-works", to: "/#how-it-works" },
      { label: "Membership", target: "membership", to: "/#membership" },
      { label: "Blog", to: "/blog" },
    ],
    []
  );

  const requestInviteLink = useMemo(
    () => ({ label: "Request Invite", target: "request-invite", to: "/#request-invite" }),
    []
  );

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    window.requestAnimationFrame(() => {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      targetElement.focus?.({ preventScroll: true });
    });
  }, [location]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnchorNavigation = (event, link) => {
    event.preventDefault();

    const { target, to } = link;
    closeMenu();

    if (target && location.pathname === "/") {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        section.focus?.({ preventScroll: true });
        return;
      }
    }

    if (to === "/") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        scrollToTop();
      }
      return;
    }

    navigate(to);
  };

  const portalHome = portalDestinations[role] || "/portal";

  const handleHomeClick = (event) => {
    event.preventDefault();
    closeMenu();
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      scrollToTop();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/65 backdrop-blur-md transition-shadow">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="relative flex items-center justify-between gap-4 rounded-full border border-primary/25 bg-white/90 px-4 py-3 shadow-soft ring-1 ring-white/60 sm:px-6 md:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-softPink/45 via-white/85 to-softMint/45" aria-hidden="true" />
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-full border border-primary/30 bg-white/90 px-3 py-2 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Return to Taylor-Made Baby Co. home"
            onClick={handleHomeClick}
          >
            <span
              aria-hidden="true"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/35 bg-softPink/50 shadow-soft transition group-hover:scale-105"
            >
              <span className="flex items-center gap-1">
                <span className="font-cursive text-[1.45rem] leading-none text-primary">T</span>
                <span className="font-cursive text-[1.2rem] leading-none text-primary/75">M</span>
              </span>
            </span>
            <span className="hidden flex-col leading-tight text-left sm:flex">
              <span className="font-cursive text-xl leading-none text-primary">Taylor-Made</span>
              <span className="mt-1 text-[0.62rem] font-serif uppercase tracking-[0.32em] text-neutral-600">Baby Co.</span>
            </span>
          </Link>

          <nav className="hidden flex-1 justify-center md:flex" aria-label="Primary">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={(event) => handleAnchorNavigation(event, link)}
                    className="group relative inline-flex items-center rounded-full px-4 py-2 text-[0.7rem] font-heading uppercase tracking-[0.32em] text-neutral-600 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <span className="absolute inset-x-2 bottom-1 h-1 rounded-full bg-primary/60 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#request-invite"
              onClick={(event) => {
                if (requestInviteLink) {
                  handleAnchorNavigation(event, requestInviteLink);
                }
              }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Request an invite"
            >
              Request Invite
            </a>
            <Link
              to={portalHome}
              className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-white px-6 py-2 text-xs font-heading uppercase tracking-[0.32em] text-primary shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-softPink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {token ? "Portal" : "Member Login"}
            </Link>
            {token && (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-white/85 px-6 py-2 text-xs font-heading uppercase tracking-[0.32em] text-neutral-600 shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-softMint/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Log Out
              </button>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-white/90 p-2.5 text-primary shadow-soft transition duration-200 hover:scale-105 hover:bg-softPink/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-sm md:hidden"
            aria-hidden="true"
            onClick={closeMenu}
          />
          <nav
            aria-label="Mobile"
            className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-50 md:hidden"
          >
            <ul className="space-y-3 rounded-[2.5rem] border border-primary/30 bg-white/96 p-6 shadow-dreamy backdrop-blur">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={(event) => handleAnchorNavigation(event, link)}
                    className="block rounded-2xl px-4 py-3 text-sm font-heading uppercase tracking-[0.32em] text-neutral-600 transition hover:bg-softPink/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/request-invite"
                  onClick={closeMenu}
                  className="block rounded-full bg-primary px-4 py-3 text-center text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  Request Invite
                </Link>
              </li>
              <li>
                <Link
                  to={portalHome}
                  onClick={closeMenu}
                  className="block rounded-full border border-primary/30 bg-white px-4 py-3 text-center text-xs font-heading uppercase tracking-[0.32em] text-primary transition hover:-translate-y-0.5 hover:scale-105 hover:bg-softPink/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {token ? "Portal" : "Member Login"}
                </Link>
              </li>
              {token && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full rounded-full border border-primary/30 bg-white/90 px-4 py-3 text-xs font-heading uppercase tracking-[0.32em] text-neutral-600 transition hover:-translate-y-0.5 hover:scale-105 hover:bg-softMint/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Log Out
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
};

export default Navbar;
