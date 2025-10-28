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
      if (event.key === "Escape") setIsMenuOpen(false);
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
              >
                Log Out
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
