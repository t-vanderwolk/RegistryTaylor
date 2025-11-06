import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

<<<<<<< HEAD
const Navbar = ({ isScrolled = false }) => {
=======
const Navbar = () => {
>>>>>>> heroku/main
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
<<<<<<< HEAD
      { label: "Home", to: "/" },
      { label: "Learn · Plan · Connect", to: "/how-it-works" },
      { label: "Membership Journey", to: "/membership" },
      { label: "Concierge Journal", to: "/blog" },
      { label: "Request Your Invite", to: "/request-invite" },
      { label: "Member Portal", to: "/portal" },
=======
      { label: "Home", target: "home", to: "/" },
      { label: "How It Works", target: "how-it-works", to: "/#how-it-works" },
      { label: "Membership", to: "/membership" },
      { label: "Blog", to: "/blog" },
      { label: "Request Invite", to: "/request-invite" },
      { label: "Member Login", to: "/portal" },
>>>>>>> heroku/main
    ],
    []
  );

<<<<<<< HEAD
  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
=======

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

>>>>>>> heroku/main
    window.requestAnimationFrame(() => {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      targetElement.focus?.({ preventScroll: true });
    });
  }, [location]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
<<<<<<< HEAD
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
=======

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

>>>>>>> heroku/main
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

<<<<<<< HEAD
  const handleNavigation = (event, link) => {
    event.preventDefault();
    const { to } = link;
    closeMenu();
=======
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

>>>>>>> heroku/main
    if (to === "/") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        scrollToTop();
      }
      return;
    }
<<<<<<< HEAD
=======

>>>>>>> heroku/main
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

