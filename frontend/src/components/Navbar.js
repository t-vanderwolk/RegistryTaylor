import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/taylor-made-logo.png";

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const portalDestinations = useMemo(
    () => ({
      admin: "/admin-portal",
      mentor: "/mentor-portal",
      client: "/client-portal",
    }),
    []
  );

  const navLinks = useMemo(
    () => [
      { label: "Home", target: "home", to: "/" },
      { label: "How It Works", target: "how-it-works", to: "/#how-it-works" },
      { label: "Membership", target: "membership", to: "/#membership" },
      { label: "Blog", to: "/blog" },
      { label: "Request Invite", target: "request-invite", to: "/#request-invite" },
    ],
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

  const renderNavLink = (link) => (
    <li key={link.label}>
      <a
        href={link.to}
        onClick={(event) => handleAnchorNavigation(event, link)}
        className="relative inline-flex items-center rounded-full px-4 py-2 text-sm font-heading uppercase tracking-[0.3em] text-blueberry/80 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/70 focus-visible:ring-offset-2 focus-visible:ring-offset-softBeige hover:text-blueberry"
      >
        {link.label}
      </a>
    </li>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-babyBlue/20 bg-white/95 shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 md:flex-nowrap">
        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:flex-1">
          <Link to="/" className="flex min-w-0 flex-1 items-center gap-3" onClick={handleHomeClick}>
            <img
              src={logoImage}
              srcSet={`${logoImage} 1x, ${logoImage} 2x`}
              alt="Taylor-Made Baby Co. logo"
              className="h-9 w-auto sm:h-12"
            />
            <div className="leading-tight text-blueberry">
              <span className="block font-heading text-lg sm:text-xl">Taylor-Made Baby Co.</span>
              <span className="hidden text-xs font-body uppercase tracking-[0.4em] text-blueberry/70 sm:block">
                Baby Planning Concierge
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-babyBlue/40 bg-white p-2 text-blueberry shadow-soft transition duration-200 hover:bg-babyPink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex" aria-label="Primary">
          <ul className="flex items-center gap-2">{navLinks.map(renderNavLink)}</ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#request-invite"
            onClick={(event) => handleAnchorNavigation(event, navLinks[3])}
            className="inline-flex items-center justify-center rounded-full border border-babyBlue/30 bg-white px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-babyPink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Request an invite"
          >
            Request Invite
          </a>
          <Link
            to={portalHome}
            className="inline-flex items-center justify-center rounded-full border border-babyBlue/40 bg-white px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-skyMist focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {token ? "Portal" : "Member Login"}
          </Link>
          {token && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-full border border-blueberry/15 bg-blueberry/90 px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-cream shadow-soft transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-midnight focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Log Out
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-midnight/20 backdrop-blur-sm md:hidden"
            aria-hidden="true"
            onClick={closeMenu}
          />
          <nav
            aria-label="Mobile"
            className="absolute left-0 right-0 top-full z-50 px-4 pb-6 md:hidden"
          >
            <ul className="space-y-3 rounded-3xl border border-babyBlue/30 bg-white/95 p-6 shadow-dreamy">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={(event) => handleAnchorNavigation(event, link)}
                    className="block rounded-2xl px-4 py-3 text-sm font-heading uppercase tracking-[0.3em] text-blueberry/80 transition hover:bg-babyPink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/70"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/request-invite"
                  onClick={closeMenu}
                  className="block rounded-full border border-babyBlue/30 bg-white px-4 py-3 text-center text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-babyPink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
                >
                  Request Invite
                </Link>
              </li>
              <li>
                <Link
                  to={portalHome}
                  onClick={closeMenu}
                  className="block rounded-full border border-babyBlue/40 bg-white px-4 py-3 text-center text-xs font-heading uppercase tracking-[0.35em] text-blueberry transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-skyMist focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
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
                    className="w-full rounded-full border border-blueberry/20 bg-blueberry/90 px-4 py-3 text-xs font-heading uppercase tracking-[0.35em] text-cream transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-midnight focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
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
