import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ isScrolled = false }) => {
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
      { label: "Home", to: "/" },
      { label: "Learn · Plan · Connect", to: "/how-it-works" },
      { label: "Membership Journey", to: "/membership" },
      { label: "Concierge Journal", to: "/blog" },
      { label: "Request Your Invite", to: "/request-invite" },
      { label: "Member Portal", to: "/portal" },
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

  const handleNavigation = (event, link) => {
    event.preventDefault();

    const { to } = link;
    closeMenu();

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

  const headerClasses = [
    "sticky top-0 z-50 transition-all duration-300",
    isScrolled ? "bg-blush/90 shadow-soft backdrop-blur" : "bg-transparent",
  ]
    .filter(Boolean)
    .join(" ");

  const shellClasses = [
    "flex items-center gap-2 rounded-[3rem] border px-3 py-2 transition-all duration-300 sm:gap-4 sm:px-4 sm:py-3",
    isScrolled
      ? "border-mauve/35 bg-white/95 shadow-[0_24px_60px_-30px_rgba(200,161,180,0.45)]"
      : "border-white/40 bg-white/60 backdrop-blur-sm shadow-[0_20px_55px_-32px_rgba(200,161,180,0.35)]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClasses}>
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className={shellClasses}>
          <div className="flex flex-1 items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-full bg-transparent px-2 py-1 text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              aria-label="Return to Taylor-Made Baby Co. home"
              onClick={handleHomeClick}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-mauve/40 bg-mauve/30 shadow-inner">
                <span className="font-script text-xl" style={{ color: "rgb(166, 138, 178)" }}>TM</span>
              </span>
              <div className="flex flex-col leading-none text-left">
                <span className="font-script text-[1.1rem] sm:text-xl" style={{ color: "rgb(166, 138, 178)" }}>Taylor-Made</span>
                <span className="text-[0.52rem] font-heading uppercase tracking-[0.45em] text-charcoal/70 sm:text-[0.56rem]">Baby Co.</span>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-4 lg:gap-5 md:flex" aria-label="Primary">
              {navLinks.map((link) => {
                const adjustedLink =
                  link.label === "Member Portal" ? { ...link, to: portalHome } : link;
                const isCta = link.label === "Request Your Invite" || link.label === "Member Portal";
                const base =
                  "relative px-2 py-1 text-[0.62rem] font-heading uppercase tracking-[0.5em] transition sm:px-3 sm:text-[0.68rem] after:absolute after:left-2 after:right-2 after:-bottom-2 after:h-px after:rounded-full after:bg-mauve/80 after:opacity-0 after:transition-opacity after:content-['']";
                const path = adjustedLink.to.split("#")[0];
                const isActive =
                  (path === "/" && location.pathname === "/") ||
                  (path !== "/" && location.pathname.startsWith(path) && path.length > 1);
                const classes = isCta
                  ? "rounded-full bg-mauve px-4 py-2 text-[0.62rem] font-heading uppercase tracking-[0.45em] text-white shadow-[0_10px_30px_-18px_rgba(166,138,178,0.65)] hover:brightness-105 after:hidden"
                  : `${base} ${isActive ? "text-charcoal after:opacity-100" : "text-charcoal/60 hover:text-charcoal hover:after:opacity-70"}`;
                return (
                  <a
                    key={link.label}
                    href={adjustedLink.to}
                    onClick={(event) => handleNavigation(event, adjustedLink)}
                    className={classes}
                  >
                    {link.label === "Member Portal" && token ? "My Portal" : link.label}
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
                className="rounded-full border border-mauve/40 bg-white px-4 py-2 text-[0.62rem] font-heading uppercase tracking-[0.45em] text-charcoal transition hover:bg-mauve/15"
              >
                Log Out
              </button>
            )}
          </div>
          <button
            type="button"
            className="ml-2 inline-flex items-center justify-center rounded-full border border-mauve/30 bg-white/90 p-2.5 text-mauve shadow-soft transition duration-200 hover:scale-105 hover:bg-blush/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
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
            className="fixed inset-0 z-40 bg-mauve/20 backdrop-blur-sm md:hidden"
            aria-hidden="true"
            onClick={closeMenu}
          />
          <nav
            aria-label="Mobile"
            className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-50 md:hidden"
          >
            <ul className="flex flex-wrap justify-center gap-3 rounded-[2.5rem] border border-mauve/30 bg-white/96 p-6 shadow-dreamy backdrop-blur">
              {navLinks.map((link) => {
                const adjustedLink =
                  link.label === "Member Portal" ? { ...link, to: portalHome } : link;
                const isCta = link.label === "Request Your Invite" || link.label === "Member Portal";
                return (
                  <li key={link.label} className="flex">
                    <a
                      href={adjustedLink.to}
                      onClick={(event) => handleNavigation(event, adjustedLink)}
                      className={
                        isCta
                          ? "block rounded-full bg-mauve px-5 py-2 text-center text-xs font-heading uppercase tracking-[0.4em] text-white shadow-[0_10px_30px_-18px_rgba(166,138,178,0.65)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                          : "block rounded-full px-4 py-2 text-center text-xs font-heading uppercase tracking-[0.4em] text-charcoal/70 transition hover:bg-mauve/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/40"
                      }
                    >
                      {link.label === "Member Portal" && token ? "My Portal" : link.label}
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
                    className="w-full rounded-full border border-mauve/40 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.4em] text-charcoal transition hover:bg-mauve/15"
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