<<<<<<< HEAD
  const headerClassName = [
    "sticky top-0 z-50 border-b border-gold/30 bg-white transition-shadow",
    isScrolled ? "shadow-sm" : "shadow-sm",
  ].join(" ");

  const renderLink = (link, isMobile = false) => {
    const adjustedLink = link.label === "Member Portal" ? { ...link, to: portalHome } : link;
    const path = adjustedLink.to.split("#")[0];
    const isActive =
      (path === "/" && location.pathname === "/") ||
      (path !== "/" && location.pathname.startsWith(path) && path.length > 1);
    const isCta = link.label === "Request Your Invite" || link.label === "Member Portal";

    if (isMobile) {
      const baseClass = "block w-full rounded-full px-4 py-2 text-sm font-semibold transition-colors";
      return (
        <a
          key={link.label}
          href={adjustedLink.to}
          onClick={(event) => handleNavigation(event, adjustedLink)}
          className={
            isCta
              ? `${baseClass} bg-mauve-500 text-white hover:bg-mauve-700`
              : `${baseClass} text-charcoal-700 hover:text-mauve-700`
          }
        >
          {link.label === "Member Portal" && token ? "My Portal" : link.label}
        </a>
      );
    }

    if (isCta) {
      return (
        <a
          key={link.label}
          href={adjustedLink.to}
          onClick={(event) => handleNavigation(event, adjustedLink)}
          className="rounded-full bg-mauve-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-mauve-700"
        >
          {link.label === "Member Portal" && token ? "My Portal" : link.label}
        </a>
      );
    }

    return (
      <a
        key={link.label}
        href={adjustedLink.to}
        onClick={(event) => handleNavigation(event, adjustedLink)}
        className={[
          "text-sm font-semibold transition-colors",
          isActive ? "text-mauve-700 underline decoration-2 underline-offset-4" : "text-charcoal-700 hover:text-mauve-700",
        ].join(" ")}
      >
        {link.label}
      </a>
    );
  };

  return (
    <header className={headerClassName}>
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-6 px-6 py-4">
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-end gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Return to Taylor-Made Baby Co. home"
        >
          <span className="font-script text-3xl text-mauve-700 leading-none">Taylor-Made</span>
          <span className="font-serif text-lg text-charcoal-700 leading-none">Baby Co.</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => renderLink(link))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {token && (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-mauve-500 px-5 py-2 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-100"
            >
              Log Out
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-mauve-100 bg-white p-2 text-mauve-700 shadow-sm transition hover:bg-mauve-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden"
        >
          <div className="space-y-3 border-b border-gold/30 bg-ivory px-6 pb-6">
            {navLinks.map((link) => renderLink(link, true))}
            {token && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="block w-full rounded-full border border-mauve-500 px-4 py-2 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-100"
=======
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 rounded-[3rem] border border-primary/40 bg-white/95 px-3 py-2 shadow-[0_25px_55px_-28px_rgba(231,200,221,0.6)] sm:gap-4 sm:px-4 sm:py-3">
          <div className="flex flex-1 items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-full bg-transparent px-2 py-1 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              aria-label="Return to Taylor-Made Baby Co. home"
              onClick={handleHomeClick}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/30 shadow-inner">
                <span className="font-script text-xl" style={{ color: "rgb(166, 138, 178)" }}>TM</span>
              </span>
              <div className="flex flex-col leading-none text-left">
                <span className="font-script text-[1.1rem] sm:text-xl" style={{ color: "rgb(166, 138, 178)" }}>Taylor-Made</span>
                <span className="text-[0.52rem] font-heading uppercase tracking-[0.45em] text-ink/70 sm:text-[0.56rem]">Baby Co.</span>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-4 lg:gap-5 md:flex" aria-label="Primary">
              {navLinks.map((link) => {
                const adjustedLink =
                  link.label === "Member Login" ? { ...link, to: portalHome } : link;
                const isCta = link.label === "Request Invite" || link.label === "Member Login";
                const base =
                  "relative px-2 py-1 text-[0.62rem] font-heading uppercase tracking-[0.5em] transition sm:px-3 sm:text-[0.68rem] after:absolute after:left-2 after:right-2 after:-bottom-2 after:h-px after:rounded-full after:bg-primary/80 after:opacity-0 after:transition-opacity after:content-['']";
                const path = adjustedLink.to.split("#")[0];
                const isActive =
                  (path === "/" && location.pathname === "/") ||
                  (path !== "/" && location.pathname.startsWith(path) && path.length > 1);
                const classes = isCta
                  ? "rounded-full bg-mauveDeep px-4 py-2 text-[0.62rem] font-heading uppercase tracking-[0.45em] text-white shadow-[0_10px_30px_-18px_rgba(166,138,178,0.65)] hover:brightness-105 after:hidden"
                  : `${base} ${isActive ? "text-ink after:opacity-100" : "text-ink/60 hover:text-ink hover:after:opacity-70"}`;
                return (
                  <a
                    key={link.label}
                    href={adjustedLink.to}
                    onClick={(event) => handleAnchorNavigation(event, adjustedLink)}
                    className={classes}
                  >
                    {link.label === "Member Login" && token ? "Portal" : link.label}
                  </a>
                );
              })}
            </nav>

          </div>

          <div className="hidden items-center gap-2 md:flex">
            {token && (
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-primary/40 bg-white px-4 py-2 text-[0.62rem] font-heading uppercase tracking-[0.45em] text-ink transition hover:bg-primary/15"
>>>>>>> heroku/main
              >
                Log Out
              </button>
            )}
          </div>
<<<<<<< HEAD
        </nav>
=======
          <button
            type="button"
            className="ml-2 inline-flex items-center justify-center rounded-full border border-primary/30 bg-white/90 p-2.5 text-primary shadow-soft transition duration-200 hover:scale-105 hover:bg-softPink/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
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
            <ul className="flex flex-wrap justify-center gap-3 rounded-[2.5rem] border border-primary/30 bg-white/96 p-6 shadow-dreamy backdrop-blur">
              {navLinks.map((link) => {
                const adjustedLink =
                  link.label === "Member Login" ? { ...link, to: portalHome } : link;
                const isCta = link.label === "Request Invite" || link.label === "Member Login";
                return (
                  <li key={link.label} className="flex">
                    <a
                      href={adjustedLink.to}
                      onClick={(event) => handleAnchorNavigation(event, adjustedLink)}
                      className={
                        isCta
                          ? "block rounded-full bg-mauveDeep px-5 py-2 text-center text-xs font-heading uppercase tracking-[0.4em] text-white shadow-[0_10px_30px_-18px_rgba(166,138,178,0.65)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                          : "block rounded-full px-4 py-2 text-center text-xs font-heading uppercase tracking-[0.4em] text-ink/70 transition hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      }
                    >
                      {link.label === "Member Login" && token ? "Portal" : link.label}
                    </a>
                  </li>
                );
              })}
              {token && (
                <li className="flex">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full rounded-full border border-primary/40 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.4em] text-ink transition hover:bg-primary/15"
                  >
                    Log Out
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </>
>>>>>>> heroku/main
      )}
    </header>
  );
};

export default Navbar;
